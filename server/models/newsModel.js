const sequelize = require("../utils/dbConnect");
const Sequelize = require('sequelize');

const User = require("../models/userModel");
const Category = require("../models/categoryModel");

const News = sequelize.define('news', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    image_url: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM(
            'DRAFT',
            'MENUNGGU VERIFIKASI',
            'DITOLAK',
            'DIPUBLIKASIKAN'
        ),
        defaultValue: 'DRAFT'
    },
},{
    timestamps: true
});


module.exports = News;
