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


var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("Document ID ", queryString);

function onLoad() {
    

    var docRef = db.collection("jobListing").doc(queryString);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            //title.innerHTML = doc.data().role + " for " + doc.data().courseCode;
            courseCode.innerHTML = doc.data().courseCode;
            courseName.innerHTML = doc.data().courseName;
            courseDescription.innerHTML = doc.data().courseDescription;
            experienceRequirement.innerHTML = doc.data().experienceRequirement;
            skillsRequirement.innerHTML = doc.data().skillsRequirement;
            marksRequirement.innerHTML = doc.data().marksRequirement;
            expiryDate.innerHTML = timeStampConverter(doc.data().expiryDate);
            role.innerHTML = doc.data().role;
            responsibilities.innerHTML = doc.data().responsibilities;
            
            
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

    function editListing() {
    var theLink = 'jobListingDetail_editable.html?' + queryString ;
    window.location.assign(theLink);
}