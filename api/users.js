/* eslint-disable no-useless-catch */
const express = require("express");
require("dotenv").config();
const bcrypt = require('bcryptjs')
const SALT_COUNT = 10
const { getUserByUsername, createUser, getUserById } = require("../db");
const router = express.Router();

const jwt = require('jsonwebtoken');
const { off } = require("../app");
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
                message: `User ${username} is already taken.`,
            });
        }
        else{
            if(password.length < 8)
            {
                next({
                    name:'PasswordLengthError',
                    message:"Password Too Short!",
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
   const prefix = 'Bearer ';
   const auth = req.header('Authorization');
    //console.log(req.header('Authorization'))
  /*if(!auth) {
    next()
  }
  else if(auth.startsWith(prefix)){
     const token = auth.slice(prefix.length);
     console.log(token)
        try{
            const user = await getUserByUsername(username);
            const hashedPassword = bcrypt.hashSync(password, SALT_COUNT);
            const vPassword = jwt.verify(token, JWT_SECRET);
            if (vPassword === user.password){
                console.log("message")
                res.send()
            }
        }catch({error})
        {
            next({error});
        } 
  }*/
        
    

    
})

// GET /api/users/me
router.get('/me',(req, res, next) =>{
    const auth = req.header('Authorization')
    console.log(auth)

})

// GET /api/users/:username/routines
router.get('/:username/routines', (req, res, next) =>{

})

module.exports = router;
