import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Business Logic

function searchBy(buttonInput) {
  if (buttonInput === 'keyword') {
    const keyword = document.querySelector('#keyword').value;
    const numGifs = document.querySelector('#numGifs').value;
    document.querySelector('#keyword').value = null;
    const url = `http://api.giphy.com/v1/gifs/search?q=${keyword}&limit=${numGifs}&apikey=${process.env.API_KEY}`;
    getGifs(keyword, url);
  } else if (buttonInput === 'Trending') {
    const numGifs = document.querySelector('#numGifs').value;
    const url = `http://api.giphy.com/v1/gifs/trending?&limit=${numGifs}&apikey=${process.env.API_KEY}`;
    getGifs(buttonInput, url);
  }
}

function getGifs(input, url) {
  let request = new XMLHttpRequest();

  request.addEventListener("loadend", function () {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printElements(response, input);
    } else {
      printError(this, response, input);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// UI Logic

function printError(request, apiResponse, input) {
  document.querySelector('#showResponse').innerText = `There was an error accessing the gifs for ${input}: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

function printElements(apiResponse, input) {
  let header = document.getElementById(`searchResults`);
  header.innerText = `${input} Gifs`;

  let numGifs = apiResponse['data'].length;
  let numRows = Math.floor(numGifs / 3);
  let gifResults = document.getElementById(`gifResults`);
  gifResults.innerHTML = null;

  for (let i = 0; i <= numRows; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    row.setAttribute("id", `row${i}`);
    gifResults.append(row);
  }

  for (let i = 0; i < apiResponse['data'].length; i++) {
    let gif = document.createElement("div");
    gif.setAttribute("class", "col-4");
    gif.setAttribute("id", `gif${i}`);

    let img = document.createElement("img");
    img.src = apiResponse['data'][i]["images"]["fixed_height_downsampled"]["url"];
    gif.append(img);

    let rowNum = Math.floor(i / 3);
    let row = document.getElementById(`row${rowNum}`);
    row.append(gif);
  }
}

function handleKeywordSubmission(event) {
  event.preventDefault();
  searchBy('keyword');
}

function handleTrendingSubmission(event) {
  event.preventDefault();
  document.querySelector('#keyword').value = null;
  searchBy('Trending');
}

window.addEventListener("load", function () {
  document.querySelector('form').addEventListener("submit", handleKeywordSubmission);
  document.getElementById('trending').addEventListener("click", handleTrendingSubmission);
});
