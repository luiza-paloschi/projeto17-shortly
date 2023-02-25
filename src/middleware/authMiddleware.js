import { loginSchema, userSchema } from "../schemas/authSchemas.js";
import bcrypt from 'bcrypt'
import db from "../config/database.js";


export async function validateUser(req, res, next){
    const {name, email, password, confirmPassword} = req.body;
    
    try {
        const {error} = userSchema.validate({name, email, password, confirmPassword}, { abortEarly: false })

        if (error) return res.status(422).send(error.details[0].message);
    
        res.locals.user = {name, email, password, confirmPassword};
        next();
    } catch (error) {
        console.log("Erro na validação do user")
        res.status(500).send(error.message);
    }
}

export async function validateLogin(req, res, next){
    const {email, password} = req.body;
   
    try {
        const {error} = loginSchema.validate({email, password}, { abortEarly: false })
        if (error) return res.status(422).send(error.details[0].message);
        
        const user = await db.query('SELECT * FROM  users WHERE email=$1', [email]);
     
        if(user.rowCount === 0  || (!bcrypt.compareSync(password, user.rows[0].password))) return res.sendStatus(401)
        console.log("passouaqui")
        res.locals.login = user.rows[0];
        next();
    } catch (error) {
        console.log("Erro na validação do user")
        res.status(500).send(error.message);
    }
}