const joi=require('joi')
const { AppErrors } = require('./errors')


const noteScheme=joi.object({
    Title:joi.string().required(),
    Body:joi.string().required(),
    Tags:joi.string(),
})

const userScheme=joi.object({
    Username:joi.string().required().max(25),
    Email:joi.string().email().required(),
    Password:joi.string().required()
})

const valid=(scheme)=>{return(req,res,next)=>{
    console.log( 'body........',req.body)
    const valid=scheme.validate(req.body)
    if (valid.error) {
        res.status(400).send({error:valid.error.details[0].message})
        // throw new AppErrors(400,valid.error)
    } else {
        next()
    }
}}

module.exports={userScheme,valid,noteScheme}