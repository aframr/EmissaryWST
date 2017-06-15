'use strict';

/* This module is strictly meant for one route. This route
 * is responsible for rendering our angular app home page.
 */
var express = require('express');
var path = require('path');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

/**
 * GET /
 * Render out angular app.
 */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/visitors.html'));
});

/**
 * webhook POST from api.ai
 */
router.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';
                
                if (requestBody.result.action && requestBody.result.action == 'reservation')
                {
                    speech = handleReservation(requestBody);
                }
                else 
                {
                    // handle error case 
                }
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
function handleReservation(request) {
    params = request.result.parameters;
    response = "";
    if (params.action == 'edit') {
        // search database for item
        // edit that item with given parameters 
    }
    else if (params.action == 'view') {
        // search database for name/phone/email prompt 
        // return it in response

    }
    else if (params.action == 'create') {
        // create new entry in database with given parameters 

    }
    else if (params.action == 'delete') {
        // search database for name,phone,email identification 
        // delete the item from database 
    }
    else {
        response += "Action not specified, please include action as 'edit','view','create', or 'delete'";
        // action not specified 
    }
    return response 

}

module.exports = router;