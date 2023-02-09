/* eslint-disable no-useless-catch */
const express = require("express");
require("dotenv").config();
const bcrypt = require('bcryptjs')
const SALT_COUNT = 10
const { getUserByUsername, createUser, getAllRoutinesByUser,getPublicRoutinesByUser } = require("../db");
const router = express.Router();

const jwt = require('jsonwebtoken');
//const { } = require("../app");
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
       
   if(!username || !password) 
   {
    next({
        name:"MissingCredntialsError",
        message: "Please supply both a username and a password"
    });
   }
    
   try{
    const user = await getUserByUsername(username);
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(user && passwordMatch)
    {
        delete user.password;

        const token = jwt.sign({id: user.id, username:user.username}, JWT_SECRET);

        res.send({
            token: token,
            user: user,
            message: "you're logged in!"
        });
    }else{
        next({
            name: "IncorrectCredentialsError",
            message: 'Username or password is incorrect'
        });
    }

   }catch(error)
   {
        next(error);
   }
})

// GET /api/users/me
router.get('/me',(req, res, next) =>{
    const prefix = 'Bearer ';
    const auth = req.header('Authorization')
   
      try{
        const token =auth.slice(prefix.length);
        
        if(!token)
        {
            throw "no token";
        }
        //validate the token to send data
        const data = jwt.verify(token, JWT_SECRET);
              
        
        res.send({
            id: data.id,
            username: data.username,
            iat: data.iat,
            exp: data.exp
        });
        
            
            

      }catch(error)
      {
        res.status(401);
        next({
            error:error,
            name:"No token",
            message:"You must be logged in to perform this action"
        });
      }
        
})

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) =>{
    const {username} = req.params;
    const prefix = 'Bearer ';
    const auth = req.header('Authorization')
    //console.log(token);
    try{
        const token =auth.slice(prefix.length);
        const user = jwt.verify(token, JWT_SECRET);
       
        //Figure out if a user is logged in or not.
        if(user.username === username)
        {
            console.log("test");
            const routines = await getAllRoutinesByUser({username});
            res.send(routines);
        }
        else{
            
            const routines = await getPublicRoutinesByUser({username});
            res.send(routines);
        }
        
        //console.log(routines);
        //res.send(routines);

    }catch(error)
    {
        next(error);
    }
    
})

module.exports = router;
