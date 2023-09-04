var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const mongoose = require("mongoose");
require("../models/connection");
const Event = require("../models/events");
const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");



//!__________POST /places : ajout d’un event en base de données (via req.body)__________________________

router.post("/publishEvent", async (req, res) => {
  console.log(req.body.creatorName);
  const addressToLocate = req.body.address;
  // Encoder l'adresse pour gérer les espaces et intégrer l'adresse à l'url d'interrogation de l'API
  const encodedAddressToLocate = encodeURIComponent(addressToLocate);
  // const test = req.body.creatorName

  fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodedAddressToLocate}`)
    .then((response) =>  {
        if (!response.ok) {
            throw new Error("Failed to fetch data from the external API");
          }
          return response.json();

    })
    .then((data) => {
      const latitude = data.features[0].geometry.coordinates[1];
      const longitude = data.features[0].geometry.coordinates[0];
      
      if (latitude === undefined || longitude === undefined) {
        res.json({ result: false, error: "Latitude or longitude not found" });
        return;
      }

      const newEvent = new Event({
        creatorName: req.body.creatorName,
        eventName: req.body.eventName,
        type: req.body.type,
        date: req.body.date,
        hourStart: req.body.hourStart,
        hourEnd: req.body.hourEnd,
        address: req.body.address,
        latitude: latitude,
        longitude: longitude,
        price: req.body.price,
        website: req.body.website,
        description: req.body.description,
        eventCover: "",      // à modifier : mise en place de l'upload de la photo par le user
        users: 
          {
            interUsers: [],
            partUsers: [req.body.creatorName],//! id du creator trouver dans le reducer id
          },
        
      });

      newEvent.save().then(data => {
        User.findOneAndUpdate({_id:req.body.creatorName},{ $push: { 'events.partEvents': data._id } }).then(data=>{
          console.log("update",data);
        res.json({result:true});
    })
      });
    });
    
});



//! ____________________________GET all events_________________________________________________________ 
router.get("/events", async function (req, res) {
    try {
        const events = await Event.find({}).populate("creatorName");
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
});


//! Requête pour obtenir le nom du user à partir de l'id

router.get("/byId", (req, res) => {
  
  Event.findOne({ _id: req.body.idUser}).then((data) => {
    if (!data) {
      // Gérer le cas où l'utilisateur n'est pas trouvé
      res.json({ result: false, message: "Utilisateur non trouvé" });
    } else {
      // Répondre avec les données de l'utilisateur trouvé
      res.json({ result: true, data: data });
    }
  }).catch((err) => {
    // Gérer les erreurs possibles lors de la recherche
    res.json({ result: false, message: "Une erreur s'est produite lors de la recherche de l'utilisateur" });
  });
});



module.exports = router;