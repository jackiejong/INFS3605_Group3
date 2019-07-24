var db = firebase.firestore();

function onLoad() {


    var arrHead = new Array();
    arrHead = ['Role', 'Applicant',''];      // SIMPLY ADD OR REMOVE VALUES IN THE ARRAY FOR TABLE HEADERS.

    // FIRST CREATE A TABLE STRUCTURE BY ADDING A FEW HEADERS AND
    // ADD THE TABLE TO YOUR WEB PAGE.
    var jobListingName ="";
    var applicantName ="";
    var jobApplicationTable = document.createElement('table');
    jobApplicationTable.setAttribute('id', 'jobApplicationTable');            // SET THE TABLE ID.

    var tr = jobApplicationTable.insertRow(-1);

    for (var h = 0; h < arrHead.length; h++) {
        var th = document.createElement('th');          // TABLE HEADER.
        th.innerHTML = arrHead[h];
        tr.appendChild(th);
    }

    
    
    db.collection("jobApplication").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
                
                var tr = jobApplicationTable.insertRow(-1);
                

                var docRefJobListing = db.collection("jobListing").doc(doc.data().jobListing);
                docRefJobListing.get().then(function(doc) {
                    if (doc.exists) {
                        jobListingName = doc.data().role + " for " + doc.data().courseCode;
                        console.log(jobListingName);
                        
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
                    
                var docRefApplicant = db.collection("applicant").doc(doc.data().applicant);
                docRefApplicant.get().then(function(doc) {
                    if (doc.exists) {
                        applicantName = doc.data().name;
                        console.log(applicantName);
                        
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });


                console.log(applicantName);
                console.log(jobListingName);
                var td = document.createElement('td');
                td.innerHTML = jobListingName;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = applicantName;
                tr.appendChild(td);

                

                /*
                td = document.createElement('td');
                var button = document.createElement('button');
                console.log(typeof doc.id);
                var theLink = 'onClick("' + 'jobListingDetail.html?' + doc.id + '")';
                console.log(typeof theLink);
                button.setAttribute("onclick",theLink);
                button.setAttribute("class","btn btn-dark");
                button.innerHTML = "View Details";
                td.appendChild(button);
                tr.appendChild(td);
                */
            
        });
    });

    
    var div = document.getElementById('insertTableHere');

    div.appendChild(jobApplicationTable);    // ADD THE TABLE TO YOUR WEB PAGE.
        
}
     
     
     
function onClick(something) {
    //window.alert(something);
    window.location.href=something;
}



    /*
    db.collection('jobListing').get().then(snap => {
        size = snap.size // will return the collection size
        console.log(size);
     });

     */




function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}
