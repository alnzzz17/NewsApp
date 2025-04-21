require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("./dbConnect");

const User = require("../models/userModel");
const Role = require("../models/roleModel");
const News = require("../models/newsModel");
const Category = require("../models/categoryModel");
// const Comment = require("../models/Comment");
// const Like = require("../models/Like");
// const Report = require("../models/Report");
// const Notification = require("../models/Notification");
// const { NewsTags, Tag } = require("../models/Tag");

// User & Role (1:1)
User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });

// User & News (1:N)
User.hasMany(News, { foreignKey: "authorId" });
News.belongsTo(User, { foreignKey: "authorId" });

// Category & News (1:N)
Category.hasMany(News, { foreignKey: "categoryId" });
News.belongsTo(Category, { foreignKey: "categoryId" });

// // User & Comment (1:N)
// User.hasMany(Comment, { foreignKey: "user_id" });
// Comment.belongsTo(User, { foreignKey: "user_id" });

// // News & Comment (1:N)
// News.hasMany(Comment, { foreignKey: "news_id" });
// Comment.belongsTo(News, { foreignKey: "news_id" });

// // Nested Comments (1:N)
// Comment.hasMany(Comment, { foreignKey: "parent_comment_id", as: "replies" });
// Comment.belongsTo(Comment, { foreignKey: "parent_comment_id", as: "parent" });

// // User & Like (1:N)
// User.hasMany(Like, { foreignKey: "user_id" });
// Like.belongsTo(User, { foreignKey: "user_id" });

// // News/Comments & Like (1:N)
// News.hasMany(Like, { foreignKey: "news_id" });
// Like.belongsTo(News, { foreignKey: "news_id" });
// Comment.hasMany(Like, { foreignKey: "comment_id" });
// Like.belongsTo(Comment, { foreignKey: "comment_id" });

// // User & Report (1:N)
// User.hasMany(Report, { foreignKey: "user_id" });
// Report.belongsTo(User, { foreignKey: "user_id" });

// // News/Comments & Report (1:N)
// News.hasMany(Report, { foreignKey: "news_id" });
// Report.belongsTo(News, { foreignKey: "news_id" });
// Comment.hasMany(Report, { foreignKey: "comment_id" });
// Report.belongsTo(Comment, { foreignKey: "comment_id" });

// // User & Notification (1:N)
// User.hasMany(Notification, { foreignKey: "user_id" });
// Notification.belongsTo(User, { foreignKey: "user_id" });

// // News & Tags (N:M) melalui NewsTags
// News.belongsToMany(Tag, { through: NewsTags, foreignKey: "news_id" });
// Tag.belongsToMany(News, { through: NewsTags, foreignKey: "tag_id" });

// CREATE CATEGORIES
const createDefaultCategories = async () => {
    const defaultCategories = [
        { name: "Pendidikan", description: "Berita seputar pendidikan dan dunia akademik" },
        { name: "Politik", description: "Berita politik dalam dan luar negeri" },
        { name: "Ekonomi", description: "Informasi ekonomi dan keuangan" },
        { name: "Olahraga", description: "Berita olahraga terkini" },
        { name: "Gaya Hidup", description: "Tren, fashion, dan gaya hidup" },
        { name: "Hiburan", description: "Berita artis, film, musik" },
        { name: "Teknologi", description: "Inovasi dan perkembangan teknologi" },
        { name: "Nasional", description: "Berita dalam negeri" },
        { name: "Internasional", description: "Berita luar negeri" },
        { name: "Otomotif", description: "Informasi mobil, motor, dan otomotif lainnya" },
        { name: "Kesehatan", description: "Tips dan berita seputar kesehatan" }
    ];

    for (const cat of defaultCategories) {
        await Category.findOrCreate({ where: { name: cat.name }, defaults: cat });
    }

    console.log("Categories ensured.");
};

// CREATE ROLES
const createRoles = async () => {
    const roles = ['Admin', 'Jurnalis', 'Pembaca'];
    for (const name of roles) {
        await Role.findOrCreate({ where: { name } });
    }
    console.log("Roles ensured.");
};

// CREATE ADMIN
const createAdminIfNotExists = async () => {
    try {
        const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULLNAME, ADMIN_ROLE, DEFAULT_PROFILE_PICTURE_URL } = process.env;

        const existingAdmin = await User.findOne({ where: { email: ADMIN_EMAIL } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

            await User.create({
                userName: ADMIN_USERNAME,
                email: ADMIN_EMAIL,
                password: hashedPassword,
                fullName: ADMIN_FULLNAME,
                roleId: ADMIN_ROLE,
                profilePict: DEFAULT_PROFILE_PICTURE_URL
            });

            console.log("Admin created successfully.");
        } else {
            console.log("Admin is already exist.");
        }
    } catch (error) {
        console.error("Error creating admin:", error.message);
    }
};

// ASSOCIATION
const association = async () => {
    try {
        await sequelize.sync({ force: false });
        // await createRoles();
        // await createAdminIfNotExists();
        // await createDefaultCategories();
    } catch (error) {
        console.log("Sync error:", error.message);
    }
};

module.exports = association;
