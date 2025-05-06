const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");

const {
    createNews,
    getNewsById,
    getNewsByAuthor,
    getNewsByCategory,
    getAllNews,
    updateNews,
    updateNewsByAdmin,
    deleteNews
} = require("../controllers/newsController");

// CREATE NEWS (admin & journalist only)
router.post("/new", upload.single("imageUrl"), createNews);

// GET ALL NEWS
router.get("/all", getAllNews);

// GET NEWS BY ID
router.get("/get/:id", getNewsById);

// GET NEWS BY AUTHOR ID
router.get("/author/:authorId", getNewsByAuthor);

// GET NEWS BY CATEGORY ID
router.get("/category/:categoryId", getNewsByCategory);

// UPDATE NEWS (journalist only, only their own news)
router.put("/edit/:id", upload.single("imageUrl"), updateNews);

// UPDATE NEWS BY ADMIN
router.put("/admin/update/:id", upload.single("imageUrl"), updateNewsByAdmin);

// DELETE NEWS (admin or journalist-owner only)
router.delete("/delete/:id", deleteNews);

module.exports = router;