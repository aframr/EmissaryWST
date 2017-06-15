/**
 * Created by DanielKong on 3/8/16.
 */
$(document).ready(() => {
  let companyId;

    // Listener for creating a company
  $('#submit-company-btn').on('click', () => {
    if(validateCompany()){  
      const companyData = grabCompanyData();
      console.log(companyData);
      ajaxPost('/api/companies', companyData);
    }
    else{
      console.log('validateCompany fail');    
      location.reload();
    }
  });

    // Listener for Initial Sign up of an Employee
  $('#submit-btn').on('click', () => {
    if(validateForm()){ 
      const employeeData = grabEmployeeData();
      console.log(employeeData);
      ajaxPost('/api/employees', employeeData);
    }else{
      location.reload();
    }
  });

  var company_Name;
    // Grab Company Data from form
  function grabCompanyData() {
    const company = {};
    company_Name = $('#form-company-name').val();
    company.name = company_Name;
    company.email = $('#form-email').val();
    company.phone_number = $('#form-phone').val();
    return company;
  }

    // Grab employee data from form
  function grabEmployeeData() {
    const employee = {};

    employee.first_name = $('#form-employee-first').val();
    employee.last_name = $('#form-employee-last').val();
    employee.email = $('#form-employee-email').val();
    employee.password = $('#form-password').val();
    employee.phone_number = $('#form-employee-phone').val();
    employee.role = 'c_admin';
    employee.company_id = companyId;
    employee.company_name =  company_Name;
    return employee;
  }

    // Ajax function to create a POST request to server
  function ajaxPost(url, data) {
    $.ajax({
      type: 'POST',
      url,
      data,
      dataType: 'json',
      success(response) {
                // console.log(response);
        if (url == '/api/employees') {
          localStorage.setItem('userState', 1);
          localStorage.setItem('currentUser', JSON.stringify(response));
          location.href = '/visitors.html';
        } else if (url == '/api/companies') {
          localStorage.setItem('currentCompany', JSON.stringify(response));
          companyId = response._id;
        }
      },
      error(response) {
        console.log(response);
        const resJSON = JSON.stringify(response);
        alert(jQuery.parseJSON(resJSON).responseText);
        event.preventDefault();
        location.href = '/signup.html';
      },
    });
  }

  function validateCompany() {
    const companyName = $('#form-company-name').val();
    const companyEmail = $('#form-email').val();
    const companyNumber = $('#form-phone').val();

    if (companyName == '') {
      alert('username cannot be blank');
      console.log('username cannot be blank');
      return false;
    }
    else if (!validateEmail(companyEmail)) {
      alert('please enter a valid email');
      console.log('please enter a valid email');
      return false;
    }
    else {
      console.log('validateCompany pass');     
      return true;
    }
  }

  function validateForm() {
    const employeeFirst = $('#form-employee-first').val();
    const employeeLast = $('#form-employee-last').val();
    const employeeNumber = $('#form-employee-email').val();
    const employeeEmail = $('#form-employee-phone').val();
    const employeePassword = $('#form-password').val();

    if (employeeFirst == '') {
      alert('Error: User first name cannot be blank!');
      return false;
    }
    else if (employeeLast == '') {
      alert('Error: User last name cannot be blank!');
      return false;
    }
    else if(validateEmail(employeeEmail)){
      console.log('hererere');
      alert('Invalid Employee Email!');
      return false;      
    }
    else if(!checkPassword()){
      alert('Invalid password, please make sure your password has at least 6 characters and has a lowercase, a uppercase, and a number');
      return false;      
    }
    else if(!checkRepeatPassword()){
      alert('Invalid repeat password!');
      return false;          
    }
    else {
      return true;
    }
  }

  document.getElementById("form-company-name").addEventListener("change", companyNameWatcher);
  document.getElementById("form-email").addEventListener("change", companyEmailWatcher);
  document.getElementById("form-phone").addEventListener("change", companyPhoneWatcher);

  function companyNameWatcher() {
    const companyName = $('#form-company-name').val();

    if (companyName == '') {
      $('#name-warning').show();      
    }else{
      $('#name-warning').hide();
    }
  }

  function companyEmailWatcher(){
    const companyEmail = $('#form-email').val();

    if (!validateEmail(companyEmail)){
      $('#email-warning').show();
    } else{
      $('#email-warning').hide();
    }  
  }

  function companyPhoneWatcher(){
    const companyNumber = $('#form-phone').val();

    if (!validateNumber(companyNumber)){
      $('#number-warning').show();
    } else{
      $('#number-warning').hide();
    }  
  }

  document.getElementById("form-employee-first").addEventListener("change", employeeFirstWatcher);
  document.getElementById("form-employee-last").addEventListener("change", employeeLastWatcher);
  document.getElementById("form-employee-phone").addEventListener("change", employeePhoneWatcher);
  document.getElementById("form-employee-email").addEventListener("change", employeeEmailWatcher);
  document.getElementById("form-password").addEventListener("change", employeePasswordWatcher);
  document.getElementById("form-repeat-password").addEventListener("change", employeeRepeatPasswordWatcher);

  function employeeFirstWatcher() {
    const employeeFirst = $('#form-employee-first').val();

    if (employeeFirst == '') {
      $('#employee-first-warning').show();      
    }else{
      $('#employee-first-warning').hide();
    }
  }

  function employeeLastWatcher() {
    const employeeLast = $('#form-employee-last').val();    

    if (employeeLast == '') {
      $('#employee-last-warning').show();      
    }else{
      $('#employee-last-warning').hide();
    }
  }
  function employeePhoneWatcher() {
    const employeeNumber = $('#form-employee-phone').val();
    
    if (!validateNumber(employeeNumber)){
      $('#employee-number-warning').show();
    } else{
      $('#employee-number-warning').hide();
    }   
  }
  function employeeEmailWatcher() {
    const employeeEmail = $('#form-employee-email').val();

    if (!validateEmail(employeeEmail)){
      $('#employee-email-warning').show();
    } else{
      $('#employee-email-warning').hide();
    }    
  }
  function employeePasswordWatcher() {
    const employeePassword = $('#form-password').val();
    
    if (!checkPassword()){
      $('#employee-password-warning').show();
    } else{
      $('#employee-password-warning').hide();
    }   
  }
  function employeeRepeatPasswordWatcher() {
    const employeeRepeatPassword = $('#form-repeat-password').val();

    if (!checkRepeatPassword()){
      $('#employee-repeat-password-warning').show();
    } else{
      $('#employee-repeat-password-warning').hide();
    }     
  }

  function validateNumber(number) {
    const re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    return re.test(number);
  }

  function validateEmail(email) {
    if (email ==''){
      return false;      
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function checkPassword() {
    const employeePassword = $('#form-password').val();
    if (employeePassword ==''){
      console.log('Password must not be blank!');
      return false;      
    }
    if (employeePassword.length < 6) {
      console.log('Password must contain at least six characters!');
      return false;
    }
    if (employeePassword == $('#form-employee-first').val()) {
      console.log('Error: Password must be different from first name!');
      return false;
    }
    if (employeePassword == $('#form-employee-last').val()) {
      console.log('Error: Password must be different from last name!');
      return false;
    }      
    re = /[0-9]/;
    if (!re.test(employeePassword)) {
      console.log('Error: password must contain at least one number (0-9)!');
      return false;
    }
    re = /[a-z]/;
    if (!re.test(employeePassword)) {
      console.log('Error: password must contain at least one lowercase letter (a-z)!');
      return false;
    }
    re = /[A-Z]/;
    if (!re.test(employeePassword)) {
      console.log('Error: password must contain at least one uppercase letter (A-Z)!');
      return false;
    } 
    return true;
  }

  function checkRepeatPassword(){
    const employeePassword = $('#form-password').val();
    const employeeRepeatPassword = $('#form-repeat-password').val();

    if (employeePassword == employeeRepeatPassword) {
      return true;
    }
    else {
      console.log("Error: Please check that you've confirmed your password!");
      return false;
    }
  }

});
