const express = require('express');
const router = express.Router();
const {getRoutineActivityById, getRoutineById, destroyRoutineActivity, getUserByUsername} = require('../db')
const {JWT_SECRET} = process.env;
const jwt = require('jsonwebtoken')

// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) =>{
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    const {routineActivityId} = req.params;

    try{
        const token =auth.slice(prefix.length);
        const curentUser = jwt.verify(token, JWT_SECRET);
        

        const {id} = await getUserByUsername(curentUser.username)
        
        const {routineId} = await getRoutineActivityById(routineActivityId)

        //get the creator id of the routine
        const {creatorId, name} = await getRoutineById(routineId);
        
        if(creatorId === id)
        {
            const updatedItem = await destroyRoutineActivity(routineActivityId);

            res.send(updatedItem);
        }else{
            res.status(403);
            next({
                name:"NotOwner",
                message:`User ${curentUser.username} is not allowed to delete ${name}`
            })
        }

    }catch(error)
    {
        
        next(error);
    }
})
module.exports = router;
