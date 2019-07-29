var db = firebase.firestore();
//var title = document.getElementById("title");
var courseCode = document.getElementById("courseCode");
var courseName = document.getElementById("courseName");
var courseDescription = document.getElementById("courseDescription");
var experienceRequirement = document.getElementById("experienceRequirement");
var skillsRequirement = document.getElementById("skillsRequirement");
var marksRequirement = document.getElementById("marksRequirement");
var expiryDate = document.getElementById("expiryDate");
var role = document.getElementById("role");
var responsibilities = document.getElementById("responsibilities");
var courseCodeCourseName = document.getElementById("courseCodeCourseName");

var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("Document ID ", queryString);


function onLoad() {
   

    var docRef = db.collection("jobListing").doc(queryString);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            //title.innerHTML = doc.data().role + " for " + doc.data().courseCode;
            courseCode.value = doc.data().courseCode;
            courseName.value = doc.data().courseName;
            courseDescription.value = doc.data().courseDescription;
            experienceRequirement.value = doc.data().experienceRequirement;
            skillsRequirement.value = doc.data().skillsRequirement;
            marksRequirement.value = doc.data().marksRequirement;
            expiryDate.value = timeStampConverter(doc.data().expiryDate);
            role.value = doc.data().role;
            responsibilities.value = doc.data().responsibilities;
            courseCodeCourseName.innerHTML = doc.data().role + " for " + doc.data().courseCode;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function updateListing(){

    db.collection("jobListing").doc(queryString).update({

        courseName: courseName.value,
        courseCode: courseCode.value,
        courseDescription: courseDescription.value,
        role: role.value,
        responsibilities: responsibilities.value,
        marksRequirement: marksRequirement.value,
        skillsRequirement: skillsRequirement.value,
        experienceRequirement:experienceRequirement.value,
        expiryDate: expiryDate.value

    }).then(function() {
        window.alert("yas");
        var currentPage = 'jobListingDetail_static.html?' + queryString ;
         window.location.assign(currentPage);
    }).catch(function(error) {
        console.error("Error updating document: ", error);
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
    const monthNames = ["01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"
    ];

    
    // Will display time in 10:30:23 format
    var formattedTime = year + "-" + monthNames[month] + "-" + day;
    return formattedTime;
}

