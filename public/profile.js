var db = firebase.firestore();
function getCurrentUser() {
        
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.  
              var user = firebase.auth().currentUser;
          
              if(user != null){
                  // Debug
                  // var email_id = user.email;
                  // document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
                  console.log(user.uid);
                  var userUID = user.uid.toString();
                  console.log("User UID in string ",userUID);
                  
                  var docRef = db.collection("applicant").doc(userUID);

                  docRef.get().then(function(doc) {
                      if (doc.exists) {
                          console.log("Document data:", doc.data());
                          document.getElementById("profile_name").innerHTML = doc.data().name;
                          var result = timeStampConverter(doc.data().dob.seconds);
                          console.log("DOB ", doc.data().dob.seconds);
                          console.log("DOB converted ", result );
                      } else {
                          // doc.data() will be undefined in this case
                          console.log("No such document!");
                      }
                  }).catch(function(error) {
                      console.log("Error getting document:", error);
                  });
              } else {
                console.log("no user signed in");
              }
            }
          });
}

function timeStampConverter(unix_timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp*1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}