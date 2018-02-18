$('document').ready(function(){
  
  $('#local').click(function(){
    $('.show-first').addClass('hide');
    $('.show-second').removeClass('hide');
  });
  
  $('#back').click(function(){
    $('.show-first').removeClass('hide');
    $('.show-second').addClass('hide');
  });
  
  
  $('#submit').attr('disabled', 'disabled');
  
  function inputChecks(){
    var username = $('#username').val().trim();
    var email = $('#email').val().trim();
    var re1 = /^\w{2,}@\w{2,}\.\w/m;
    var password = $('#password').val().trim();
    var re2 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    var repeat = $('#repeat').val().trim();
    
    if(username.length>3 && re1.test(email) && re2.test(password) && password == repeat){$('#submit').attr('disabled', false);}
  };
  
  
  $('#username').keyup(function(){
    var username = $('#username').val().trim();
    if(username.length<=2){$('.username').text('Username must contain at least 3 letters')}
    else{$('.username').text(null)}
    
    inputChecks();
  });
  $('#email').keyup(function(){
    var email = $('#email').val().trim();
    var re1 = /^\w{2,}@\w{2,}\.\w/m;
    if(!re1.test(email)){$('.email').text('email example: test@mail.com')}
    else{$('.email').text(null)}
    
    inputChecks();
  });
  $('#password').keyup(function(){
    var password = $('#password').val().trim();
    var re2 = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if(!re2.test(password)){$('.password').html('Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character')}
    else{$('.password').html('<span class="badge badge-success">Good<span>')}
    
    inputChecks();
  });
  $('#repeat').keyup(function(){
    var password = $('#password').val().trim();
    var repeat = $('#repeat').val().trim();
    if(password !== repeat){$('.repeat').text('Passwords are not the same')}
    else{$('.repeat').text(null)}
    
    inputChecks();
  });
});