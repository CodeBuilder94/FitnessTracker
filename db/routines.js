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
      SELECT routines.*, count , duration, activities.name AS "activityName", 
      activities.id AS "activityId", description, users.username AS "creatorName", routine_activities.id AS "routineActivityId"
      FROM routines
      JOIN routine_activities ON routines.id = routine_activities."routineId"
      JOIN activities ON activities.id = routine_activities."activityId"
      JOIN users ON users.id = routines."creatorId"
    ;`)
    
   let routines = attachActivitiesToRoutines(rows);
   routines = Object.values(routines);
    return routines;

  }catch(error)
  {
    throw error;
  }
}

const attachActivitiesToRoutines = (routines) => {
  const routinesById = {}
  routines.forEach(routine => {
    if(!routinesById[routine.id])
    {
      routinesById[routine.id] = {
        id: routine.id,
        creatorId: routine.creatorId,
        creatorName: routine.creatorName,
        isPublic: routine.isPublic,
        name: routine.name,
        goal: routine.goal,
        activities:[],
      };
    }
    const activity ={
      routineId: routine.id,
      routineActivityId: routine.routineActivityId,
      name: routine.activityName,
      id: routine.activityId,
      description: routine.description,
      count: routine.count,
      duration: routine.duration
    };
    routinesById[routine.id].activities.push(activity);
    
  });
  return routinesById;
}

async function getAllPublicRoutines() {
  const allRoutines = await getAllRoutines();

  const publicRoutines = allRoutines.filter((routine) =>{
    return (routine.isPublic ? true: null);
  })
  
  return publicRoutines;
}

async function getAllRoutinesByUser({ username }) {
  const allRoutines = await getAllRoutines();

  const userRoutines = allRoutines.filter((routine) =>{
    return routine.creatorName ? username: null;
  })
  
  return userRoutines;
}

async function getPublicRoutinesByUser({ username }) {
  const allPublicRoutines = await getAllPublicRoutines();
  
  const publicUserRoutines = allPublicRoutines.filter((routine) =>{
    return routine.creatorName ? username: null;
  })
  
  return publicUserRoutines;
}

async function getPublicRoutinesByActivity({ id }) {
const allPublicRoutines = await getAllPublicRoutines();

const publicActivityRoutines = allPublicRoutines.filter((routine) =>{
  
 
  let containsActivity = false;
  for (let i = 0; i < routine.activities.length; i++) {
        
    if(routine.activities[i].id == id)
    {
      containsActivity = true;
      break;
    }
  }
  
  
    
  return containsActivity;
  
})

  
  return publicActivityRoutines;

}

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
    
    const {rows:[routine]} = await client.query(`
    DELETE
    FROM routines 
    WHERE "id" = $1
    RETURNING *
      ;`, [id])
      
     return routine;
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
