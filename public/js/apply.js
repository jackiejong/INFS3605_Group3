var chosenCourse = "";

// To Logout
function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}



// Process Taking in Data from User and Transfer it to Database
// Create a Job Listing Function
function onSubmit() {
    var db = firebase.firestore();
    // Initialize all variables from the form
    var courseCode = document.getElementById("inputCourseCode").value;
    var courseName = document.getElementById("inputCourseName").value;
    var courseDescription = document.getElementById("inputCourseDescription").value;
    var role = document.getElementById("inputRole").value;
    var responsibilities = document.getElementById("inputResponsibilities").value;
    var marksRequirement = document.getElementById("inputMarksRequirement").value;
    var skillsRequirement = document.getElementById("inputSkillsRequirement").value;
    var experienceRequirement = document.getElementById("inputExperienceRequirement").value;
    var expiryDate = document.getElementById("inputExpiryDate").value;

    // Debugging: Whether Inputting works
    console.log("DEBUG: Create Job Listing");
    console.log(courseCode);
    console.log(courseName);
    console.log(courseDescription);
    console.log(role);
    console.log(responsibilities);
    console.log(marksRequirement);
    console.log(skillsRequirement);
    console.log(experienceRequirement);
    console.log(expiryDate);

    // Add a new document with a generated id.
    db.collection("jobListing").add({
      courseCode:courseCode,
      courseDescription:courseDescription,
      courseName:courseName,
      experienceRequirement:experienceRequirement,
      expiryDate:expiryDate,
      marksRequirement:marksRequirement,
      responsibilities:responsibilities,
      role:role,
      skillsRequirement:skillsRequirement
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      window.location.assign("success.html");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
      window.alert(error, "\nSomething went wrong. Try again!");
    });
}























// This Function is not being used right now
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
  });

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
