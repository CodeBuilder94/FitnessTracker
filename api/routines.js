const express = require('express');
const router = express.Router();
const {getAllRoutines, createRoutine} = require('../db')
const {JWT_SECRET} = process.env;
const jwt = require('jsonwebtoken')

// GET /api/routines
router.get('/', async (req, res, next) =>{
    const routines = await getAllRoutines();
    
    res.send(routines);
})
// POST /api/routines
router.post('/', async (req, res, next) =>{
    
    try{
        const prefix = 'Bearer ';
        const auth = req.header('Authorization');
        
        if(auth)
        {
            const token = auth.slice(prefix.length);
   
            const curentUser = jwt.verify(token, JWT_SECRET);
    
            const {isPublic, name, goal} = req.body;
            
            const newRoutine = await createRoutine({creatorId:curentUser.id, isPublic:isPublic, name:name, goal:goal});

            res.send(newRoutine);
        }
        else{
            next({
                name:"NeedLogin",
                message:"You must be logged in to perform this action"
            })
        }

        
      
            
            
        

    }catch(error)
    {
        next(error);
    }
})
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
