var db = firebase.firestore();

var courseCodeArray = [];
var statsArray = [];
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var querySplits = queryString.split('&');
var theCourseValue = querySplits[0].split('=')[1];
var theStatusValue = querySplits[1].split('=')[1];
console.log("Document ID ", queryString, theCourseValue, theStatusValue);
console.log(typeof queryString);

function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            actuallyCreatingTables(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
}


function onClick(something) {
    //window.alert(something);
    window.location.href=something;
}

function classTimesConverter(inputDate) {
    var days = ['Monday', 'Tuesday','Wednesday','Thursday','Friday'];
    var fromHours = Math.floor((inputDate % 100000000) / 10000);
    var toHours = (inputDate % 10000);
    var day = days[Math.floor(inputDate / 100000000) - 1];

    console.log(fromHours, toHours, day);

    if (fromHours == 900) {
        if (toHours == 900) {
            return day + " " + "0" + fromHours + " - 0" + toHours;
        } else {
            return day + " " + "0" + fromHours + " - " + toHours;
        }  
    } else {
        return day + " "  + fromHours + " - " + toHours; 
    }
}

function prepareClassTimes (inputClassTimes) {
    var classTimesConverted = [];
    for (var i = 0; i <inputClassTimes.length; i ++) {
        classTimesConverted[i] = classTimesConverter(inputClassTimes[i]);
    }
    console.log(classTimesConverted);
    var sessionTimesCol = classTimesConverted.join("<br>") ;
    return sessionTimesCol;
}



function actuallyCreatingTables(userUID) {
    var arrHead = new Array();
    arrHead = ['Applicant','Role', 'Course Code', 'Availabilities','Status',""];      // SIMPLY ADD OR REMOVE VALUES IN THE ARRAY FOR TABLE HEADERS.

    // FIRST CREATE A TABLE STRUCTURE BY ADDING A FEW HEADERS AND
    // ADD THE TABLE TO YOUR WEB PAGE.
    
        var empTable = document.createElement('table');
        empTable.setAttribute('id', 'empTable'); 
        empTable.setAttribute('class', 'table table-striped table-hover');
        empTable.setAttribute('style','padding-top: 100px;');           

        var tr = empTable.insertRow(-1);

        for (var h = 0; h < arrHead.length; h++) {
            var th = document.createElement('th');
            // TABLE HEADER.
            th.innerHTML = arrHead[h];
            tr.appendChild(th);
        }

        // Create FILTER
        var select = document.createElement('select');
        select.setAttribute('id', 'courseFilter');
        select.setAttribute('class', 'form-control');
        
        var option = document.createElement('option');
        option.value = 0;
        option.selected = true;
        option.disabled = true;
        option.innerHTML = "Filter By Course";
        select.appendChild(option);

        var submitFilterButton = document.createElement('button');
        submitFilterButton.innerHTML = "Go";
        submitFilterButton.setAttribute('class', 'btn btn-secondary');
        submitFilterButton.setAttribute('onclick','submitFilter()');



        // Create Status Filter
        var selectStat = document.createElement('select');
        selectStat.setAttribute('id', 'statusFilter');
        selectStat.setAttribute('class', 'form-control');
        
        var option1 = document.createElement('option');
        option1.value = 0;
        option1.selected = true;
        option1.disabled = true;
        option1.innerHTML = "Filter By Status";
        selectStat.appendChild(option1);
  
        db.collection("jobApplication").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().lecturer == userUID) {


                    if (!courseCodeArray.includes(doc.data().courseCode)) {
                        var option = document.createElement('option');
                        option.value = doc.data().courseCode;
                        option.innerHTML = doc.data().courseCode;
                        select.appendChild(option);
                        courseCodeArray.push(doc.data().courseCode);
                    }

                    if (!statsArray.includes(doc.data().status)) {
                        var option = document.createElement('option');
                        option.value = doc.data().status;
                        option.innerHTML = doc.data().status;
                        selectStat.appendChild(option);
                        statsArray.push(doc.data().status); 
                    }



                    if ((theCourseValue == 0 || theCourseValue == null) && (theStatusValue == 0 || theStatusValue == null)) {
                        var tr = empTable.insertRow(-1);
                        var applicantCol = document.createElement('td');
                        var roleCol = document.createElement('td');
                        var courseCodeCol = document.createElement('td');
                        var sessionTimesCol = document.createElement('td');
                        var statusCol = document.createElement('td');

                        var jobListingRef = db.collection('jobListing').doc(doc.data().jobListing);
                        var applicantRef = db.collection('applicant').doc(doc.data().applicant);

                        

                        console.log(`${doc.id} => ${doc.data()}`);
                        jobListingRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("jobListing data:", doc.data());
                                roleCol.innerHTML = doc.data().role;
                                courseCodeCol.innerHTML = doc.data().courseCode;

                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        applicantRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("applicant data:", doc.data());
                                applicantCol.innerHTML = doc.data().name;
    
                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                        sessionTimesCol.innerHTML = classTimes;
                        statusCol.innerHTML = doc.data().status;

                        tr.appendChild(applicantCol);
                        tr.appendChild(roleCol);
                        tr.appendChild(courseCodeCol);
                        tr.appendChild(sessionTimesCol);
                        tr.appendChild(statusCol);

                        td = document.createElement('td');
                        var button = document.createElement('button');

                        var theLink = 'onClick("' + 'applicationDetailed.html?' + doc.id + '")';
                        button.setAttribute("onclick",theLink);
                        button.setAttribute("class","btn btn-dark");
                        button.innerHTML = "View Details";
                        td.appendChild(button);
                        tr.appendChild(td);
                    } else if (doc.data().courseCode == theCourseValue && theStatusValue == 0) {
                        var tr = empTable.insertRow(-1);
                        var applicantCol = document.createElement('td');
                        var roleCol = document.createElement('td');
                        var courseCodeCol = document.createElement('td');
                        var sessionTimesCol = document.createElement('td');
                        var statusCol = document.createElement('td');

                        var jobListingRef = db.collection('jobListing').doc(doc.data().jobListing);
                        var applicantRef = db.collection('applicant').doc(doc.data().applicant);

                        

                        console.log(`${doc.id} => ${doc.data()}`);
                        jobListingRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("jobListing data:", doc.data());
                                roleCol.innerHTML = doc.data().role;
                                courseCodeCol.innerHTML = doc.data().courseCode;

                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        applicantRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("applicant data:", doc.data());
                                applicantCol.innerHTML = doc.data().name;
    
                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                        sessionTimesCol.innerHTML = classTimes;
                        statusCol.innerHTML = doc.data().status;

                        tr.appendChild(applicantCol);
                        tr.appendChild(roleCol);
                        tr.appendChild(courseCodeCol);
                        tr.appendChild(sessionTimesCol);
                        tr.appendChild(statusCol);

                        td = document.createElement('td');
                        var button = document.createElement('button');

                        var theLink = 'onClick("' + 'applicationDetailed.html?' + doc.id + '")';
                        button.setAttribute("onclick",theLink);
                        button.setAttribute("class","btn btn-dark");
                        button.innerHTML = "View Details";
                        td.appendChild(button);
                        tr.appendChild(td);
                    } else if (doc.data().status == theStatusValue && theCourseValue == 0) {
                        var tr = empTable.insertRow(-1);
                        var applicantCol = document.createElement('td');
                        var roleCol = document.createElement('td');
                        var courseCodeCol = document.createElement('td');
                        var sessionTimesCol = document.createElement('td');
                        var statusCol = document.createElement('td');

                        var jobListingRef = db.collection('jobListing').doc(doc.data().jobListing);
                        var applicantRef = db.collection('applicant').doc(doc.data().applicant);

                        

                        console.log(`${doc.id} => ${doc.data()}`);
                        jobListingRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("jobListing data:", doc.data());
                                roleCol.innerHTML = doc.data().role;
                                courseCodeCol.innerHTML = doc.data().courseCode;

                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        applicantRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("applicant data:", doc.data());
                                applicantCol.innerHTML = doc.data().name;
    
                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                        sessionTimesCol.innerHTML = classTimes;
                        statusCol.innerHTML = doc.data().status;

                        tr.appendChild(applicantCol);
                        tr.appendChild(roleCol);
                        tr.appendChild(courseCodeCol);
                        tr.appendChild(sessionTimesCol);
                        tr.appendChild(statusCol);

                        td = document.createElement('td');
                        var button = document.createElement('button');

                        var theLink = 'onClick("' + 'applicationDetailed.html?' + doc.id + '")';
                        button.setAttribute("onclick",theLink);
                        button.setAttribute("class","btn btn-dark");
                        button.innerHTML = "View Details";
                        td.appendChild(button);
                        tr.appendChild(td);
                    } else if ( doc.data().status == theStatusValue && doc.data().courseCode == theCourseValue) {
                        var tr = empTable.insertRow(-1);
                        var applicantCol = document.createElement('td');
                        var roleCol = document.createElement('td');
                        var courseCodeCol = document.createElement('td');
                        var sessionTimesCol = document.createElement('td');
                        var statusCol = document.createElement('td');

                        var jobListingRef = db.collection('jobListing').doc(doc.data().jobListing);
                        var applicantRef = db.collection('applicant').doc(doc.data().applicant);

                        

                        console.log(`${doc.id} => ${doc.data()}`);
                        jobListingRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("jobListing data:", doc.data());
                                roleCol.innerHTML = doc.data().role;
                                courseCodeCol.innerHTML = doc.data().courseCode;

                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        applicantRef.get().then(function(doc) {
                            if (doc.exists) {
                                console.log("applicant data:", doc.data());
                                applicantCol.innerHTML = doc.data().name;
    
                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });

                        var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                        sessionTimesCol.innerHTML = classTimes;
                        statusCol.innerHTML = doc.data().status;

                        tr.appendChild(applicantCol);
                        tr.appendChild(roleCol);
                        tr.appendChild(courseCodeCol);
                        tr.appendChild(sessionTimesCol);
                        tr.appendChild(statusCol);

                        td = document.createElement('td');
                        var button = document.createElement('button');

                        var theLink = 'onClick("' + 'applicationDetailed.html?' + doc.id + '")';
                        button.setAttribute("onclick",theLink);
                        button.setAttribute("class","btn btn-dark");
                        button.innerHTML = "View Details";
                        td.appendChild(button);
                        tr.appendChild(td);
                    }
                }
            });
        }).then(function() {
            var filterStatDiv = document.getElementById('insertStatusDropdownHere');
            filterStatDiv.appendChild(selectStat);
            var filterDiv = document.getElementById('insertDropdownHere');
            filterDiv.appendChild(select);
            var filterButtonDiv = document.getElementById('insertButtonDropdownHere');
            filterButtonDiv.appendChild(submitFilterButton);
        });

        var div = document.getElementById('insertTableHere');
        div.appendChild(empTable);    // ADD THE TABLE TO YOUR WEB PAGE.
}

function submitFilter() {
    var courseValue = document.getElementById('courseFilter').value;
    var statusValue = document.getElementById('statusFilter').value;
    console.log("Course  = " + courseValue + "\nStatus = " + statusValue);
    var theLink = "allApplications.html?course=" + courseValue + "&status=" + statusValue;
    window.location.assign(theLink);
}