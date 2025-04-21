const sequelize = require("../utils/dbConnect");
const Sequelize = require('sequelize');

const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    }
},{
    timestamps: false
});

module.exports = Category;