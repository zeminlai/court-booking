
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchCourtSchema = new Schema({
    venue: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timestart: {
        type: String,
        required: true
    },
    duration: {
        type: String
    }
}, {timestamps: true})


const SearchCourt = mongoose.model("searchcourt", searchCourtSchema );
module.exports = SearchCourt;
