const client = require("./client");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  try{ 
    
    const hashedPassword = bcrypt.hashSync(password, SALT_COUNT);

    const {rows:[user]} = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *
    ;`,[username, hashedPassword]);

    delete user.password;

    return user;
  }catch(error)
  {
    throw error
  }
}

async function getUser({ username, password }) {
try{
const user = await getUserByUsername(username);
const hashedPassword = user.password;

let passwordCheck = await bcrypt.compare(password, hashedPassword)

if(passwordCheck)
{
  delete user.password;
  return user;
}else{
  return;
}


}catch(error){
  throw error 
}
}

async function getUserById(userId) {
try{
const {rows: [user]} = await client.query(`
SELECT *
FROM users
WHERE id = $1
;`,[userId])

delete user.password

return user
}catch(error){
throw error
}
}

async function getUserByUsername(userName) {
try{
const {rows:[user]} = await client.query(`
SELECT *
FROM users
WHERE username = $1; 
`,[userName])

return user;
}catch(error){
  throw error
}
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
