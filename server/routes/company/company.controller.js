'use strict';

/* This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */

var config = require('../../config/config');

/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Company = require('../../models/Company');
var jwt = require('jwt-simple');

/** **** Company TEMPLATE ROUTES ******/
module.exports.template = {};

/**
 * @api {post} /api/companies Used to sign up a user
 * @apiName create
 * @apiGroup company
 *
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email
 * @apiParam {String} phone_number User's phone number
 *
 * @apiSuccess {String} _id User ID
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} phone_number User's phone number
 * @apiSuccess {String} paid_time Time user paid
 *
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     _id : "12314125",
 *     name : "test",
 *     email : "test",
 *     phone_number : "0123456789",
 *     paid_time: "2016-04-23T18:25:43.511Z"
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     error: "email taken"
 *   }
 */
module.exports.template.create = function (req, res) {
  var company = new Company();

  // require provided info
  company.email = req.body.email;
  company.name = req.body.name;
  company.phone_number = req.body.phone_number;
  company.paid_time = new Date();
  company.id = req.body.name;
  // optinal info
  /* company.expiration_date=req.body.expiration_date;
    company.credit_card_number=req.body.credit_card_number;
    */

  company.save(function (err, c) {
    if (err) {
      return res.status(400).json({ error: 'Could Not Save' });
    }
    return res.status(200).json(showCompanyPublicInfo(c));
  });
};

/**
 * @api {get} /api/companies Gets all the companies
 * @apiName getAll
 * @apiGroup company
 *
 * @apiSuccess {String} _id User ID
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} phone_number User's phone number
 * @apiSuccess {String} paid_time Time user paid
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 * 	{
 * 		_id : "12314125",
 * 		name : "test",
 * 		email : "test",
 * 		phone_number : "0123456789",
 * 		paid_time: "2016-04-23T18:25:43.511Z"
 * 	},
 * 	{
 * 		_id : "123112325",
 * 		name : "test",
 * 		email : "test",
 * 		phone_number : "0123456789",
 * 		paid_time: "2016-04-23T18:25:43.511Z"
 * 	}
 * }
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     err: "Incorrect Credentials"
 *   }
 */
module.exports.template.getAll = function (req, res) {
  Company.find({}, {
    credit_card_number: false,
    expiration_date: false
  }, function (err, result) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(result);
  });
};

/** authLogin- logs in a user*/
module.exports.template.get = function (req, res) {
  Company.findOne({ _id: req.params.id }, function (err, company) {
    if (err) {
      return res.status(400).json({ error: 'Could Not Save' });
    }
    return res.status(200).json(showCompanyPublicInfo(company));
  });
};

/**
 * @api {put} /api/companies/:id Update company information
 * @apiName update
 * @apiGroup company
 *
 * @apiSuccess {String} _id User ID
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} phone_number User's phone number
 * @apiSuccess {String} paid_time Time user paid
 *
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     _id : "12314125",
 *     name : "test",
 *     email : "test",
 *     phone_number : "0123456789",
 *     paid_time: "2016-04-23T18:25:43.511Z"
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     error: "incorrect parameters"
 *   }
 */
module.exports.template.update = function (req, res) {
  Company.findOne({ _id: req.params.id }, function (err, c) {
    if (err || !c) {
      return res.status(401).json({ error: 'Could Not Find' });
    }

    // update email
    if (req.body.email !== undefined) {
      c.email = req.body.email;
    }

    // update company name
    if (req.body.name !== undefined) {
      c.name = req.body.name;
    }

    // update company's phone number
    if (req.body.phone_number !== undefined) {
      c.phone_number = req.body.phone_number;
    }

    c.save(function (err) {
      if (err) {
        return res.status(400).json({ error: 'Could Not Save' });
      }
      return res.status(200).json(showCompanyPublicInfo(c));
    });
  });
};

/**
 * @api {delete} /api/companies/:id Delete company
 * @apiName delete
 * @apiGroup company
 *
 * @apiSuccess {String} _id User ID
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} phone_number User's phone number
 * @apiSuccess {String} paid_time Time user paid
 *
 * @apiSuccessExample {json} Success-Response:
 *   {
 *     _id : "12314125",
 *     name : "test",
 *     email : "test",
 *     phone_number : "0123456789",
 *     paid_time: "2016-04-23T18:25:43.511Z"
 *   }
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     error: "incorrect parameters"
 *   }
 */
module.exports.template.delete = function (req, res) {
  Company.findById(req.params.id, function (err, c) {
    if (err) {
      res.status(400).json({ error: 'Could Not Find' });
    }
    c.remove(function (err) {
      if (err) {
        res.status(400).json({ error: 'Could Not Save' });
      } else {
        return res.status(200).json(showCompanyPublicInfo(c));
      }
    });
  });
};

/** authResetCredentials- resets a user's credentials*/
module.exports.template.resetCredentials = function (req, res) {
  Company.findOne({ email: req.params.user }, function (err, c) {
    if (err || !c) {
      return res.status(400).json({ error: 'Could Not Find' });
    }

    // if the user is found but the password is wrong
    if (!c.validPassword(req.body.password)) {
      return res.status(400).send('loginMessage', 'Oops! Wrong password');
    }
    // update password

    // upadate password
    if (req.body.newpassword !== undefined) {
      c.password = c.generateHash(req.body.newpassword);
    }

    // update email
    if (req.body.newemail !== undefined) {
      c.email = req.body.newemail;
    }

    // update company name
    if (req.body.new_company_name !== undefined) {
      c.company_name = req.body.new_company_name;
    }

    // update company's phone number
    if (req.body.new_company_phone_number !== undefined) {
      c.company_phone_number = req.body.new_company_phone_number;
    }

    c.save(function (err) {
      if (err) {
        res.status(400).send({ error: 'Could Not Save' });
      }
    });
    return res.status(200).json(showCompanyPublicInfo(c));
  });
};

function showCompanyPublicInfo(c) {
  return {
    _id: c._id,
    name: c.name,
    email: c.email,
    phone_number: c.phone_number,
    paid_time: c.paid_time
  };
}