const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const {rows:[routine]} = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *
  ;`,[creatorId, isPublic, name, goal])
  
  return routine;

  }catch(error)
  {
    throw error;
  }

}

async function getRoutineById(id) {
  try{
    const {rows:[routine]} = await client.query(`
      SELECT *
      FROM routines
      WHERE id = $1
    ;`,[id])

    return routine;

  }catch(error){
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try{
    const {rows} = await client.query(`
      SELECT *
      FROM routines
    ;`)
    return rows;
  }catch(error)
  {
    throw error;
  }
}

async function getAllRoutines() {
 try{
    const { rows }= await client.query(`
      SELECT routines.*,duration, count, activities.id AS "activityId", activities.name AS "activityName",
      description, users.username AS "creatorName"
      FROM routines
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      JOIN activities ON activities.id = routine_activities."activityId"
      JOIN users ON users.id = routines."creatorId"
    ;`)

    console.log(rows);
    return rows;

  }catch(error)
  {
    throw error;
  }
}

async function getAllPublicRoutines() {

}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {

  const setString = Object.keys(fields).map((key,idx) =>{
    return `"${key}" = $${idx +1}`
  }).join(', ');
  
  try{
    if(setString.length >0)
  {
    const {rows:[routine]} = await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id = ${id}
      RETURNING *
    ;`,Object.values(fields))
    
    return routine;
  }
    return;
  }catch(error)
  {
    throw error;
  }

}

async function destroyRoutine(id) {
  try{
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = $1
    ;`, [id])
    
      await client.query(`
    DELETE
    FROM routines 
    WHERE "id" = $1
      ;`, [id])
      
     
  }catch (error){
    throw error
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
