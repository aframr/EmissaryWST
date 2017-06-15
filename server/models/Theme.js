'use strict';

//monggose set up
var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

//Schema for user theme settings
var ThemeSchema   = new Schema({
    user_id: String,
    form_color: String,
    background_img: String,
    //displayPhone: Boolean,
    //displayClock: Boolean,
    //displaySignature: Boolean,
    //additionalComments: Boolean
    field1: String,
    field2: String,
    field3: String,
    field4: String,
    field5: String
});

//Export schema
module.exports = mongoose.model('Theme', ThemeSchema);
