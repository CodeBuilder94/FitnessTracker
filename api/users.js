/* eslint-disable no-useless-catch */
const express = require("express");
require("dotenv").config();
const { getUserByUsername, createUser } = require("../db");
const router = express.Router();

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

// POST /api/users/register
router.post("/register", async(req, res, next) =>{
    const {username, password} = req.body;

    try{
        const _user = await getUserByUsername(username);
        
        if(_user)
        {
            next({
                name:'UserExistsError',
                message:"This username already exists",
                error:"UserExistsError"
            });
        }
        else{
            if(password.length < 8)
            {
                next({
                    name:'PasswordLengthError',
                    message:"Password Too Short!",
                    error:"PasswordLengthError"
                })
            }
            else{
                const user = await createUser({username, password});
        

                const token = jwt.sign({
                    id: user.id,
                    username: user.username
                }, process.env.JWT_SECRET,{
                    expiresIn: '1w'
                });


                res.send({
                    message:"You're all signed up, get training!",
                    token: token,
                    user: user
                });
            }
        }
        

    }catch(error)
    {
        
        next(error);
    }
    
} )
// POST /api/users/login
router.post('/login', async (req, res, next) =>{
    const {username, password} = req.body;

    try{
        const user = await getUserByUsername(username);

        console.log(user);

    }catch({name, message})
    {
        next({name, message});
    }
})

// GET /api/users/me
router.get('/me',(req, res, next) =>{

})

// GET /api/users/:username/routines
router.get('/:username/routines', (req, res, next) =>{

})

module.exports = router;
