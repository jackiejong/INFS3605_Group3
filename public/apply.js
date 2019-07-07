var chosenCourse = "";
function onLoad() {
    var queryString = decodeURIComponent(window.location.search);
    
    queryString = queryString.substring(1);
    queryString = queryString.split("=");
    console.log(queryString[1]);
    chosenCourse = queryString[1];
    
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