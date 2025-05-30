require("dotenv").config();

const fs = require("fs");
const { Op } = require("sequelize");
const cloudinary = require("../utils/cloudinaryConfig");
const News = require("../models/newsModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

// CREATE NEWS - ADMIN & JOURNALIST ONLY
const createNews = async (req, res) => {
    try {
        const { categoryId, title, content, authorId: inputAuthorId } = req.body;
        const file = req.file;

        let imageUrl;

        if (file) {
            // Upload gambar ke Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "NewsApp/News_Images",
                use_filename: true,
                unique_filename: false,
            });

            imageUrl = uploadResult.secure_url;

            // Menghapus file temp setelah upload
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        // Menentukan authorId
        let authorId;

        if (req.user.roleId === 1) {
            // Admin bisa input authorId secara manual
            if (!inputAuthorId) {
                return res.status(400).json({
                    status: "error",
                    message: "Author ID is required for admin",
                });
            }
            authorId = inputAuthorId;
        } else {
            // Journalist hanya bisa pakai ID mereka sendiri
            authorId = req.user.id;
        }

        const news = await News.create({
            authorId,
            categoryId,
            title,
            content,
            image_url: imageUrl,
        });

        res.status(201).json({
            status: "success",
            message: "News created",
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// UPDATE NEWS - JOURNALIST ONLY
const updateNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        if (req.user.roleId !== 2 || req.user.id !== news.authorId) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        const file = req.file;
        let imageUrl = news.image_url;

        if (file) {
            // Menghapus gambar lama jika ada
            if (imageUrl) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`NewsApp/News_Images/${publicId}`);
            }

            // Upload gambar baru
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "NewsApp/News_Images",
                use_filename: true,
                unique_filename: false,
            });

            imageUrl = uploadResult.secure_url;

            // Menghapus file temp setelah upload
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        const { title, content, categoryId } = req.body;
        let updatedFields = {};

        if (title !== undefined) updatedFields.title = title;
        if (content !== undefined) updatedFields.content = content;
        if (categoryId !== undefined) updatedFields.categoryId = categoryId;
        if (file) updatedFields.image_url = imageUrl;

        // Status diubah ke 'Menunggu Verifikasi' saat diupdate
        updatedFields.status = "MENUNGGU VERIFIKASI";

        await news.update(updatedFields);

        res.status(200).json({
            status: "success",
            message: "News updated",
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// DELETE NEWS - ADMIN & JOURNALIST (OWNER) ONLY
const deleteNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        if (req.user.roleId !== 1 && req.user.id !== news.authorId) {
            return res.status(403).json({
                status: "error",
                message: "Unauthorized",
            });
        }

        // menghapus gambar dari Cloudinary jika ada
        if (news.image_url) {
            const publicId = news.image_url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`NewsApp/News_Images/${publicId}`);
        }

        await news.destroy();

        res.status(200).json({
            status: "success",
            message: "News deleted",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// UPDATE NEWS - ADMIN
const updateNewsByAdmin = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        const file = req.file;
        let imageUrl = news.image_url;

        if (file) {
            // Hapus gambar lama jika ada
            if (imageUrl) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`NewsApp/News_Images/${publicId}`);
            }

            // Upload gambar baru
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "NewsApp/News_Images",
                use_filename: true,
                unique_filename: false,
            });

            imageUrl = uploadResult.secure_url;

            // Hapus file temp setelah upload
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        const { title, content, status, categoryId } = req.body;
        let updatedFields = {};

        if (title !== undefined) updatedFields.title = title;
        if (content !== undefined) updatedFields.content = content;
        if (status !== undefined) updatedFields.status = status;
        if (categoryId !== undefined) updatedFields.categoryId = categoryId;
        if (file) updatedFields.image_url = imageUrl;

        await news.update(updatedFields);

        res.status(200).json({
            status: "success",
            message: "News updated by admin",
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET ALL NEWS
const getAllNews = async (req, res) => {
    try {
        const news = await News.findAll({
            include: [
                { model: User, attributes: ["id", "userName", "fullName"] },
                { model: Category, attributes: ["id", "name"] },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            status: "success",
            total: news.length,
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET NEWS BY ID
const getNewsById = async (req, res) => {
    try {
        const news = await News.findOne({
            where: { id: req.params.id },
            include: [
                { model: User, attributes: ["id", "userName", "fullName"] },
                { model: Category, attributes: ["id", "name"] },
            ],
        });

        if (!news) {
            return res.status(404).json({
                status: "error",
                message: "News not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET NEWS BY AUTHOR ID
const getNewsByAuthor = async (req, res) => {
    try {
        const news = await News.findAll({
            where: { authorId: req.params.authorId },
            include: [
                { model: User, attributes: ["id", "userName", "fullName"] },
                { model: Category, attributes: ["id", "name"] },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            status: "success",
            total: news.length,
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET NEWS BY CATEGORY ID
const getNewsByCategory = async (req, res) => {
    try {
        const news = await News.findAll({
            where: { categoryId: req.params.categoryId },
            include: [
                { model: User, attributes: ["id", "userName"] },
                { model: Category, attributes: ["id", "name"] },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            status: "success",
            total: news.length,
            data: news,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = {
    createNews,
    getAllNews,
    getNewsById,
    getNewsByAuthor,
    getNewsByCategory,
    updateNews,
    updateNewsByAdmin,
    deleteNews,
};