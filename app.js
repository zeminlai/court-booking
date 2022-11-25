const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Court = require('./models/court-model.js');
const VenueInfo = require('./models/venueInfo-model.js')
const SearchCourt = require('./models/searchcourt-model.js')

const app = express();                                          

// CHANGE BACK THE PASSWORD
const dbURI = "mongodb+srv://croc:teamcroc@playlah.wlgykth.mongodb.net/playlah?retryWrites=true&w=majority"

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

// Save searched court in searchcourt collection 
app.post('/search/submit', (req, res) => {
    console.log(req.body)
    const searchcourt = new SearchCourt(req.body)
    searchcourt.save()
        .then(result => {
            const id = searchcourt._id;
            res.redirect(`/court/${id}`);
        })
        .catch(err => console.log(err))
})

app.get('/court/:id', (req, res) => {
    const id = req.params.id
    // find the searchcourt and exclue id and __v fields when returned
    SearchCourt.findById(id, {_id : 0, __v : 0})
        .then(result => {
            const searchcourt = result
            // find if there are unavailable courts and only get court number
            Court.find(searchcourt, {court: 1 , _id: 0}).distinct("court")
            .then(result => {
                console.log(searchcourt)
                const bookedCourt = result
                if (bookedCourt.length != 0){
                    console.log('court unavailable are')
                    console.log(bookedCourt)
                }
                else {
                    console.log('all court available')
                }
                
                VenueInfo.findOne({venue: searchcourt.venue})
                    .then(result => {
                        const venueinfo = result
                        // render courts.ejs and send over the variables
                        res.render("courts", {courtDetails : searchcourt, bookedCourtNum : bookedCourt, venueDetails : venueinfo })
                    })
                
                // delete the id so that SearchCourt db wont be cluttered
            })
        })
        .catch(err => console.log(err))
})