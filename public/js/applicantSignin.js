var inputEmail = document.getElementById('inputEmail');
var db = firebase.firestore();
var inputPassword = document.getElementById('inputPassword');

function onSubmit() {

    var spinnerLoading = document.getElementById("spinnerLoading");
    spinnerLoading.setAttribute('style','visibility: visible;');
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


          db.collection('applicant').doc(user.uid).get().then(function(doc) {
              console.log(doc.id + " =============== " + doc.data().name);
          }).catch(function(error) {
              window.alert("No user found");
              logout();
          }).then(function() {
              console.log("user successfully signed in");
              window.location.assign('applicantDashboard.html');
          });
          
      } else {
        console.log("no user signed in");
      }
    });
}


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

  function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.reload();
      }).catch(function(error) {
        window.alert('Something happened!');
      });  
}


