

/*
 * This module is meant to house all of the API
 * routes that pertain to theme settings
 */
const express = require('express');
const router = express.Router();

/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
const cors = require('cors');

const Theme = require('../../models/Theme');

/** ********************* THEME TEMPLATE ROUTES ***********************/
module.exports.template = {};

module.exports.template.use = function (req, res, next) {
  // do logging
  console.log('Intializing.....');
  next();
};


module.exports.template.create = function(req, res) {
    var theme = new Theme();
    theme.user_id = req.params.user_id; //company or user id
    theme.form_color = "f9c800";
    theme.background_img = "default";
    //theme.displayPhone = false;
    //theme.displayClock = false;
    //theme.displaySignature = false;
    //theme.additionalComments = false;
    theme.field1 = "First Name";
    theme.field2 = "Last Name";
    theme.field3 = "Phone Number";
    theme.field4 = "NULL";
    theme.field5 = "NULL";

    theme.save(function(err) {
        if (err)
            {res.status(400).send(err);}

        res.status(200).json(theme);
    });
};

module.exports.template.get = function (req, res) {
  Theme.findOne({
    user_id: req.params.user_id,
  }, (err, theme) => {
    if (err) { res.status(400).send(err); }

    res.status(200).json(theme);
  });
};

module.exports.template.update = function (req, res) {
  Theme.findOne({
    user_id: req.params.user_id,
  }, (err, theme) => {
    if (err) { res.status(400).send(err); }

        theme.user_id = req.params.user_id; //company or user id
        if (req.body.form_color)
            theme.form_color = req.body.form_color;
        if (req.body.background_img)
            theme.background_img = req.body.background_img;
        /*if (req.body.displayPhone)
            theme.displayPhone = req.body.displayPhone;
        if (req.body.displayClock)
            theme.displayClock = req.body.displayClock;
        if (req.body.displaySignature)
            theme.displaySignature = req.body.displaySignature;
        if (req.body.additionalComments)
            theme.additionalComments = req.body.additionalComments;*/
        if (req.body.field1)
            theme.field1 = req.body.field1;
        if (req.body.field2)
            theme.field2 = req.body.field2;
        if (req.body.field3)
            theme.field3 = req.body.field3;
        if (req.body.field4)
            theme.field4 = req.body.field4;
        if (req.body.field5)
            theme.field5 = req.body.field5;

    theme.save((err) => {
      if (err) { res.status(400).send(err); }

      res.status(200).json(theme);
    });
  });
};

module.exports.template.delete = function (req, res) {
  Theme.remove({
    user_id: req.params.user_id,
  }, (err, theme) => {
    if (err) { res.status(400).send(err); }

    res.status(200).json({ msg: 'OK' });
  });
};
