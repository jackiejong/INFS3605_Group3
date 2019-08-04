var chosenCourse = "";
var lecturerName;
var lecturerID;
var db = firebase.firestore();

function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection('lecturer').doc(user.uid).get().then(function(doc) {
              if (doc.exists) {
                  lecturerName = doc.data().name;
                  lecturerID = doc.id;
                  console.log(lecturerName);
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
              }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        } else {
          window.alert('No user signed in');
          window.location.assign('index.html');
    }
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
      var noOfClass = document.getElementById("inputNoOfClass").value;
      var classTimes = [];
  
      for (var i = 1; i <= noOfClass; i ++) {
          var dayID = "class" + i + "Day";
          var fromHourID = "class" + i + "FromHour";
          var fromMinID = "class" + i + "FromMinutes";
          var toHourID = "class" + i + "ToHour";
          var toMinID = "class" + i + "ToMinutes";
  
          var day = document.getElementById(dayID).value * 100000000;
          var fromHour = document.getElementById(fromHourID).value * 1000000;
          var fromMin = document.getElementById(fromMinID).value * 10000;
          var toHour = document.getElementById(toHourID).value * 100;
          var toMin = Number(document.getElementById(toMinID).value);
  
          // Debugging
          console.log(day);
          console.log(fromHour);
          console.log(toHour);
          console.log(toMin);
  
          var classTime = day + fromHour + fromMin + toHour + toMin;
          classTimes.push(classTime);
          
      
      }
  
      expiryDate = new Date(expiryDate);
      var expiryDateVal = Math.round(expiryDate) / 1000;
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
      console.log(expiryDateVal);
      console.log(noOfClass);
      console.log(classTimes);
  
      
      
      // Add a new document with a generated id.
      db.collection("jobListing").add({
        courseCode:courseCode,
        courseDescription:courseDescription,
        courseName:courseName,
        experienceRequirement:experienceRequirement,
        expiryDate:expiryDateVal,
        marksRequirement:marksRequirement,
        responsibilities:responsibilities,
        role:role,
        skillsRequirement:skillsRequirement,
        noOfClass: noOfClass,
        classTimes:classTimes,
        lecturer:lecturerID,
        lecturerName:lecturerName
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


function addClassTimes() {
    var noOfClass = document.getElementById("inputNoOfClass").value;
    var noOfClassButton = document.getElementById("addClassTimesButton");
    var submitButton = document.getElementById("createNewListingBtn");
    noOfClassButton.setAttribute("hidden", true);
    submitButton.setAttribute("style", "visibility: visible;");
    
    var template = document.getElementById("classTimesSelection");
    

    for (var i = 0; i < noOfClass; i ++) {
        var br = document.createElement("br");
        var label = document.createElement("label");
        label.setAttribute("style", "margin-right: 30px;");
        label.innerHTML = "Class " + (i + 1);
        
        var selectDay = document.createElement("select");
        var selectDayID = "class" + (i + 1) + "Day";
        selectDay.id = selectDayID;

        var selectFromHour = document.createElement("select");
        var selectFromHourID = "class" + (i + 1) +"FromHour";
        selectFromHour.id = selectFromHourID;

        var selectToHour = document.createElement("select");
        var selectToHourID = "class" + (i + 1) +"ToHour";
        selectToHour.id = selectToHourID;
      
        var mon = document.createElement("option");
        mon.value = 1;
        mon.text = "Monday";

        var tue = document.createElement("option");
        tue.value = 2;
        tue.text = "Tuesday";

        var wed = document.createElement("option");
        wed.value = 3;
        wed.text = "Wednesday";

        var thu = document.createElement("option");
        thu.value = 4;
        thu.text = "Thursday";

        var fri = document.createElement("option");
        fri.value = 5;
        fri.text = "Friday";
        
        var hour9 = document.createElement("option");
        hour9.value=9;
        hour9.innerHTML= "9";
        
        var hour10 = document.createElement("option");
        hour10.value=10;
        hour10.innerHTML= "10";

        var hour11 = document.createElement("option");
        hour11.value=11;
        hour11.innerHTML= "11";
        
        var hour12 = document.createElement("option");
        hour12.value=12;
        hour12.innerHTML= "12";

        var hour13 = document.createElement("option");
        hour13.value=13;
        hour13.innerHTML= "13";
        
        var hour14 = document.createElement("option");
        hour14.value=14;
        hour14.innerHTML= "14";

        var hour15 = document.createElement("option");
        hour15.value=15;
        hour15.innerHTML= "15";
        
        var hour16 = document.createElement("option");
        hour16.value=16;
        hour16.innerHTML= "16";

        var hour17 = document.createElement("option");
        hour17.value=17;
        hour17.innerHTML= "17";

        var hour18 = document.createElement("option");
        hour18.value=18;
        hour18.innerHTML= "18";
        
        var hour19 = document.createElement("option");
        hour19.value=19;
        hour19.innerHTML= "19";

        var hour20 = document.createElement("option");
        hour20.value=20;
        hour20.innerHTML= "20";
        
        var hour21 = document.createElement("option");
        hour21.value=21;
        hour21.innerHTML= "21";


        var toHour9 = document.createElement("option");
        toHour9.value=9;
        toHour9.innerHTML= "9";
        
        var toHour10 = document.createElement("option");
        toHour10.value=10;
        toHour10.innerHTML= "10";

        var toHour11 = document.createElement("option");
        toHour11.value=11;
        toHour11.innerHTML= "11";
        
        var toHour12 = document.createElement("option");
        toHour12.value=12;
        toHour12.innerHTML= "12";

        var toHour13 = document.createElement("option");
        toHour13.value=13;
        toHour13.innerHTML= "13";
        
        var toHour14 = document.createElement("option");
        toHour14.value=14;
        toHour14.innerHTML= "14";

        var toHour15 = document.createElement("option");
        toHour15.value=15;
        toHour15.innerHTML= "15";
        
        var toHour16 = document.createElement("option");
        toHour16.value=16;
        toHour16.innerHTML= "16";

        var toHour17 = document.createElement("option");
        toHour17.value=17;
        toHour17.innerHTML= "17";

        var toHour18 = document.createElement("option");
        toHour18.value=18;
        toHour18.innerHTML= "18";
        
        var toHour19 = document.createElement("option");
        toHour19.value=19;
        toHour19.innerHTML= "19";

        var toHour20 = document.createElement("option");
        toHour20.value=20;
        toHour20.innerHTML= "20";
        
        var toHour21 = document.createElement("option");
        toHour21.value=21;
        toHour21.innerHTML= "21";

        var selectFromMinutes = document.createElement("select");
        var selectFromMinutesID = "class" + (i + 1) + "FromMinutes";
        selectFromMinutes.id = selectFromMinutesID;

        var selectToMinutes = document.createElement("select");
        var selectToMinutesID = "class" + (i + 1) + "ToMinutes";
        selectToMinutes.id = selectToMinutesID;

        var min00 = document.createElement("option");
        min00.value=0;
        min00.innerHTML= "00";

        var min30 = document.createElement("option");
        min30.value=30;
        min30.innerHTML= "30";

        var toMin00 = document.createElement("option");
        toMin00.value=0;
        toMin00.innerHTML= "00";

        var toMin30 = document.createElement("option");
        toMin30.value=30;
        toMin30.innerHTML= "30";

        selectDay.appendChild(mon);
        selectDay.appendChild(tue);
        selectDay.appendChild(wed);
        selectDay.appendChild(thu);
        selectDay.appendChild(fri);

        selectFromHour.appendChild(hour9);
        selectFromHour.appendChild(hour10);
        selectFromHour.appendChild(hour11);
        selectFromHour.appendChild(hour12);
        selectFromHour.appendChild(hour13);
        selectFromHour.appendChild(hour14);
        selectFromHour.appendChild(hour15);
        selectFromHour.appendChild(hour16);
        selectFromHour.appendChild(hour17);
        selectFromHour.appendChild(hour18);
        selectFromHour.appendChild(hour19);
        selectFromHour.appendChild(hour20);
        selectFromHour.appendChild(hour21);

        selectToHour.appendChild(toHour9);
        selectToHour.appendChild(toHour10);
        selectToHour.appendChild(toHour11);
        selectToHour.appendChild(toHour12);
        selectToHour.appendChild(toHour13);
        selectToHour.appendChild(toHour14);
        selectToHour.appendChild(toHour15);
        selectToHour.appendChild(toHour16);
        selectToHour.appendChild(toHour17);
        selectToHour.appendChild(toHour18);
        selectToHour.appendChild(toHour19);
        selectToHour.appendChild(toHour20);
        selectToHour.appendChild(toHour21);

        selectToMinutes.appendChild(toMin00);
        selectToMinutes.appendChild(toMin30);

        selectFromMinutes.appendChild(min00);
        selectFromMinutes.appendChild(min30);

        var alpha = document.createElement("a");
        alpha.innerHTML = "  -  ";

        template.appendChild(label);
        template.appendChild(selectDay);
        template.appendChild(selectFromHour);
        template.appendChild(selectFromMinutes);

        template.appendChild(alpha);
        template.appendChild(selectToHour);
        template.appendChild(selectToMinutes);
        template.appendChild(br);
    }

    // Debug
    // var heading = document.createElement("h1");
    // heading.innerHTML = noOfClass;
    // var div = document.getElementById("insertClassTimesHere");
    // div.appendChild(heading);
}


function logout() {
  firebase.auth().signOut().then(function() {
      console.log('A user successfully logged out');
      window.location.assign("index.html");
    }).catch(function(error) {
      window.alert('Something happened!');
    });  
}
