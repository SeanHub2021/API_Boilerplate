const API_KEY = "mXPQTtU0Ion3-mkVh8u0cOwld1Y";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e)); //get the "submit" element from the html,

//in order to change the options from returning as seperate values, we want them as a comma listed, so must process them first
function processOptions(form) { //this function takes the form data, so we pass it into the function
    
    let optArray = []; //temporary array, so create an empty array
    //'for' declares a loop, 'let' declares a variable to be named 'entry' here, "form.entries" form is an item and .entries is a method-call
    for (let entry of form.entries()) {  //so we're iterating over the "form" object, each iteration is called "entry"
        if (entry[0] === "options") { //if the first entry matches the string "options"...
            optArray.push(entry[1]);//then we push the second value into our optArray
        }
    }
    form.delete("options");//deletes all occurrences of "options" in our form data
    form.append("options",optArray.join());//we'll now append our new options (optArray) using the join method, which by default provides strings as comma seperated
    return form;
}


//The Post function
async function postForm(e) { //function activates upon "e" (the event, from the event listener)?
    const form = processOptions(new FormData(document.getElementById("checksform"))); //new const named "form", check the form element from html "checksform" [processOptions; after creating, we want the processed options data passed into this function]

    //for (let entry of form.entries()) {
    //    console.log(entry); //use this to check in the console if the front end form is working, then replace to send to the API
    //}
    
    //then, we paste the "post" instructions from the Usage Instructions
    const response = await fetch(API_URL, { //we add the 'await', and change the url to the Const for the URL
        method: "POST",
        headers: {
                    "Authorization": API_KEY,
                 },
                 body: form, //using the const "form" from earlier, we then send the form info to the API. We know the form content matches the API documentations fields, from when we console.log'd in the previous function
        })
    
    const data = await response.json(); //create the new constant "data", await response(from the fetch statement earlier) and parse it as json first before adding to "data"
    
    if (response.ok) { //check if the response is ok (http status code 200) ["ok" is code to check this]
        //console.log(data); //if okay, log the data to console.
        displayErrors(data); //now that is confirmed as working, create function displayErrors [below], and pass it data
    }   else {
        displayException(data); //function to display the error to users, (added whilst writing the function down below)    
        throw new Error(data.error); //if not, "throw" an error message with the error from the api
    }
}
        

//DISPLAY the ERRORS
function displayErrors(data) { 
    
    let heading = `JSHint Results for ${data.file}`; //set the heading of the error message, insert the 'file' property from the 'data' object

    if (data.total_errors ===0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span>`;
        for (let error of data.error_list) { //iterate through each of the errors
            results += `<div>At line <span class="line">${error.line}</span></div>`;//report the line number
            results += `column <span class="column">${error.col}</span></div>`;//report the column number, with JShint does
            results += `<div class="error>${error.error}</div>`;//the error text thats coming back from the JSON
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading; // Update the title of the results modal element (from the HTML)
    document.getElementById("results-content").innerHTML = results; // Fill the content of the results modal element (from the HTML) with the message

    resultsModal.show(); // Display the results modal element (from the HTML) on the screen
}


//The getStatus function
//1. Make a GET request to the API URL with the API key
//2. Pass the data to a function that will display it.
//We could also chain .then's as a syncronous function, or we could wrap the promises in an async function, and then await the promise coming true!

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`; //we supply our API key as a parameter, and in the format requested in the API_URL documentation

    const response = await fetch(queryString); //we fetch the query string and then await the response

    const data = await response.json(); //when the response comes back, we convert it to json

    if (response.ok) { //if the okay signal of 200 is returned, the response property = true, so we can use response.ok to check if the response was okay
        //console.log(data.expiry) // and then print the response!
        displayStatus(data);
    } else {
        displayException(data); //function to display the error to users, (added whilst writing the function down below)
        throw new Error(data.error); //in the api documentation there is an error message for "error", here if the signal of "okay" is not returned, we return the data for "error"
    }
}

function displayStatus(data) {

    let heading = "API Key Status"; // Define a title for the results modal element (from the HTML)
    let results = `<div>Your key is valid until<div>`; // Create a message about the key's validity
    results += `<div class="key-status">${data.expiry}</div>`; // append the previous "results" variable with a new HTML <div> element with the class "key-status" and the value of data.expiry

    document.getElementById("resultsModalTitle").innerText = heading; // Update the title of the results modal element (from the HTML)
    document.getElementById("results-content").innerHTML = results; // Fill the content of the results modal element (from the HTML) with the message

    resultsModal.show(); // Display the results modal element (from the HTML) on the screen
}

function displayException(data) {
    let heading = `An Exception Occurred`;

    results = `<div>The API returned status code ${data.status_code}</div`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}