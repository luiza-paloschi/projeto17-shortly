import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import db from '../config/database.js';


export async function signUp(_, res){
    const user = res.locals.user;
  
    try {
    const userExists = await db.query('SELECT * FROM users WHERE email=$1', [user.email]);
    if (userExists.rowCount !== 0) return res.sendStatus(409);
    
    const passwordHash = bcrypt.hashSync(user.password, 10);
    await db.query(`INSERT INTO users (name,email,password) VALUES ($1, $2, $3);`,
         [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}