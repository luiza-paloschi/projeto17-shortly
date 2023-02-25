import joi from "joi";

export const urlSchema = joi.object({
    url: joi.string().uri().required()
}).messages(
    {"string.base": "todos os campos devem estar em formato de texto"},
    {"string.empty": "todos os campos devem estar preenchidos"}
);