const express = require('express');
const router = express.Router();
const {getAllActivities, getPublicRoutinesByActivity, createActivity, getActivityById, getActivityByName, updateActivity} = require('../db')
const {JWT_SECRET} = process.env;
const jwt = require('jsonwebtoken')

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async(req, res, next) =>
{
    
    try{
        const routines = await getPublicRoutinesByActivity({id:req.params.activityId});
    
        if(routines.length >0){
            
            res.send(routines);
            
        }
        else{
            
            next({
                name:"Does not exist",
                message: `Activity ${req.params.activityId} not found`
            })
        }
    }catch(error)
    {
        next(error);
    }

})

// GET /api/activities
router.get('/', async(req, res, next) =>{
    const activities = await getAllActivities();
    
    try{

        res.send(activities);

    }catch(error){
        next(error);
    }
})

// POST /api/activities
router.post('/', async(req, res, next) =>{
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    try{
        const token =auth.slice(prefix.length);
        const user = jwt.verify(token, JWT_SECRET);
        const {name, description}=req.body;

        if(user)
        {
            const allActivities = await getAllActivities();
            
            const exists = allActivities.find(element => element.name === name);
            
            if(exists)
            {
                next({
                    name:"ActivityExists",
                    message:`An activity with name ${name} already exists`
                })
            }
            else{
                const newActivity = await createActivity({name, description});

                res.send(newActivity);
            }

        }

    }catch(error){
        next(error);
    }
})
// PATCH /api/activities/:activityId
router.patch('/:activityId', async(req, res, next) =>{
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    const {activityId} = req.params;
    const {name, description}=req.body;
    try{
        const token =auth.slice(prefix.length);
        const user = jwt.verify(token, JWT_SECRET);
        if(user){
            const activity = await getActivityById(activityId)
            if(activity){
                const activityAlreadyExists = await getActivityByName (name)
                
                if(activityAlreadyExists){
                    next({
                        name: "Name already used",
                        message:  `An activity with name ${name} already exists`
                    })
                } 
                const fields = {}
                if(name){
                    fields.name = name
                }
                if(description){
                    fields.description = description
                }
                    const updatedActivity = await updateActivity ({id: activityId, name: name, description: description})
                    

                    res.send (updatedActivity)
                
            }
            else{
                next({
                    name: "Activity does not exist",
                    message: `Activity ${activityId} not found`
                })
            }
        }

        

    
    }catch(error){
        next(error);
    }
    
})

module.exports = router;
