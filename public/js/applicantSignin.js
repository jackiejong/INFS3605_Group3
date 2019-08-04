var inputEmail = document.getElementById('inputEmail');
var inputPassword = document.getElementById('inputPassword');

function onSubmit() {
    userEmail = inputEmail.value;
    userPass = inputPassword.value;

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
        
        
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          var user = firebase.auth().currentUser;
          console.log("user successfully signed in")
          window.location.assign('applicantDashboard.html')
      } else {
        console.log("no user signed in");
      }
    });
}