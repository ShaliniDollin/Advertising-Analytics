$(document).ready(function(){

    if(typeof result === 'object'){
         $('#dash').show();
     }
     else{
         $('#dash').hide();
     }
     function showlogin() {
       $('#signupModal').modal('hide') ;
       $('#LoginModal').modal('show');
      }
      function showsignup() {
        $('#signupModal').modal('show') ;
        $('#LoginModal').modal('hide');
      }
 });
