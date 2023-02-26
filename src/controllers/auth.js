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

export async function signIn(_, res){
    const user = res.locals.login;

    try {
        console.log("passou")
      const token = uuid();

      const logged = await db.query('SELECT * FROM sessions WHERE "userId"=$1', [user.id]);
      if (logged.rowCount !== 0) {
        await db.query('UPDATE sessions SET token=$1 WHERE "userId"=$2;', [token, user.id])
        return res.send({token});
      }
        
      await db.query(`INSERT INTO sessions ("userId",token) VALUES ($1, $2);`,
      [user.id, token])
       

      res.send({token});
  
  } catch (error) {
    console.error(error);
    res.status(500).send('Algo deu errado');
  }
}

export async function getUser(_, res){
    
  const user = res.locals.session;
  
  try {
     
      const query= await db.query(
      `SELECT users.id, users.name, CAST(COALESCE(SUM(urls."visitCount"), 0) AS INTEGER) as "visitCount",
      CASE
        WHEN COUNT(urls.id) = 0 THEN json_build_array()
        ELSE json_agg(
          json_build_object(
            'id', urls.id,
            'shortUrl', urls."shortUrl",
            'url', urls.url,
            'visitCount', urls."visitCount"
          )
        )
      END as "shortenedUrls"
    FROM users
    LEFT JOIN urls ON users.id = urls."userId"
    WHERE users.id = $1
    GROUP BY users.id;`, [user.userId]);
     
      res.status(200).send(query.rows[0]);

  } catch (error) {
  console.error(error)
  res.status(500).send(error)
  }
}