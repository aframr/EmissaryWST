$(document).ready(() => {
  const socket = io();

  const VALIDATE_COMPANY_ID = 'validate_company_id';
  const ADD_VISITOR = 'add_visitor';

  const companyData = JSON.parse(localStorage.getItem('currentCompany'));
  const myCompanyId = companyData._id;
  console.log(companyData);
  socket.emit(VALIDATE_COMPANY_ID, companyData);

    // Prevent users from scrolling around on iPad
  document.ontouchmove = function (e) {
    e.preventDefault();
  };

  prepareStyle();

  function prepareStyle() {
      //grab check-in page style
      const form_data = grabFormStyle();
      console.log(form_data);
      document.body.style.backgroundColor = "#" + (form_data.form_color);
      if (form_data.field1 != "Initial" && form_data.field1 != "NULL") {
        var newInput = document.createElement('input');
        newInput.type = "text";
        newInput.placeholder = form_data.field1;
        newInput.value = form_data.field1;
        newInput.className = "visitor-fields";

        $('.check-in').append(newInput);
        //document.getElementsByClassName("check-in").append(newInput);
      }
      if (form_data.field2 != "Initial" && form_data.field2 != "NULL") {
        var newInput2 = document.createElement('input');
        newInput2.type = "text";
        newInput2.placeholder = form_data.field2;
        newInput2.value = form_data.field2;
        newInput2.className = "visitor-fields";

        $('.check-in').append(newInput2);
      }
      if (form_data.field3 != "Initial" && form_data.field3 != "NULL") {
        var newInput3 = document.createElement('input');
        newInput3.type = "text";
        newInput3.placeholder = form_data.field3;
        newInput3.value = form_data.field3;
        newInput3.className = "visitor-fields";
        $('.check-in').append(newInput3);
      }
      if (form_data.field4 != "Initial" && form_data.field4 != "NULL") {
        var newInput4 = document.createElement('input');
        newInput4.type = "text";
        newInput4.placeholder = form_data.field4;
        newInput4.value = form_data.field4;
        newInput4.className = "visitor-fields";
        $('.check-in').append(newInput4);
      }
      if (form_data.field5 != "Initial" && form_data.field5 != "NULL") {
        var newInput5 = document.createElement('input');
        newInput5.type = "text";
        newInput5.placeholder = form_data.field5;
        newInput5.value = form_data.field5;
        newInput5.className = "visitor-fields";
        $('.check-in').append(newInput5);
      }

      var submitBtn = document.createElement('input');
      submitBtn.type = "submit";
      submitBtn.value = "Submit";
      submitBtn.className = "submit-check-in";
      $('.check-in').append(submitBtn);
  }
  


    // Bind Listeners
  $('#tap-to-check').on('click', startCheckIn);
  $('.check-in').on('submit', submitForm);

    // When a user starts their check in
  function startCheckIn() {

    $('.check-in').addClass('show');
    $('.check-in').animate({
      top: '10%',
      opacity: '1',
    }, 700);
    $(this).addClass('hide');
    $('#clock').addClass('hide');
  }

  function grabFormStyle() {
    var form_data;
    $.ajax({
      dataType: 'json',
      type: 'GET', //create
      //data: form_data,
      async: false,
      url: '/api/'+myCompanyId+'/theme',    //---TODO---
      /*success(response) {
        console.log ("Theme found.");
      },*/
      success: function(data){
        console.log ("here's the theme: ");
        console.log(data);
        form_data = data;
      }
    });

    return form_data;
  }

  //document.getElementById("visitor-first").addEventListener("change", visitorFirstWatcher);
  //document.getElementById("visitor-last").addEventListener("change", visitorLastWatcher);
  //document.getElementById("visitor-number").addEventListener("change", visitorPhoneWatcher);
  
  function visitorPhoneWatcher() {
    const number = $('#visitor-number').val();
    
    if (!validateNumber(number)){
      $('#visitor-number-warning').show();
    } else{
      $('#visitor-number-warning').hide();
    }   
  }
    
  function visitorFirstWatcher() {
    const first = $('#visitor-first').val();

    if (first == '') {
      $('#visitor-first-warning').show();      
    }else{
      $('#visitor-first-warning').hide();
    }
  }

  function visitorLastWatcher() {
    const last = $('#visitor-last').val();    

    if (last == '') {
      $('#visitor-last-warning').show();      
    }else{
      $('#visitor-last-warning').hide();
    }
  }

  function validateNumber(number) {
    const re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    return re.test(number);

  }

    // When a patient submits their form
  function submitForm() {
    const number = $('#visitor-number').val();
    if(validateNumber(number)){
          // event.preventDefault();
      const data = grabFormElements();
          // console.log(data.company_id);
      if (localStorage.getItem('slackToken') && localStorage.getItem('slackChannel')) {
        $.post('https://slack.com/api/chat.postMessage',
          {
            token: localStorage.getItem('slackToken'),
            channel: localStorage.getItem('slackChannel'),
            text: `Name: ${data.first_name} ${data.last_name} Phone Number: ${data.phone_number}`,
          },
               (data, status) => {
               });
      }
      socket.emit(ADD_VISITOR, data);

      $(this).animate({
        top: '35%',
        opacity: '0',
      }, 0);
    }
    else{
      location.reload();     
    }
  }
    // Grabs elements from the check in and puts it into an object
  function grabFormElements() {
    const newVisitor = {};
    newVisitor.company_id = companyData._id;
    newVisitor.first_name = $('#visitor-first').val();
    newVisitor.last_name = $('#visitor-last').val();
    newVisitor.phone_number = $('#visitor-number').val();
    newVisitor.checkin_time = new Date();
    return newVisitor;
  }

    // CLOCK
  function updateClock() {
    const currentTime = new Date();
    let currentHours = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();
        // var currentSeconds = currentTime.getSeconds ( );
        // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = (currentMinutes < 10 ? '0' : '') + currentMinutes;
        // currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

        // Convert the hours component to 12-hour format if needed
    currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

        // Convert an hours component of "0" to "12"
    currentHours = (currentHours == 0) ? 12 : currentHours;

        // Compose the string for display
    const currentTimeString = `${currentHours}:${currentMinutes}`;

    $('#clock').html(currentTimeString);
  }
  updateClock();
  setInterval(updateClock, 60 * 1000);

    /** *
     * Find a specific cookie name
     * @param cName
     * @returns {string|*}
     */
  function getCookie(cName) {
    const name = `${cName}=`;
    const cookieArray = document.cookie.split(';');

    for (let i = 0, len = cookieArray.length; i < len; i++) {
      const cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') { cookie.substring(1); }
      if (cookie.indexOf(name) == 0) { return cookie.substring(name.length, cookie.length); }
    }
  }
});
