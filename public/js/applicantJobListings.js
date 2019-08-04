var db = firebase.firestore();
var appliedJobs=[];

function onLoad() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in
        
            getAppliedJobs(user.uid);
            //actuallyCreatingCards(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
}

function getAppliedJobs(userUID) {
    db.collection('applicant').doc(userUID).get().then(function(doc) {
        if (doc.exists) {
            appliedJobs = doc.data().appliedJobs;
        
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).then(function() {
        actuallyCreatingCards(userUID);
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function actuallyCreatingCards(userUID) {
    console.log(appliedJobs);
    var mainTag = document.createElement('main');
    mainTag.setAttribute('class','page pricing-table-page');

    var sectionTag = document.createElement('section');
    sectionTag.setAttribute('class', 'clean-block clean-pricing dark');

    var zerothDiv = document.createElement('div');
    zerothDiv.setAttribute('class','block-heading');
    zerothDiv.setAttribute('style','eight: 87px;');

    var theTitle = document.createElement('h2');
    theTitle.setAttribute('class','text-left text-info');
    theTitle.setAttribute('style',"margin: -40px 60px; height: 79px; ");

    var strongTitle = document.createElement('strong');
    strongTitle.setAttribute('style','color: rgb(255,193,7);');
    strongTitle.innerHTML = "All Job Listings";

    var titleDesc = document.createElement('p');
    titleDesc.setAttribute('class','text-left');
    titleDesc.setAttribute('style','width: 1100px;height: 50px;margin: 0px 60px;');
    titleDesc.innerHTML = "Details of all the jobs";

    theTitle.appendChild(strongTitle);
    
    zerothDiv.appendChild(theTitle);
    zerothDiv.appendChild(titleDesc);

    sectionTag.appendChild(zerothDiv);



    var div = document.getElementById('insertCardHere');

    
    db.collection("jobListing").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

                
                console.log(`${doc.id} => ${doc.data()}`);
                var firstDiv = document.createElement('div');
                firstDiv.setAttribute('class', 'col');
                firstDiv.setAttribute('style', 'width: 1140px; margin: 0px 25px; height: 260px;');

                var secondDiv = document.createElement('div');
                secondDiv.setAttribute('class', "clean-pricing-item border-warning");
                secondDiv.setAttribute('style','width: 1000px;margin: 0px 60px;');

                var thirdDiv = document.createElement('div');
                thirdDiv.setAttribute('class', 'heading');
                thirdDiv.setAttribute('style','height: 42px;');

                var title = document.createElement('h3');
                title.setAttribute('class','text-left');
                title.setAttribute('style',"height: 3px;");
                title.innerHTML = doc.data().role + ' for ' + doc.data().courseCode;

                thirdDiv.appendChild(title);

                var firstPara = document.createElement('p');
                firstPara.setAttribute('class','text-right d-block float-right');
                firstPara.setAttribute('style','font-size: 13px;');

                var strongOne = document.createElement('strong');
                strongOne.innerHTML = "Due Date: ";

                var dueDate = document.createElement('em');
                dueDate.innerHTML = timeStampConverter(doc.data().expiryDate);

                firstPara.appendChild(strongOne);
                firstPara.appendChild(dueDate);

                var secondPara = document.createElement('p');
                secondPara.setAttribute('class','text-right d-block float-right');
                secondPara.setAttribute('style','font-size: 13px;');

                var strongTwo = document.createElement('em');
                strongTwo.innerHTML = "Lecturer: ";
                var lecturerName = document.createElement('em');

                var jobListingDescription = document.createElement('p');
                jobListingDescription.setAttribute('class','text-left');
                jobListingDescription.setAttribute('style','eight: 65px;width: 731px;');
                jobListingDescription.innerHTML = doc.data().courseDescription;


                var fourthDiv = document.createElement('div');
                fourthDiv.setAttribute('class','tow text-right');

                var fifthDiv = document.createElement('div');
                fifthDiv.setAttribute('class','col');
                fifthDiv.setAttribute('style','width: 1050px;');

                // Edit This 
                var viewOrEditButton = document.createElement('button');
                
                viewOrEditButton.setAttribute('type','button');
                
                
                if(appliedJobs.includes(doc.id)){
                    var hellooo = appliedJobs.includes(doc.id);
                    console.log("HELLLOOOOO" , hellooo);
                    viewOrEditButton.setAttribute('class', 'btn btn-secondary');
                    viewOrEditButton.innerHTML = "Applied"; 
                    
                } else {
                    viewOrEditButton.setAttribute('class', 'btn btn-warning');
                    viewOrEditButton.innerHTML = "Apply";

                    var theLink = 'onClick("' + 'applicantApply.html?' + doc.id + '")';
                    viewOrEditButton.setAttribute("onclick",theLink);
                }
                // End of Edit

                

                fifthDiv.appendChild(viewOrEditButton);
                fourthDiv.appendChild(fifthDiv);

                secondDiv.appendChild(thirdDiv);
                secondDiv.appendChild(firstPara);
                secondDiv.appendChild(jobListingDescription);
                secondDiv.appendChild(fourthDiv);

                firstDiv.appendChild(secondDiv);
                sectionTag.appendChild(firstDiv);
            
        });
    });

    mainTag.appendChild(sectionTag);
    div.appendChild(mainTag);
}
    
     
function onClick(something) {
    //window.alert(something);
    window.location.href=something;
}


function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}


function timeStampConverter(unix_timestamp) {
    console.log(unix_timestamp);
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
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




