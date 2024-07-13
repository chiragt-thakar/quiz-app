const { ResourceNotFoundError } = require("../errors/common");
const userModel = require('../models/user')
const getHome = async (req, res, next) => {
    try {
        const users = [
            {
              name: "John Doe",
              email: "john.doe@example.com",
              password: "password123",
              role: "user",
            },
            {
              name: "Jane Smith",
              email: "jane.smith@example.com",
              password: "password123",
              role: "admin",
            },
            {
              name: "Alice Johnson",
              email: "alice.johnson@example.com",
              password: "password123",
              role: "user",
            },
            {
              name: "Bob Brown",
              email: "bob.brown@example.com",
              password: "password123",
              role: "user",
            },
            {
              name: "Charlie Davis",
              email: "charlie.davis@example.com",
              password: "password123",
              role: "admin",
            },
            {
              name: "Diana Evans",
              email: "diana.evans@example.com",
              password: "password123",
              role: "user",
            },
            {
              name: "Ethan Harris",
              email: "ethan.harris@example.com",
              password: "password123",
              role: "admin",
            },
            {
              name: "Fiona Clark",
              email: "fiona.clark@example.com",
              password: "password123",
              role: "user",
            },
            {
              name: "George Walker",
              email: "george.walker@example.com",
              password: "password123",
              role: "user",
            },
            {
              name: "Hannah Young",
              email: "hannah.young@example.com",
              password: "password123",
              role: "admin",
            }
          ];
          
         let data = await userModel.insertMany(users);
          
      
        res.send(data)  
    } catch (error) {
        console.log(error)
        next(error)
    }
};

module.exports = {
    getHome
};