const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");
const verifyToken = require("../middlewares/verifyToken");

const {
    postUser,
    loginHandler,
    deleteUser,
    editUser,
    updateUserByAdmin,
    getAllUsers,
    getCurrentUser,
    getAllJournalists
} = require("../controllers/userController");

// Public routes (no authentication needed)
// REGISTER USER
router.post("/register", postUser);

// LOGIN USER / ADMIN
router.post("/login", loginHandler);

// Protected routes (require authentication)
// EDIT USER PROFILE (with optional file upload)
router.put("/edit", verifyToken, upload.single("profilePict"), editUser);

// DELETE USER
router.delete("/delete/:id", verifyToken, deleteUser);

// GET LOGGED IN USER PROFILE
router.get("/me", verifyToken, getCurrentUser);

// Admin-only routes (require admin role)
// UPDATE USER (by admin, including role + profile picture upload)
router.put("/admin/update/:id", verifyToken, upload.single("profilePict"), updateUserByAdmin);

// GET ALL USER (by admin)
router.get("/admin/all-user", verifyToken, getAllUsers);

// GET ALL JOURNALIST (by admin)
router.get("/admin/get/journalists", verifyToken, getAllJournalists);

module.exports = router;