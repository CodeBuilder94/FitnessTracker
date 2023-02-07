const express = require('express');
const router = express.Router();
const {getAllRoutines} = require('../db')
// GET /api/routines
router.get('/', async (req, res, next) =>{
    const routines = await getAllRoutines();
    
    res.send(routines);
})
// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
