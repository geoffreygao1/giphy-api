import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function getGifs(keyword) {
  let request = new XMLHttpRequest();
  const url = `http://api.giphy.com/v1/gifs/search?q=${keyword}&limit=3&apikey=${process.env.API_KEY}`;

  request.addEventListener("loadend", function () {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, keyword);
    } else {
      printError(this, response, keyword);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// UI Logic

function printError(request, apiResponse, keyword) {
}

function printElements(apiResponse, keyword) {
  let header = document.getElementById(`searchResults`);
  header.innerText = `${keyword} Gifs`;
  for (let i = 0; i < apiResponse['data'].length; i++) {
    let div = document.getElementById(`gif${i}`);
    div.innerHTML = "";
    let img = document.createElement("img");
    img.src = apiResponse['data'][i]["images"]["fixed_height_downsampled"]["url"];
    div.append(img);
  }
}

function handleKeywordSubmission(event) {
  event.preventDefault();
  const keyword = document.querySelector('#keyword').value;
  document.querySelector('#keyword').value = null;
  getGifs(keyword);
}
function handleTrendingSubmission(event) {
  document.querySelector('#keyword').value = null;
}
function handleRandomSubmission(event) {
  document.querySelector('#keyword').value = null;
}

window.addEventListener("load", function () {
  document.querySelector('form').addEventListener("submit", handleKeywordSubmission);
  document.getElementById('trending').addEventListener("click", handleTrendingSubmission);
  document.getElementById('random').addEventListener("click", handleRandomSubmission);
});
