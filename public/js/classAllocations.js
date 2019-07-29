var db = firebase.firestore();
var divDropdown = document.getElementById('insertDropdownHere');
var divTable = document.getElementById('insertTableHere');


function onLoad() {

    // Select
    var select = document.createElement('select');
    var option = document.createElement('option');
    option.value = 0;
    option.selected = true;
    select.appendChild(option);
    
    // Table
    var arrayHeading = ['Course Code','Role','Class Times', 'Tutor'];
    var table = document.createElement('table');
    table.setAttribute('id', 'empTable'); 
    table.setAttribute('class', 'table table-striped table-hover');
    

    var rowHeading = table.insertRow(-1);

    

    
    for (var h = 0; h < arrayHeading.length; h ++) {
        var th = document.createElement('th');
        th.innerHTML = arrayHeading[h];
        rowHeading.appendChild(th);
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.  
            var user = firebase.auth().currentUser;
            db.collection("jobListing").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    

                    var option = document.createElement('option');
                    option.value = doc.data().courseCode;
                    option.innerHTML = doc.data().courseCode;
                    select.appendChild(option);

                                     
                    for (var i = 0; i < doc.data().classTimes.length; i ++) {
                        console.log("========================EACH ROW====================");
                        console.log("STEP ", i);
                        var tr = table.insertRow(-1);   
                        var selectTutor = document.createElement('select');

                        var courseCodeCol = document.createElement('td');
                        var roleCol = document.createElement('td');
                        var classTimeCol = document.createElement('td');
                        var tutorAllocationCol = document.createElement('td');

                        courseCodeCol.innerHTML = doc.data().courseCode;
                        roleCol.innerHTML = doc.data().role;
                        classTimeCol.innerHTML = classTimesConverter(doc.data().classTimes[i]);
                        
                        createSelect(doc.data().classTimes[i], doc.id, selectTutor,tutorAllocationCol);


                        tr.appendChild(courseCodeCol);
                        tr.appendChild(roleCol);
                        tr.appendChild(classTimeCol);
                        //tr.appendChild(tutorAllocationCol);
                    }
                             
                });
            }).catch(function(error) {
                console.log(error);
            }).finally(function() {
                console.log("Last Step");
                divDropdown.appendChild(select);
                divTable.appendChild(table);
            });  
        
          } else {
            console.log("no user signed in");
          }
        
    });
}

function createSelect (currClassTime, jobListingID, selectTutor, Col) {
    
    db.collection('accepted').get().then((querySnapshot)=> {
        querySnapshot.forEach((doc) => {
            console.log(doc.data().jobListing+ " "+ currClassTime);    
            for (var h = 0; h < doc.data().applicantAvailabilities.length; h ++) {              
                if (doc.data().applicantAvailabilities[h] == currClassTime && jobListingID == doc.data().jobListing) {
                    console.log("SAMA");
                    var optionTutor = document.createElement('option');
                    optionTutor.value = doc.data().jobApplication;
                    optionTutor.innerHTML = doc.data().applicantName;
                    selectTutor.appendChild(optionTutor);
                    console.log("EACH PERSON HAS " + h + " AVAILABILITIES THAT MATCH");
                }
            }
            
        });

    }).catch(function(error) {
        console.log(error);
    }).then(function() {
        Col.appendChild(selectTutor);
    });
}







function classTimesConverter(inputDate) {
    var days = ['Monday', 'Tuesday','Wednesday','Thursday','Friday'];
    var fromHours = Math.floor((inputDate % 100000000) / 10000);
    var toHours = (inputDate % 10000);
    var day = days[Math.floor(inputDate / 100000000) - 1];

    
    console.log(fromHours, toHours, day);

    if (fromHours == 900) {
        return day + " " + "0" + fromHours + " - " + toHours;
      
    } else {
        return day + " "  + fromHours + " - " + toHours;
       
    }
}

