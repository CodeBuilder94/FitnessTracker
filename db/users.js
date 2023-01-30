const client = require("./client");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  try{ 

    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

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

}catch(error){
  throw error 
}
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {
try{
const {rows:[user]} = await client.query(`
SELECT username
FROM users
WHERE username = '${userName}'; 
`)
console.log(user.username);
return user.username;
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
