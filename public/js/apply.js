var chosenCourse = "";
function onLoad() {
    var db = firebase.firestore();
    var queryString = decodeURIComponent(window.location.search);
    var jobListingOverview = document.getElementById("jobListingOverview");
    
    queryString = queryString.substring(1);
    queryString = queryString.split("=");
    console.log(queryString[1]);

    chosenCourse = queryString[1];

    var docRef = db.collection("course").doc(chosenCourse);

    docRef.get().then(function(doc) {
      if (doc.exists) {
          jobListingOverview.innerHTML = doc.data().name;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }



    
    document.getElementById("application_form_title").innerHTML = chosenCourse;
}

function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}