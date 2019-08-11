var db = firebase.firestore();
var lecturerName = document.getElementById("lecturerName");
var lecturerEmail = document.getElementById("lecturerEmail");


function onLoad() {
    
        //var profileDOB = document.getElementById("profile_dob");
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.  
                var docRef = db.collection('lecturer').doc(user.uid);
                lecturerEmail.innerHTML = user.email;
                docRef.get().then(function(doc) {
                    if (doc.exists) {
                        lecturerName.innerHTML = doc.data().name;
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            } else {
                console.log("no user signed in");
                window.location.assign('index.html');
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


function deleteAcc() {
    var user = firebase.auth().currentUser;
    window.alert("Not gonna delete until Presentation day!!");
    /*
    user.delete().then(function() {
        // User deleted.
        window.alert("User Deleted! :(");

    }).catch(function(error) {
    // An error happened.
    }).then(function() {
        window.location.assign('index.html');
    });
    */
}