const sequelize = require("../utils/dbConnect");
const Sequelize = require('sequelize');

const News = require("../models/newsModel");

const Tag = sequelize.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: false
});

const NewsTag = sequelize.define('newsTag', {
    newsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        references: {
            model: News,
            key: 'id'
        }
    },
    tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Tag,
            key: 'id'
        }
    },
}, {
    timestamps: false
});

module.exports = { Tag, NewsTag };