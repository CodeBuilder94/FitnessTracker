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
      WHERE id = '${id}'
    ;`)

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
      WHERE "routineId" = '${id}'
    ;`)

    return rows;
    
  }catch(error)
  {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
