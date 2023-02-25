import { userSchema } from "../schemas/authSchemas.js";


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