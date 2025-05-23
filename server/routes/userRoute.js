const express = require("express");
const router = express.Router();
const upload = require("../middlewares/fileUpload");

const {
    postUser,
    loginHandler,
    deleteUser,
    editUser,
    updateUserByAdmin,
    getAllUsers,
    getCurrentUser
} = require("../controllers/userController");

// REGISTER USER
router.post("/register", postUser);

// LOGIN USER / ADMIN
router.post("/login", loginHandler);

// EDIT USER PROFILE (with optional file upload)
router.put("/edit", upload.single("profilePict"), editUser);

// DELETE USER
router.delete("/delete/:id", deleteUser);

// UPDATE USER (by admin, including role + profile picture upload)
router.put("/admin/update/:id", upload.single("profilePict"), updateUserByAdmin);

// GET ALL USER (by admin)
router.get("/admin/all-user", getAllUsers);

// GET LOGGD IN USER
router.get("/me", getCurrentUser);

module.exports = router;
