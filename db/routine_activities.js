const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    const {rows: [activity]} = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    ;`,[routineId, activityId, count, duration])
    
    return activity;
  }catch(error)
  {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try{
    const {rows:[routineActivity]} = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id = $1
    ;`,[id])

    return routineActivity;

  }catch(error)
  {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try{
    const {rows} = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE "routineId" = $1
    ;`,[id])

    return rows;
    
  }catch(error)
  {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map((key, index) => {
    return `${key} = $${index + 1}` 
  }).join(', ')
 
  try{
    const {rows: [routineActivities]} = await client.query(`
    UPDATE routine_activities
    SET ${setString} 
    WHERE id = ${id}
    RETURNING *
    ;`, Object.values(fields))
   
    return routineActivities;
    }catch (error){
      throw error
    }
}


async function destroyRoutineActivity(id) {
  try{
   const {rows:[routineActivity]} =await client.query (`
    DELETE FROM routine_activities
    WHERE id = $1 
    RETURNING *
    ;`, [id])

    return routineActivity;

  }catch (error) {
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  
  const {rows:[routineId]} = await client.query(`
    SELECT "routineId"
    FROM routine_activities
    WHERE id = $1
  ;`,[routineActivityId])

  const idOfRoutine = routineId.routineId;
  
  const {rows:[creatorId]} = await client.query(`
    SELECT "creatorId"
    FROM routines
    WHERE id = $1
  ;`,[idOfRoutine])
  
  if( creatorId.creatorId === userId)
  {
    return true;
  }
  else{
    return false;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
