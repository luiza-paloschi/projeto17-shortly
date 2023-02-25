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