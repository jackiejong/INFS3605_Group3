var db = firebase.firestore();

var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("Document ID ", queryString);
console.log(typeof queryString);


var divDropdown = document.getElementById('insertDropdownHere');
var divButtonDropdown = document.getElementById('insertButtonDropdownHere');
var divTable = document.getElementById('insertTableHere');
var dictionary = {};


function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            actuallyCreatingShit(user.uid);
        } else {
            window.alert('No user signed in');
        }
    });
    
}

function createDict () {
    var i = 1;
    db.collection('jobApplication').get().then((querySnapshot)=> {
        querySnapshot.forEach((doc) => {  
            console.log("-------------------Accepted No " + i + "----------------------");

            if (doc.data().status == "Accepted - Allocate Class") {
                for (var h = 0; h < doc.data().applicantAvailabilities.length; h ++) {              
                    var keyDict = doc.id + "?" + doc.data().jobListing + "?" + doc.data().applicantAvailabilities[h] ;
                    var valueDict = doc.data().applicantName;
                    dictionary[keyDict] = valueDict;
                }  
            }  
            i ++;
        });

    }).catch(function(error) {
        console.log(error);
    });
}

function appendOptionsToSelect (jobListingID, selectTag, classTime) {
    var ada = false;
    for (var key in dictionary) {
        var keySplits = key.split('?');
        console.log(keySplits[1] + " == " + keySplits[2], " == ", dictionary[key] );
        if (keySplits[1] == jobListingID && classTime == keySplits[2]) {
            var ada = true;
            var option = document.createElement('option');
            option.value = classTime;
            option.innerHTML = dictionary[key];
            selectTag.appendChild(option);
        }
    }

    if (ada == false) {
        var option = document.createElement('option');
        option.value = 0;
        option.innerHTML = "No Candidate";
        option.selected = true;
        option.disabled = true;
        selectTag.appendChild(option);
    } else {
        var option = document.createElement('option');
        option.value = 0;
        option.innerHTML = "Select Candidate";
        option.selected = true;
        option.disabled = true;
        selectTag.appendChild(option);

    }
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

function submitFilter() {
    var selectValue = document.getElementById('courseFilter').value;
    var theLink = 'classAllocations.html?' + selectValue;
    window.location.assign(theLink);
}

function actuallyCreatingShit(userUID) {

    // Select
    createDict();
    var select = document.createElement('select');
    select.setAttribute('id', 'courseFilter');
    select.setAttribute('class', 'form-control');
    var option = document.createElement('option');
    option.value = 0;
    option.selected = true;
    option.disabled = null;
    option.innerHTML = "Filter By Course"
    select.appendChild(option);

    var submitFilterButton = document.createElement('button');
    submitFilterButton.innerHTML = "Go";
    submitFilterButton.setAttribute('class', 'btn btn-secondary');
    submitFilterButton.setAttribute('onclick','submitFilter()');

    
    
    // Table
    var arrayHeading = ['Course Code','Role','Class Times', 'Tutor'];
    var table = document.createElement('table');
    table.setAttribute('id', 'empTable'); 
    table.setAttribute('class', 'table table-striped table-hover');
    table.setAttribute('style','margin:auto;')
    

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
                    if (doc.data().lecturer == userUID) {

                            var option = document.createElement('option');
                            
                            option.value = doc.data().courseCode;
                            option.innerHTML = doc.data().courseCode;
                            select.appendChild(option);
                            
                            if (queryString == "" || queryString == "0") {
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
                            
                                    appendOptionsToSelect(doc.id,selectTutor,doc.data().classTimes[i]);
                                    tutorAllocationCol.appendChild(selectTutor);

                                    tr.appendChild(courseCodeCol);
                                    tr.appendChild(roleCol);
                                    tr.appendChild(classTimeCol);
                                    tr.appendChild(tutorAllocationCol);
                                }
                            } else {
                                for (var i = 0; i < doc.data().classTimes.length; i ++) {
                                    if(doc.data().courseCode == queryString) {
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
                                
                                        appendOptionsToSelect(doc.id,selectTutor,doc.data().classTimes[i]);
                                        tutorAllocationCol.appendChild(selectTutor);

                                        tr.appendChild(courseCodeCol);
                                        tr.appendChild(roleCol);
                                        tr.appendChild(classTimeCol);
                                        tr.appendChild(tutorAllocationCol);
                                    }
                                }
                            }
                    }
                             
                });
            }).catch(function(error) {
                console.log(error);
            }).finally(function() {
                console.log("Last Step");
                divDropdown.appendChild(select);
                divButtonDropdown.appendChild(submitFilterButton);
                divTable.appendChild(table);
                console.log(dictionary);
                
            });  
        
          } else {
            console.log("no user signed in");
          }
          
        
    });

}