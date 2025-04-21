const sequelize = require("../utils/dbConnect");
const Sequelize = require('sequelize');

const Role = sequelize.define('role',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false
});

module.exports = Role;