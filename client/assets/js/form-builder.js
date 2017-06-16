var companyData;
var myCompanyId;

$(document).ready(function($){
    companyData = JSON.parse(localStorage.getItem('currentCompany'));
    myCompanyId = companyData._id;
    console.log ("company id: " + myCompanyId);
    $('select').niceSelect();
});

$('.my-form:last .add-box').click(function(){
    var label;
    label = $('#optional_label').val();
    console.log("value: " + label);

        //var box_html = $('<p class="text-box"><label id = "added_label" for="optional_' + n + '"> <span class="box-number">' + label + '</span></label><br> <input type="text" name="boxes[]" value="" placeholder = "Enter here" id="box' + n + '" required/> <button type="button" class="btn btn-danger remove-box">Remove</button></p>');
        //box_html.hide();
        //$('.my-form:first .addField:last').before(box_html);
        //box_html.fadeIn('slow');
    //$('#select_1').append('<option value='+label+'>'+label+'</option>');
    //$('#select_2').append('<option value='+label+'>'+label+'</option>');
    //$('#select_3').append('<option value='+label+'>'+label+'</option>');
    $('#select_4').append('<option value='+label+'>'+label+'</option>');
    $('#select_5').append('<option value='+label+'>'+label+'</option>');
    $('#optional_label').val("");
    $('select').niceSelect('update');
        //return false;
});


$('.my-form').on('click', '.remove-box', function(){
    $(this).parent().css( 'background-color', '#FF6C6C' );
    $(this).parent().fadeOut("slow", function() {
        $(this).remove();
        $('.box-number').each(function(index){
            $("#box2").attr("id", "box1");
            $("#added_label").attr("for", "optional_1");
        });
    });
    return false;
});


$('#submit-form-style').click(storeForm);


function storeForm() {
    const form_data = grabFormStyle();
    $.ajax({
      dataType: 'json',
      type: 'PUT', //create
      data: form_data,
      async: false,
      url: '/api/'+myCompanyId+'/theme',    //---TODO---
      success(response) {
        console.log ("New theme is saved.");
      },
    });
}

/*function submitStyle() {
    const styleObj = grabFormStyle();
    console.log("form-style object: " + styleObj);
}*/

//grab form's info
function grabFormStyle() {
    const newStyle = {};
    newStyle.user_id = myCompanyId;
    newStyle.form_color = $('#color-choice').val();
    newStyle.field1 = "First Name";
    newStyle.field2 = "Last Name";
    newStyle.field3 = "Phone Number"
    newStyle.field4 = $('#select_4').val();
    //console.log("select4 value: " + $('#select_4').val());
    newStyle.field5 = $('#select_5').val();

    return newStyle;
}
