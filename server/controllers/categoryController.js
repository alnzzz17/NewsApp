const Category = require("../models/categoryModel");

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = await Category.create({ name, description });

        res.status(201).json({
            status: "success",
            message: "Category created successfully!",
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [["id", "ASC"]] });
        res.status(200).json({
            status: "success",
            total: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ status: "error", message: "Category not found." });
        }

        res.status(200).json({ status: "success", data: category });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ status: "error", message: "Category not found." });
        }

        await category.update({ name, description });

        res.status(200).json({ status: "success", message: "Category updated successfully", data: category });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({ status: "error", message: "Category not found." });
        }

        await category.destroy();

        res.status(200).json({ status: "success", message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
