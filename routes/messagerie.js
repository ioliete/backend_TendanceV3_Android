var express = require('express');
var router = express.Router();

require("../models/connection");


const User = require("../models/users");                      
const Event = require("../models/events");
const Conversation = require('../models/conversations')

const uid2 = require("uid2");

const { checkBody } = require("../modules/checkBody");  

//! recuperer la liste des amis
router.post("/amis",(req,res)=>{
    User.find({_id:req.body.idUser}).populate("amis").then(data =>{
        res.json(data[0].amis)
    })
})

//! ajouter un ami

router.post("/ajouterUnAmi", (req, res) => {
    
    let result ={};
    Event.findById(req.body.idEvent).populate('creatorName').then(data=>{
        let idAmi = data.creatorName._id

        User.findOneAndUpdate(
            { _id: req.body.idUser },
            { $push: { "amis": idAmi } },
        ).then(data => {
            result.addAmi = data; 
            User.findOneAndUpdate(
                { _id: idAmi },
                { $push: { "amis": req.body.idUser } },
            ).then(data => {
                result.addUser = data; 
                res.json({ result: true }); 
            });
        });
    })
});


router.post("/conversation",(req,res)=>{
    
    Conversation.findOne({
        user: { $all: [req.body.idAmi,req.body.idUser] }
    }).then(data=>{
        if(data){
            res.json({id:data._id,messages:data.messages});
        }else{
            const newConversation = new Conversation({
                user: [req.body.idUser,req.body.idAmi],
                messages:[],
            })
            newConversation.save().then((data) => {
                res.json(data._id);
            });
        }
    })
    
})

router.post("/addMessage",(req,res)=>{

    Conversation.findOneAndUpdate(
        { _id : req.body.idConv },
        { $push: { "messages": req.body.message } },
    ).then(data => {
        res.json({result:true});
    })
})





module.exports = router;