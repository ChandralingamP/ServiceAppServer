const router = require("express").Router();
const db = require("../db/database");

router.route('/details').get(async(req,res)=>{
    let getServiceQuery = `SELECT * FROM servicestypes WHERE 1`
    db.execute(getServiceQuery,(err,result)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.status(200).json(result);
        }
    })
})

module.exports = router;
