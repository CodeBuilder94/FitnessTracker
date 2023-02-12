const express = require('express');
const router = express.Router();
const {getAllRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine} = require('../db')
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
router.patch('/:routineId', async (req, res, next) =>{

    try{
        const prefix = 'Bearer ';
        const auth = req.header('Authorization');

        if(auth)
        {
            const token = auth.slice(prefix.length);
            const curentUser = jwt.verify(token, JWT_SECRET);

            const routineId = req.params;
            const {isPublic, name, goal} = req.body;

            const routine = await getRoutineById(routineId.routineId);
            
            if(curentUser.id === routine.creatorId)
            {
                const updatedRoutine = await updateRoutine({id:routineId.routineId, isPublic:isPublic, name:name, goal:goal})
                res.send(updatedRoutine);
            }else{
                res.status(403);
                next({
                    name:"NotOwner",
                    message:`User ${curentUser.username} is not allowed to update ${routine.name}`
                })
            }

        }else{
            next({
                name:"NeedLogin",
                message:"You must be logged in to perform this action"
            })
        }

    }catch(error)
    {

    }
})
// DELETE /api/routines/:routineId
router.delete('/:routineId', async (req,res, next) => {
    try{
        const prefix = 'Bearer ';
        const auth = req.header('Authorization');

        if(auth)
        {
            const token = auth.slice(prefix.length);
            const curentUser = jwt.verify(token, JWT_SECRET);

            const routineId = req.params;

            const {name, creatorId} = await getRoutineById(routineId.routineId)
            
            if(curentUser.id === creatorId)
            {
                const deletedRoutine = await destroyRoutine(routineId.routineId);
                console.log(deletedRoutine);
                res.send(deletedRoutine);
            }
            else{
                res.status(403);
                next({
                    name:"NotOwner",
                    message:`User ${curentUser.username} is not allowed to delete ${name}`
                })
            }

        }else{
            next({
                name:"NeedLogin",
                message:"You must be logged in to perform this action"
            })
        }

    }catch(error)
    {
        next({
            name:"Don't own rouinte",
            message:``
        })
    }
})
// POST /api/routines/:routineId/activities

module.exports = router;
