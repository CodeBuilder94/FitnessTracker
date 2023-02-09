const express = require('express');
const router = express.Router();
const {getAllActivities, getPublicRoutinesByActivity} = require('../db')
const {JWT_SECRET} = process.env;

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async(req, res, next) =>
{
    const activityId =req.params;

    const routines = await getPublicRoutinesByActivity({activityId});

    try{
        res.send(routines);
        
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
    
    const token =auth.slice(prefix.length);
    const user = jwt.verify(token, JWT_SECRET);
    console.log(user);
})
// PATCH /api/activities/:activityId


module.exports = router;
