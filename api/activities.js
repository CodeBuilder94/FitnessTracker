const express = require('express');
const router = express.Router();
const {getAllActivities, getPublicRoutinesByActivity} = require('../db')

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async(req, res, next) =>
{
    const activityId =req.params;

    const routines = await getPublicRoutinesByActivity({activityId});

    try{
        res.send(routines);
        //need to finish the error handeling.
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

// PATCH /api/activities/:activityId


module.exports = router;
