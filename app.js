const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Court = require('./models/court-model.js');

const app = express();                                          

// CHANGE BACK THE PASSWORD
const dbURI = "mongodb+srv://croc:<password>@playlah.wlgykth.mongodb.net/playlah?retryWrites=true&w=majority"

mongoose.connect(dbURI)
.then(console.log("connected to db"))
.then(result => app.listen(8080))
.catch(err => console.log(err));


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));


app.get('/', (req, res) => {
    res.render("booking");
})


app.post('/', (req, res) => {
    // Search for court
    console.log(req.body)
    Court.find(req.body)
        .then(result => {
            console.log(result)
            if(result.length == 0){
                console.log('not found')
            }
            else{
                console.log('found')
            }
            res.redirect("/")
        })
        .catch(err => console.log(err))
})
