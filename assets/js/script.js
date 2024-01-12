const API_KEY = "mXPQTtU0Ion3-mkVh8u0cOwld1Y";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));

//The getStatus function
//1. Make a GET request to the API URL with the API key
//2. Pass the data to a function that will display it.
//We could also chain .then's as a syncronous function, or we could wrap the promises in an async function, and then await the promise coming true!

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`; //we supply our API key as a parameter, and in the format requested in the API_URL documentation

    const response = await fetch(queryString); //we fetch the query string and then await the response

    const data = await response.json(); //when the response comes back, we convert it to json

    if (response.ok) { //if the okay signal of 200 is returned, the response property = true, so we can use response.ok to check if the response was okay
        console.log(data.expiry) // and then print the response!
    }
}