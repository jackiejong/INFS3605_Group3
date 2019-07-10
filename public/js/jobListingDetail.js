var db = firebase.firestore();
var title = document.getElementById("title");
var courseName = document.getElementById("courseName");
var courseDescription = document.getElementById("courseDescription");
var experienceRequirement = document.getElementById("experienceRequirement");
var skillsRequirement = document.getElementById("skillsRequirement");
var marksRequirement = document.getElementById("marksRequirement");
var expiryDate = document.getElementById("expiryDate");

function onLoad() {
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    console.log("Document ID ", queryString);

    var docRef = db.collection("jobListing").doc(queryString);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            title.innerHTML = doc.data().role + " for " + doc.data().courseCode;
            courseName.innerHTML = doc.data().courseName;
            courseDescription.innerHTML = doc.data().courseDescription;
            experienceRequirement.innerHTML = doc.data().experienceRequirement;
            skillsRequirement.innerHTML = doc.data().skillsRequirement;
            marksRequirement.innerHTML = doc.data().marksRequirement;
            expiryDate.innerHTML = doc.data().expiryDate;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });



}

