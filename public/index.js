function onLoad() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        firebase.auth().signOut().then(function() {
          console.log('A user successfully logged out');
        }).catch(function(error) {
          window.alert('Something happened!');
        });
    } else {
        console.log("no user signed in");
    }
    
  });
}


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
          var user = firebase.auth().currentUser;
          console.log("user successfully signed in")
          window.location.assign('dashboard.html')
      } else {
        console.log("no user signed in");
      }
      
    });
  }

