var db = firebase.firestore();
function getCurrentUser() {
        
        var profileName = document.getElementById("profile_name");
        var profileDOB = document.getElementById("profile_dob");
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
                          var result = timeStampConverter(doc.data().dob);     
                          console.log("DOB ", typeof doc.data().dob);
                          console.log("DOB converted ", result );
                          profileName.innerHTML = doc.data().name;
                          profileDOB.innerHTML = result;
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
    console.log(unix_timestamp);
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp*1000);
    // Hours part from the timestamp
    var day = date.getDate();

    var month = date.getMonth();

    var year = date.getFullYear();
    // Minutes part from the timestamp
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    
    // Will display time in 10:30:23 format
    var formattedTime = day + " " + monthNames[month] + " " + year;
    return formattedTime;
}


function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });  
}
