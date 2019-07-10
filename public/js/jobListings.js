var db = firebase.firestore();

function onLoad() {


    var arrHead = new Array();
    arrHead = ['Course Code', 'Role', 'Description', 'Skill Requirement','Experience Requirement','WAM Requirement'];      // SIMPLY ADD OR REMOVE VALUES IN THE ARRAY FOR TABLE HEADERS.

    // FIRST CREATE A TABLE STRUCTURE BY ADDING A FEW HEADERS AND
    // ADD THE TABLE TO YOUR WEB PAGE.
    
        var empTable = document.createElement('table');
        empTable.setAttribute('id', 'empTable');            // SET THE TABLE ID.

        var tr = empTable.insertRow(-1);

        for (var h = 0; h < arrHead.length; h++) {
            var th = document.createElement('th');          // TABLE HEADER.
            th.innerHTML = arrHead[h];
            tr.appendChild(th);
        }

        
        
        db.collection("jobListing").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()}`);
                    var tr = empTable.insertRow(-1);

                    var td = document.createElement('td');
                    td.innerHTML = doc.data().courseCode;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.innerHTML = doc.data().role;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.innerHTML = doc.data().description;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.innerHTML = doc.data().skillsRequirement;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.innerHTML = doc.data().experienceRequirement;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.innerHTML = doc.data().marksRequirement;
                    tr.appendChild(td);
            });
        });

        var div = document.getElementById('insertTableHere');

        div.appendChild(empTable);    // ADD THE TABLE TO YOUR WEB PAGE.
    




    /*
    db.collection('jobListing').get().then(snap => {
        size = snap.size // will return the collection size
        console.log(size);
     });

     */
}