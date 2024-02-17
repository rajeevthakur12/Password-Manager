const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {auth} = require('../middleware/auth');
const connection = require('../startup/connection')

router.post('/record', (req, res) => {
    let query = `select * from record where username='${req.body.username}'`
    connection.query(query, (err, result) => {

        try{
            res.json(result)
        }
        catch(error){
            console.log(error)
        }
    })

})

router.post('/add', [auth], async(req, res)=> {
    let query = 'insert into record set ?'
    req.body.secret.lastmodifiedat = new Date().toString()

    let record = req.body.secret

    connection.query(query, record, (err) => {
        if(err){
            console.log(err)
        }
    })
    res.status(201).json({ok: true, message: 'Inserted successfully!'});
});

router.delete('/:id', (req, res) => {
    let query = 'delete from record where id = '+ req.params.id

    connection.query(query, (err) => {
        if(err){
            console.log(err)
        }
        else{
            res.status(201).json({ok: true, message: 'deleted successfully!'});
        }
    })
})

module.exports = router