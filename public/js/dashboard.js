function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}

function getCurrentUser() {   
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.  
        var user = firebase.auth().currentUser;
        console.log(user.uid);
        var userUID = user.uid.toString();
        console.log("User UID in string ",userUID);
      } else {
        console.log("no user signed in");
      }
    });
}