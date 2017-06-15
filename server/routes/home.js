'use strict';

/* This module is strictly meant for one route. This route
 * is responsible for rendering our angular app home page.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
<<<<<<< HEAD
=======
var bodyParser = require('body-parser');
var Company = require('../models/Company');
router.use(bodyParser.json());
>>>>>>> baf70cc6bc2928c4d346e579eac994d3db4d5235

/**
 * GET /
 * Render out angular app.
 */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/visitors.html'));
});

<<<<<<< HEAD
// /**
//  * webhook POST from api.ai
//  */
// router.post('/hook', function (req, res) {

//     console.log('hook request');

//     try {
//         var speech = 'empty speech';

//         if (req.body) {
//             var requestBody = req.body;

//             // Handle reservations given POST Request
//             if (requestBody.result) {
//                 speech = handleReservation(requestBody);
//             }
//         }

//         console.log('result: ', speech);

//         return res.json({
//             speech: speech,
//             displayText: speech,
//             source: 'apiai-webhook-sample'
//         });
//     } catch (err) {
//         console.error("Can't process request", err);

//         return res.status(400).json({
//             status: {
//                 code: 400,
//                 errorType: err.message
//             }
//         });
//     }
// });


// // handle adding reservation to db 
// // 1. Check if reservation is edit/view/create/delete
// // 1.a case : edit 
// // 1.b case : view
// // 1.c case : create 
// // 1.d case : delete
// // TODO: add given information to database or extract from database
// function handleReservation(request) {
//     params = request.result.parameters;
//     sess_id = request.id;
//     response = "";

//     // Edit Reservation
//     if (request.result.action == "EditReservation.EditReservation-custom") {
//         phone_number = params["phone-number"];
//         new_appt_date = params["date"];
//        	new_appt_time = params["time"];
//        	response += phone_number + " " + new_appt_time + " " + new_appt_time;
//     }

//     // View Reservation
//     else if (request.result.action == "ViewReservation.ViewReservation-custom") {
//         phone_number = params["phone-number"];
//         response += "Viewing...";
//     }

//     // Create Reservation
//     else if (request.result.action == "CreateReservation.CreateReservation-custom") {
//         name = params["given-name"];
//         phone_number = params["phone-number"];
//         new_appt_date = params["date"];
//         new_appt_time = params["time"];
//         company = params["company"]; 
//         response += request.result.fulfillment.speech;
//     }

//     // Delete Reservation
//     else if (request.result.action == "DeleteReservation.DeleteReservation-custom") {
//         phone_number = params["phone-number"];
//         response += request.result.fulfillment.speech;
//     }

//     // Normal Case / default case
//     else if (request.result.fulfillment.speech)
//     {
//     	response += request.fulfillment.speech;
//     }
//     else {
//         // action not understood 
//         response += "Can you rephrase that?";
//     }
//     return response 
// }
=======
/**
 * webhook POST from api.ai
 */
/*router.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            // Handle reservations given POST Request
            if (requestBody.result) {
                speech = handleReservation(requestBody);
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});


// handle adding reservation to db 
// 1. Check if reservation is edit/view/create/delete
// 1.a case : edit 
// 1.b case : view
// 1.c case : create 
// 1.d case : delete
// TODO: add given information to database or extract from database
var companyID;
function handleReservation(request) {
    params = request.result.parameters;
    sess_id = request.id;
    response = "";

    // Edit Reservation
    if (request.result.action == "EditReservation.EditReservation-custom") {
        phone_number = params["phone-number"];
        new_appt_date = params["date"];
       	new_appt_time = params["time"];
       	response += phone_number + " " + new_appt_time + " " + new_appt_time;
    }

    // View Reservation
    else if (request.result.action == "ViewReservation.ViewReservation-custom") {
        phone_number = params["phone-number"];
        response += "Viewing...";
    }

    // Create Reservation
    else if (request.result.action == "CreateReservation.CreateReservation-custom") {
        name = params["given-name"];
        phone_number = params["phone-number"];
        new_appt_date = params["date"];
        new_appt_time = params["time"];
        company = params["company"]; 
        var valid = validateCompany(company);
        if(valid != "valid"){
            response+= valid;
        }
        else{
            response += "valid company";
        }  

    }
    // Delete Reservation
    else if (request.result.action == "DeleteReservation.DeleteReservation-custom") {
        phone_number = params["phone-number"];
        response += request.result.fulfillment.speech;
    }

    // Normal Case / default case
    else if (request.result.fulfillment.speech)
    {
    	response += request.fulfillment.speech;
    }
    else {
        // action not understood 
        response += "Can you rephrase that?";
    }
    return response 
}
//Checks if the requested company is in our database. 
function validateCompany(company_name){
    Company.findOne({"name": value}, function(err,company){
      if(!company){
        return "This company does not use our service. Please encourage them to do so and try again.";
      }
     else{
       companyID = company._id;
       return "valid";
     }
    }); 
}*/
module.exports = router;


>>>>>>> baf70cc6bc2928c4d346e579eac994d3db4d5235

