var db = firebase.firestore();
var title = document.getElementById("title");
var courseName = document.getElementById("courseName");
var courseDescription = document.getElementById("courseDescription");
var experienceRequirement = document.getElementById("experienceRequirement");
var skillsRequirement = document.getElementById("skillsRequirement");
var marksRequirement = document.getElementById("marksRequirement");
var expiryDate = document.getElementById("expiryDate");

var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);

function onLoad() {
    
    console.log("Document ID ", queryString);

    var docRef = db.collection("jobListing").doc(queryString);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            // title.innerHTML = doc.data().role + " for " + doc.data().courseCode;
            courseName.value = doc.data().courseName;
            courseDescription.value = doc.data().courseDescription;
            experienceRequirement.value = doc.data().experienceRequirement;
            skillsRequirement.value = doc.data().skillsRequirement;
            marksRequirement.value = doc.data().marksRequirement;
            expiryDate.value = doc.data().expiryDate;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}

function deleteListing(){

    db.collection("jobListing").doc(queryString).delete().then(function() {
        window.alert("Document successfully deleted!");
        window.location.assign("joblistings.html");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

}

function updateListing(){

    db.collection("jobListing").doc(queryString).update({

        courseName: courseName.value

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    window.alert("yas");

}

