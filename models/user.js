const Joi = require('joi');
const connection = require('../startup/connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class User {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
        this.createdDate = new Date().toString();
    }
    save = ()=>{
        return new Promise((resolve, reject)=> {
            const query = `INSERT INTO USER SET ?`;
            connection.query(query, this, (err, result)=> {
                if (err)    reject(err);
                resolve (result);
            });
        });
    }
    generateAuthToken = ()=> {
        const expiresIn = 60 * 60; // an hour
        let token = jwt.sign({
            username: this.username,
        }, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN", {expiresIn: expiresIn});
        return token;
    }
}

User.find = (filters, columns=["*"])=> {
    return new Promise((resolve, reject)=>{
        let query=`SELECT ${columns.join(', ')} FROM USER WHERE `, len = Object.keys(filters).length;
        if (filters && typeof filters == 'object') {
            query += Object.keys(filters).map(function (key) {
                return encodeURIComponent(key) + '="' + (filters[key]) + '"';
            }).join('&&');
        }
        connection.query(query, (err, result)=>{
            if (err)    reject(err);
            else resolve(result[0]);
        });
    });
}

User.validate = (user)=>{
    const schema = {
        username: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
        confirmPassword : Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
    };
    return Joi.validate(user, schema);
}
module.exports = User;