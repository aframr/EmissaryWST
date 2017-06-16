

/*
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const path = require('path');
const mongoose = require('mongoose');
const socketIO = require('./socket/socket');
const MY_STRIPE_TEST_KEY = 'sk_test_dqzYJJ6xWGgg6U1hgQr3hNye';
const stripe = require('stripe')(MY_STRIPE_TEST_KEY);
const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);
// var oauthserver = require('oauth2-server');
const newrelic = require('newrelic');


/*
 * App configs
 */
const config = require('./config/config');
const validate = require('./config/validation');
const winstonConfig = require('./config/winston');

/*
 * Create Express server.
 */
const app = express();
app.use((req, res, next) => {
  if (req.path.substr(-5) == '.html' && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -5) + query);
    // res.sendFile(path.join(__dirname,'../dist/assets/views/checkin.html'))
  } else {
    next();
  }
});
app.use(morgan('dev', { stream: winstonConfig.stream }));

/*
 * setting up oath
 */
/* app.oauth = oauthserver({
    model: require('./models/Employee'),
    grants: ['password'],
    debug: true
});

app.all('/oauth/token', app.oauth.grant());
app.get('/secret', app.oauth.authorise(), function (req, res) {
    res.send('Secret area');
});
app.use(app.oauth.errorHandler());
*/

/*
 * Connect to MongoDB.
 */
mongoose.connect(config.mongoDBUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to mongolab');
});

/*
 * Express configuration.
 */
app.set('port', config.port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));
app.set('view engine', 'html');

app.use(cors());
require('./routes')(app);

/*
 * Disable api auth if were are in dev mode
 */
if (app.get('env') !== 'development') {
  app.use('/api/*', validate);
}

// documentation
app.use('/apidoc', express.static(path.join(__dirname, '../apidoc')));

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/settings.html'));
});
app.get('/admin-companies', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/admin-companies.html'));
});
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/admin-dashboard.html'));
});
app.get('/analytics_raw', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/analytics_raw.html'));
});
app.get('/appointments', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/appointments.html'));
});
app.get('/checkin', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/checkin.html'));
});
app.get('/employees', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/employees.html'));
});
app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/forgot-password.html'));
});
app.get('/form-builder', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/form-builder.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/login.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/signup.html'));
});
app.get('/visitors', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/visitors.html'));
});
app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/404.html'));
});
app.get('/admin-settings', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/admin-settings.html'));
});
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/assets/views/index.html'));
});
/*
 * Error Handler.
 */
app.use(errorHandler());

var server = require('http').createServer(app);

const io = require('socket.io')(server);
server.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode',
    app.get('port'),
    app.get('env'));
});

/*
 * Create Socket.io server.
 */
var server = socketIO.createServer(io);


app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));

app.post('/hook', function (req, res) {

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
function handleReservation(request) {
    req_params = request.result.parameters;
    console.log('request = ',request);
    console.log('params = ',req_params);
    sess_id = request.id;
    response = "";
    if (!req_params)
    {
      return "Sorry, what was that?";
    }

    // Edit Reservation
    if (request.result.action == "EditReservation.EditReservation-custom") {
        phone_number = req_params["phone-number"];
        new_appt_date = req_params["date"];
        new_appt_time = req_params["time"];
        response += phone_number + " " + new_appt_time + " " + new_appt_time;
    }

    // View Reservation
    else if (request.result.action == "ViewReservation.ViewReservation-custom") {
        phone_number = req_params["phone-number"];
        response += "Viewing...";
    }

    // Create Reservation
    else if (request.result.action == "CreateReservation.CreateReservation-custom") {
        name = req_params["given-name"];
        phone_number = req_params["phone-number"];
        new_appt_date = req_params["date"];
        new_appt_time = req_params["time"];
        company = req_params["company"]; 
        response += request.result.fulfillment.speech;
    }

    // Delete Reservation
    else if (request.result.action == "DeleteReservation.DeleteReservation-custom") {
        phone_number = req_params["phone-number"];
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

module.exports = app;
