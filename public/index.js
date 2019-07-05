function login(){

    var userEmail = document.getElementById("inputEmail").value;
    var userPass = document.getElementById("inputPassword").value;
    console.log(userEmail);
    console.log(userPass);

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    
        if (errorCode === 'auth/wrong-password') {
            console.log('Wrong password');
            windew.alert('Wrong password.');
            
        } else {
            window.alert(errorMessage);
        }
        console.log(error);
    });        

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.  
        var user = firebase.auth().currentUser;
    
        if(user != null){
          // Debug
          // var email_id = user.email;
          // document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
          console.log("user successfully signed in")
          window.location.assign('dashboard.html')
    
        } else {
          console.log("no user signed in");
        }
      }
    });
  }

