require("dotenv").config();
const Sequelize = require('sequelize');

const sequelize = require("../utils/dbConnect");
const Role = require("../models/roleModel");

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    profilePict: {
        type: Sequelize.TEXT,
        defaultValue: process.env.DEFAULT_PROFILE_PICTURE_URL,
        allowNull: false
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id'
        },
        defaultValue: 3
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = User;