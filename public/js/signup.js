
function signup() {

    var db = firebase.firestore();

    var spinnerLoading = document.getElementById("spinnerLoading");
    spinnerLoading.setAttribute('style','visibility: visible;');
    
    var userFirstName = document.getElementById("inputFirstName").value;
    var userLastName = document.getElementById("inputLastName").value;
    var fullName = userFirstName + " " + userLastName;
    //var userDOB = document.getElementById("inputDOB").value;
    //userDOB = Date.parse(userDOB) / 1000;
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
          var userUID = user.uid.toString();
          console.log('User successfully signed up');

          db.collection("lecturer").doc(userUID).set({
            name: fullName,
            dob: 0
          })
          .then(function() {
            console.log("Document successfully written!");
            window.location.assign('dashboard.html');
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
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
      document.getElementById("signupButton").click();
      
    }
  });
}