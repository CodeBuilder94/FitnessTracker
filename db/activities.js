const { de } = require('faker/lib/locales');
const client = require('./client');

// database functions
async function createActivity({ name, description }) {
 try{
const {rows: [activity]} = await client.query(`
INSERT INTO activities(name, description)
VALUES ($1, $2)
ON CONFLICT (name) DO NOTHING
RETURNING *;
`, [name, description])
return activity
 }catch(error){
throw error
 } // return the new activity
}

async function getAllActivities() {
  // select and return an array of all activities
  try{
    const {rows} = await client.query(`
    SELECT *
    FROM activities
    ;`)

    return rows;

  }catch(error)
  {
    throw error;
  }
}

async function getActivityById(id) {
 try{
  const {rows:[activity]} = await client.query(`
  SELECT *
  FROM activities
  WHERE id = $1
;`,[id])
  
  return activity;

 }catch(error)
 {
  throw error;
 }
}

async function getActivityByName(name) {
  try{
    const {rows:[activity]} = await client.query(`
    SELECT *
    FROM activities
    WHERE name = $1
    ;`, [name])
    return activity;
  }catch(error){
    throw error
  }
}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
  const routinesToReturn = [...routines];
  const binds = routines.map((_, idx) => `$${idx+1}`).join(', ')
  
  const routineIds = routines.map(routine => routine.id)
  if(!routineIds ?.length)
  {
    return routinesToReturn;
  }
  
  
  try{
    const {rows:[activities]} =await client.query(`
      SELECT activities.*, routine_activities, routine_activities.count, routine_activities.id
      AS "routineActivityId", routine_activities."routineId"
      FROM activities
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${binds})
    ;`,routineIds)

    for(const routine of routinesToReturn)
    {
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id)
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  }catch(error){
    throw error
  }
}

async function updateActivity({ id, ...fields }) {

//console.log(fields);
const setString = Object.keys(fields).map((key, index) =>{
  return `${key} = $${index +1}`
}
).join(', ');


 try{

  const {rows:[activity]} = await client.query(`
  UPDATE activities
  SET ${setString}
  WHERE id = ${id}
  RETURNING *
  ;`, Object.values(fields))

  return activity;


  }catch (error){
    throw error
  }
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
