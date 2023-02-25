import db from '../config/database.js';
import { urlSchema } from '../schemas/urlsSchemas.js';
import { nanoid } from 'nanoid'

export async function shortenUrl(req, res){
    const user = res.locals.session;
    const {url} = req.body

    try {
        const {error} = urlSchema.validate({url}, { abortEarly: false })
        if (error) return res.status(422).send(error.details[0].message);

        const short = nanoid(8);
      
        await db.query('INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)', [user.userId, url, short]);

        const response = await db.query('SELECT id, "shortUrl" FROM urls WHERE "shortUrl"=$1', [short])

        res.status(201).send(response.rows[0]);

    } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}


export async function getUrlById(req, res){
    
    const {id} = req.params

    try {
       
        const response = await db.query('SELECT id, "shortUrl", url FROM urls WHERE id=$1', [id]);
        if (response.rowCount === 0) return res.sendStatus(404);
        res.status(200).send(response.rows[0]);

    } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

export async function getUrlByShort(req, res){
    
    const {shortUrl} = req.params

    try {
       
        const response = await db.query('SELECT * FROM urls WHERE "shortUrl"=$1', [shortUrl]);
        if (response.rowCount === 0) return res.sendStatus(404);

        await db.query('UPDATE urls SET "visitCount"=$1 WHERE id=$2;', [(response.rows[0].visitCount + 1), response.rows[0].id])
        
        res.redirect(response.rows[0].url)

    } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

export async function deleteUrl(req, res){
    
    const {id} = req.params
    const user = res.locals.session
    try {
       
        const query= await db.query('SELECT * FROM urls WHERE id=$1', [id]);
        if (query.rowCount === 0) return res.sendStatus(404);

        
        if (user.id !== query.rows[0].userId) return res.sendStatus(401);

       
        await db.query('DELETE FROM urls WHERE id=$1;', [id])
     
        res.sendStatus(204);

    } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}