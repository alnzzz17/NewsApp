require('dotenv').config();
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinaryConfig");
const fs = require("fs");
const Role = require("../models/roleModel");
const User = require("../models/userModel");

// REGISTER NEW USER (TESTED)
const postUser = async (req, res) => {
    try {
        const { userName, email, password, fullName } = req.body;

        // periksa apakah email atau username sudah ada
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { userName: userName }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "Email or Username already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // membuat user baru
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword,
            fullName
        });

        const newUserData = await User.findByPk(newUser.id, {
            include: {
                model: Role,
                attributes: ["id", "name"]
            }
        });

        // generate jwt token
        const token = jwt.sign(
            { userId: newUser.id },
            process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
        );

        // response jika berhasil
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            data: {
                id: newUserData.id,
                userName: newUserData.userName,
                email: newUserData.email,
                fullName: newUserData.fullName,
                role: newUserData.role
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            status: "Error occured: ",
            message: error.message
        });
    }
};

// USER LOGIN (TESTED)
const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: {
                model: Role,
                attributes: ['id', 'name']
            }
        });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: "error", message: "Invalid Password!" });
        }

        const token = jwt.sign({
            id: user.id,
            userName: user.userName,
            fullName: user.fullName,
            roleId: user.roleId
        }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            status: "success",
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                userName: user.userName,
                fullName: user.fullName,
                profilePict: user.profilePict,
                role: user.role ? {
                    id: user.role.id,
                    name: user.role.name
                } : null
            }
        });

    } catch (error) {
        res.status(500).json({ status: "Login Error: ", message: error.message });
    }
};

// DELETE USER ACCOUNT
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUserId = req.user.id;
        const loggedInUserRoleId = req.user.roleId;

        // Hanya user itu sendiri atau admin (roleId === 1) yang bisa hapus
        if (parseInt(id) !== loggedInUserId && loggedInUserRoleId !== 1) {
            return res.status(403).json({ status: "error", message: "You don't have access" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Hapus foto profil jika bukan default
        if (user.profilePict && !user.profilePict.endsWith("default.jpg")) {
            const publicId = user.profilePict.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`NewsApp/User_Profile_Pictures/${publicId}`);
        }

        // Hapus user dari database
        await User.destroy({ where: { id } });

        res.status(200).json({ status: "success", message: "Account deleted successfully!" });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// EDIT USER ACCOUNT - USER
const editUser = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const userToUpdate = await User.findByPk(loggedInUserId);

        if (!userToUpdate) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const { userName, email, fullName, password } = req.body;
        const file = req.file;

        let updatedFields = {};

        if (userName !== undefined) updatedFields.userName = userName;
        if (email !== undefined) updatedFields.email = email;
        if (fullName !== undefined) updatedFields.fullName = fullName;
        if (password) updatedFields.password = await bcrypt.hash(password, 10);

        if (file) {
            // Hapus gambar lama dari Cloudinary (jika ada)
            if (userToUpdate.profilePict && !userToUpdate.profilePict.endsWith("default.jpg")) {
                const publicId = userToUpdate.profilePict.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`NewsApp/User_Profile_Pictures/${publicId}`);
            }

            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "NewsApp/User_Profile_Pictures",
                use_filename: true,
                unique_filename: false
            });

            updatedFields.profilePict = uploadResult.secure_url;
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        await userToUpdate.update(updatedFields);

        const updatedUser = await User.findByPk(loggedInUserId, {
            attributes: ["id", "userName", "email", "fullName", "profilePict"]
        });

        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// UPDATE USER ROLE - ADMIN ONLY
const updateUserByAdmin = async (req, res) => {
    try {
        // Middleware verifyToken sudah memastikan user adalah admin (roleId === 1)
        const { id } = req.params;
        const { userName, fullName, roleId } = req.body;
        const file = req.file;

        const userToUpdate = await User.findByPk(id);
        if (!userToUpdate) return res.status(404).json({ status: "error", message: "User not found" });

        if (userName !== undefined) userToUpdate.userName = userName;
        if (fullName !== undefined) userToUpdate.fullName = fullName;
        if (roleId !== undefined) userToUpdate.roleId = roleId;

        if (file) {
            if (userToUpdate.profilePict && !userToUpdate.profilePict.endsWith("default.jpg")) {
                const publicId = userToUpdate.profilePict.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`NewsApp/User_Profile_Pictures/${publicId}`);
            }

            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "NewsApp/User_Profile_Pictures",
                use_filename: true,
                unique_filename: false,
            });

            userToUpdate.profilePict = uploadResult.secure_url;
            fs.unlink(file.path, (err) => {
                if (err) console.error("Failed to delete temp file:", err);
            });
        }

        await userToUpdate.save();

        const updatedUser = await User.findByPk(userToUpdate.id, {
            include: {
                model: Role,
                attributes: ["id", "name"]
            }
        });

        res.status(200).json({
            status: "success",
            message: "User updated by admin",
            data: {
                id: updatedUser.id,
                userName: updatedUser.userName,
                fullName: updatedUser.fullName,
                profilePict: updatedUser.profilePict,
                role: updatedUser.role
            }
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// GET ALL USERS - ADMIN ONLY
const getAllUsers = async (req, res) => {
    try {
        // Middleware verifyToken sudah memastikan user adalah admin (roleId === 1)
        const users = await User.findAll({
            attributes: ["id", "userName", "email", "fullName", "profilePict", "createdAt", "updatedAt"],
            include: {
                model: Role,
                attributes: ["id", "name"]
            },
            order: [['createdAt', 'DESC']] // Optional: sort by creation date
        });

        res.status(200).json({
            status: "success",
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

// GET CURRENT USER PROFILE (by token)
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Role,
                attributes: ['id', 'name']
            },
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        res.status(200).json({
            status: "success",
            data: user
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    postUser,
    deleteUser,
    loginHandler,
    editUser,
    updateUserByAdmin,
    getAllUsers,
    getCurrentUser
};