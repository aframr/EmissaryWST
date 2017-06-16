

// Import Resources and Libs

const Email = require('../../notification/email');
const TextModel = require('../../notification/text');

const VisitorList = require('../../models/VisitorList');
const Employee = require('../../models/Employee');
const Appointment = require('../../models/Appointment');
const Company = require('../../models/Company');

// Store the additional field information not including name and phone_number, in the field additional_info as a dictionary type {}
/**
 * @api {get} /api/visitorLists/company/:id Gets company's visitor list
 * @apiName getCompanyVisitorListReq
 * @apiGroup visitorList
 *
 * @apiSuccess {String} _id Visitor ID
 * @apiSuccess {String} first_name Visitor's first name
 * @apiSuccess {String} last_name Visitor's last name
 * @apiSuccess {String} phone_number Visitor's phone number
 * @apiSuccess {String} checkin_time Visitor's checkin time
 * @apiSuccess {String[]} appointments Visitor's appointments
 * @apiSuccess {String[]} additional_info Visitor's additional info
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *	_id: "123124124",
 *	company_id: "12312355",
 *	visitors:
 *	[
 *		{
 *			_id: "12314125",
 *			company_id: "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number: "21324125",
 *			checkin_time: "2016-04-23T18:25:43.511Z",
 *			appointments:
 *			[
 *				{
 *					_id : "12314125",
 *					name : "test1",
 *					phone_number : "0123456789",
 *					date : "2016-04-23T18:25:43.511Z",
 *					company_id : "12314125",
 *					provider_name : "test test"
 *				}
 *			]
 *			additional_info:
 *				{
 *					allergies: "peanuts",
 *					sex: "male"
 *				}
 *		},
 *		{
 *			_id: "12314125",
 *			company_id: "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number: "21324125",
 *			checkin_time: "2016-04-23T18:25:43.511Z",
 *			appointments:
 *			[
 *				{
 *					_id : "12314125",
 *					name : "test1",
 *					phone_number : "0123456789",
 *					date : "2016-04-23T18:25:43.511Z",
 *					company_id : "12314125",
 *					provider_name : "test test"
 *				}
 *			]
 *			additional_info:
 *				{
 *					allergies: "peanuts",
 *					sex: "male"
 *				}
 *	]
 *}
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     err: "Already created"
 *   }
 */
exports.getCompanyVisitorListReq = function (req, res) {
  const company_id = req.params.id;
  exports.getCompanyVisitorList(company_id, (err_msg, result) => {
    if (err_msg) return res.status(400).json(err_msg);
    if (result == null) {
      result = new VisitorList();
      result.visitors = [];
      result.company_id = companyId;
      result.save(err => res.status(200).json(result));
    } else {
      return res.status(200).json(result);
    }
  });
};


/* logic for getting the Company's visitor list */
exports.getCompanyVisitorList = function (company_id, callback) {
  if (!company_id) { return callback({ error: 'Please send company id.' }, null); }
  VisitorList.findOne({ company_id }, (err, list) => {
    if (err) return callback({ error: 'Getting Visitor List' }, null);
    if (list == null) {
      list = new VisitorList();
      list.visitors = [];
      list.company_id = company_id;
    }
    list.save((err) => {
      if (err) return callback({ error: 'Error in saving' }, null);
      return callback(null, list);
    });
  });
};

/* handles route to delete visitor in the list*/
/**
 * @api {delete} /api/visitorLists/company/:company_id/visitor/:visitor_id Deletes visitor from visitor list
 * @apiName deleteVisitorReq
 * @apiGroup visitorList
 *
 * @apiSuccess {String} _id Visitor ID
 * @apiSuccess {String} first_name Visitor's first name
 * @apiSuccess {String} last_name Visitor's last name
 * @apiSuccess {String} phone_number Visitor's phone number
 * @apiSuccess {String} checkin_time Visitor's checkin time
 * @apiSuccess {String[]} appointments Visitor's appointments
 * @apiSuccess {String[]} additional_info Visitor's additional info
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *	_id: "123124124",
 *	company_id: "12312355",
 *	visitors:
 *	[
 *		{
 *			_id: "12314125",
 *			company_id: "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number: "21324125",
 *			checkin_time: "2016-04-23T18:25:43.511Z",
 *			appointments:
 *			[
 *				{
 *					_id : "12314125",
 *					name : "test1",
 *					phone_number : "0123456789",
 *					date : "2016-04-23T18:25:43.511Z",
 *					company_id : "12314125",
 *					provider_name : "test test"
 *				}
 *			]
 *			additional_info:
 *				{
 *					allergies: "peanuts",
 *					sex: "male"
 *				}
 *		},
 *		{
 *			_id: "12314125",
 *			company_id: "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number: "21324125",
 *			checkin_time: "2016-04-23T18:25:43.511Z",
 *			appointments:
 *			[
 *				{
 *					_id : "12314125",
 *					name : "test1",
 *					phone_number : "0123456789",
 *					date : "2016-04-23T18:25:43.511Z",
 *					company_id : "12314125",
 *					provider_name : "test test"
 *				}
 *			]
 *			additional_info:
 *				{
 *					allergies: "peanuts",
 *					sex: "male"
 *				}
 *	]
 *}
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     err: "Already created"
 *   }
 */
exports.deleteVisitorReq = function (req, res) {
  const visitor_id = req.params.visitor_id;
  const company_id = req.params.company_id;
  exports.deleteVisitor(company_id, visitor_id, (err_msg, result) => {
    if (err_msg) return res.status(400).json(err_msg);
    return res.status(200).json(result);
  });
};

/* logic for deleting the visitor in the list */
exports.deleteVisitor = function (company_id, visitor_id, callback) {
  if (!company_id) { return callback({ error: 'Please send company id.' }, null); }
  if (!visitor_id) { return callback({ error: 'Please send visitorList id.' }, null); }
  VisitorList.findOneAndUpdate(
    { company_id },
    { $pull: { visitors: { _id: visitor_id } } },
    { safe: true, upsert: true, new: true }, (err, data) => {
      if (err) return callback({ error: "Can't update list" }, null);
      return callback(null, data);
    });
};

/* clear the list */
/**
 * @api {delete} /api/visitorLists/:id Clears visitor list
 * @apiName deleteReq
 * @apiGroup visitorList
 *
 * @apiSuccess {String} _id Visitor ID
 * @apiSuccess {String} company_id Company ID
 * @apiSuccess {String[]} visitors Visitors
 *
 * @apiSuccessExample {json} Success-Response:
 *  {
 * 	_id: "123124124",
 * 	company_id: "12312355",
 * 	visitors: []
 * }
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     err: "getting visitor list"
 *   }
 */
exports.deleteReq = function (req, res) {
  const list_id = req.params.id;
  exports.delete(list_id, (err_msg, result) => {
    if (err_msg) return res.status(400).json(err_msg);
    return res.status(200).json(result);
  });
};

exports.delete = function (list_id, callback) {
  if (!list_id) { return callback({ error: 'Please send list id.' }, null); }
  VisitorList.findOne({ _id: list_id }, (err, list) => {
    if (err || list == null) return callback({ error: "Can't find company" }, null);
    list.visitors = [];
    list.save((err) => {
      if (err) return callback({ error: "Can't save" }, null);
      return callback(null, list);
    });
  });
};
// This route will be called when a visitor checks in
/**
 * @api {delete} /api/visitorLists/company/:company_id/visitor/:visitor_id Deletes visitor from visitor list
 * @apiName deleteVisitorReq
 * @apiGroup visitorList
 *
 * @apiSuccess {String} _id Visitor ID
 * @apiSuccess {String} first_name Visitor's first name
 * @apiSuccess {String} last_name Visitor's last name
 * @apiSuccess {String} phone_number Visitor's phone number
 * @apiSuccess {String} checkin_time Visitor's checkin time
 * @apiSuccess {String[]} appointments Visitor's appointments
 * @apiSuccess {String[]} additional_info Visitor's additional info
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *	_id: "123124124",
 *	company_id: "12312355",
 *	visitors:
 *	[
 *		{
 *			_id: "12314125",
 *			company_id: "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number: "21324125",
 *			checkin_time: "2016-04-23T18:25:43.511Z",
 *			appointments:
 *			[
 *				{
 *					_id : "12314125",
 *					name : "test1",
 *					phone_number : "0123456789",
 *					date : "2016-04-23T18:25:43.511Z",
 *					company_id : "12314125",
 *					provider_name : "test test"
 *				}
 *			]
 *			additional_info:
 *				{
 *					allergies: "peanuts",
 *					sex: "male"
 *				}
 *		},
 *		{
 *			_id: "12314125",
 *			company_id: "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number: "21324125",
 *			checkin_time: "2016-04-23T18:25:43.511Z",
 *			appointments:
 *			[
 *				{
 *					_id : "12314125",
 *					name : "test1",
 *					phone_number : "0123456789",
 *					date : "2016-04-23T18:25:43.511Z",
 *					company_id : "12314125",
 *					provider_name : "test test"
 *				}
 *			]
 *			additional_info:
 *				{
 *					allergies: "peanuts",
 *					sex: "male"
 *				}
 *	]
 *}
 *
 * @apiErrorExample {json} Error-Response:
 *   {
 *     err: "Already created"
 *   }
 */
exports.createReq = function (req, res) {
  exports.create(req.body, (err_msg, result) => {
    if (err_msg) return res.status(400).json(err_msg);
    return res.status(200).json(result);
  });
};

exports.create = function (param, callback) {
  console.log(`enters:${param.company_id}`);
  // required fields
  const company_id = param.company_id;
  const first_name = param.first_name;
  const last_name = param.last_name;
  const phone_number = param.phone_number;
  const checkin_time = param.checkin_time;

  // optional dic var
  const additional_info = param.additional_info;

  // find all the appointments for this visitor
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const query =
    {
      company_id,
      first_name,
      last_name,
      phone_number,
      date: { $gte: today, $lt: tomorrow },
    };
    // TextModel.sendText(first_name,last_name, employees, function(){respond();});


  Appointment.find(query, (err, appointments) => {
    const visitor =
        {
          company_id,
          last_name,
          first_name,
          phone_number,
          checkin_time,
          additional_info,
          appointments,
        };

    VisitorList.findOne(
      { company_id },
      (err, list) => {
        if (err) { return callback({ error: 'an error occured while finding' }, null); }
        if (list == null) {
          list = new VisitorList();
          list.visitors = [];
          list.company_id = company_id;
        }
        list.visitors.push(visitor);
        list.save((err) => {
          if (err) return callback({ error: 'an error in saving' }, null);
          Company.findById(company_id, (err, user) => {
            TextModel.sendText(first_name, last_name, user.phone_number);
            console.log(`Phone Number is: ${user.phone_number}`);
          });

          // return callback(null, list);
          /* Employee.find({company : req.body.company_id},
                     function(err, employees) {
                     var i = 0;
                     var respond = function() {
                     i++;
                     if(i == employees.length) {
                     res.status(200).json(list);
                     }
                     };

                     Email.sendEmail(req.body.name, employees, function(){respond();});
                     TextModel.sendText(req.body.name, employees, function(){respond();});
                     }
                     );*/
          // Placeholder this will send text on any checkin while we only want it from someone with an appointment
          // var i = 0;
          /* Employee.find({company : req.body.company_id},
      function(err, employees) {
      i = 0;
      var respond = function() {i++;
      if(i == employees.length) { res.status(200).json(list);}};
        console.log("employees is:" +employees);
        TextModel.sendText(first_name,last_name, employees, function(){respond();});
        });*/
        });
      },
    );
  });
};

