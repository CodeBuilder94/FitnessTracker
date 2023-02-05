/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser } = require("../db");
const router = express.Router();
const bcrypt = require("bcryptjs")
const SALT_COUNT = 10;


// POST /api/users/register
router.post("/users/register", async(req, res, next) =>{
    const {username, password} = req.body;
    
    try{
        const _user = await getUserByUsername(username);

        if(_user)
        {
            next({
                name:'UserExistsError',
                message:"This username already exists"
            });
        }

        //has the password
        const hashedPassword =  bcrypt.hashSync(password, SALT_COUNT);

        const user = await createUser({username, hashedPassword});
        
        res.send({
            message:"You're all signed up get training!",

        });

    }catch({name, message})
    {
        next({name, message});
    }
    
} )
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
