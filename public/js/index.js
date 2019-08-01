function onLoad() {
  var passField = document.getElementById("inputPassword");
  var spinnerLoading = document.getElementById("spinnerLoading");
  spinnerLoading.setAttribute('style','visibility: hidden;');

  passField.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("loginButton").click();
      
    }
  });
}

function login(){
  var spinnerLoading = document.getElementById("spinnerLoading");
  spinnerLoading.setAttribute('style','visibility: visible;');

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
            window.alert('Wrong password.');
            
        } else {
            window.alert(errorMessage);
        }
        
        window.location.reload();
        console.log(error);
        
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var user = firebase.auth().currentUser;
          console.log("user successfully signed in")
          window.location.assign('dashboard.html')
      } else {
        console.log("no user signed in");
      }
    });
  }

