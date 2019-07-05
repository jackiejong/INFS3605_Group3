function signup() {

    var userEmail = document.getElementById("inputEmail").value;
    var userPass = document.getElementById("inputPassword").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });


    // [END createwithemail]    

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.  
          var user = firebase.auth().currentUser;
      
          if(user != null){
            console.log('User successfully signed up')
            // Debug
            // var email_id = user.email;
            // document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
            window.location.assign('dashboard.html')
      
          } else {
            console.log("no user signed in");
          }
        }
      });
}
