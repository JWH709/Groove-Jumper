fetch(getRandomStartPointer())
  .then((response) => {
    return response.json();
  })
  .then((jsonObj) => {
    console.log(jsonObj);
    getFilteredAlbum(jsonObj);
    console.log(albumsGlobal);
  })
  .catch((error) => {
    console.log(error);
  });

//Code that determines the start point:

//I should make the album pool bigger, but before I do that I should get the app working from one of these two points

function getRandomStartPointer() {
  let pointer = Math.round(Math.random() * (1 - 0) + 0);
  if (pointer == 1) {
    let album = "https://api.discogs.com/releases/329797"; //SWANS
    return album;
  } else {
    let album = "https://api.discogs.com/releases/378017"; //QOTSA
    return album;
  }
}

//create objects to store & reference information globally:

let albumsGlobal = new Array();
let infoGlobal = {
  connectionsMade: 0,
};

//Create consturctors:

function Album(
  albumPosition,
  album,
  artists,
  extraartists,
  labels,
  styles,
  year,
  connectionNumber
) {
  (this.albumPosition = albumPosition),
    (this.album = album),
    (this.artists = artists),
    (this.extraartists = extraartists),
    (this.labels = labels),
    (this.styles = styles),
    (this.year = year),
    (this.connectionNumber = connectionNumber);
}

function Arrays(name, id) {
  (this.name = name), (this.id = id);
}

//Create functions that filter the information need for the constructors:

function indexerFilter(currentItem) {
  let filteredResults = new Array();
  for (let i = 0; i < currentItem.length; i++) {
    filteredResults.push(new Arrays(currentItem[i].name, currentItem[i].id));
  }
  return filteredResults;
}
function getAlbumCount() {
  if (albumsGlobal == undefined) {
    return 0;
  } else {
    return albumsGlobal.length++;
  }
}

//Functions that will then use the constructors to build an object:

function getFilteredAlbum(parsedJSON) {
  let albumPosition = getAlbumCount();
  let album = parsedJSON.title;
  let artists = indexerFilter(parsedJSON.artists);
  let extraartists = indexerFilter(parsedJSON.extraartists);
  let labels = indexerFilter(parsedJSON.labels);
  let styles = parsedJSON.styles;
  let year = parsedJSON.year;
  if (albumsGlobal[0] == undefined) {
    albumsGlobal.pop();
    albumsGlobal.push(
      new Album(
        albumPosition,
        album,
        artists,
        extraartists,
        labels,
        styles,
        year,
        infoGlobal.connectionsMade
      )
    );
  } else {
    infoGlobal.connectionsMade = infoGlobal.connectionsMade + 1;
    albumsGlobal.push(
      new Album(
        albumPosition,
        album,
        artists,
        extraartists,
        labels,
        styles,
        year,
        infoGlobal.connectionsMade
      )
    );
  }
}

//IMPORTANT: DO NOT PUSH TO GITHUB WITH AUTH TOKEN IN YOUR CODE. CHECK WITH SOMEONE BEFORE DOING THIS
//Auth token + dummy search uri can be found in practice. Don't forget it, but don't leave it in when you push

//Search functions for Discogs database:

//Add functionality to the search bar

const searchBarInput = document.getElementById("search-input-box");

searchBarInput.addEventListener("submit", function () {
  fetch(
    "https://api.discogs.com/database/search?release_title=" +
      searchBarInput.innerHTML +
      authToken
  )
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      findOldestRelease(results);
      console.log(results);
    }); //remember to add catch stuff
});

//Build a constructor for comparing the data of a search result

function YearComparisonObjects(year, resource_url) {
  this.year = year;
  this.resource_url = resource_url;
}

// Write a function that gets the year value for all of the objects, compares them all, finds the youngest, and fetches its resource url

function findOldestRelease(data) {
  const numberOfResults = data.results.length;
  let filteredResults = new Array();
  for (i = 0; i < numberOfResults; i++) {
    filteredResults.push(
      new YearComparisonObjects(
        data.results[i].year,
        data.results[i].resource_url
      )
    );
  }
  let lowestYearOfRelease = undefined;
  switch (true) {
    case filteredResults[0].year < filteredResults[1].year &&
      filteredResults[0].year < filteredResults[2].year:
      lowestYearOfRelease = 0;
      break;
    case filteredResults[1].year < filteredResults[0].year &&
      filteredResults[1].year < filteredResults[2].year:
      lowestYearOfRelease = 1;
      break;
    default:
      lowestYearOfRelease = 2;
  }
  fetch(filteredResults[lowestYearOfRelease].resource_url)
    .then((response) => {
      return response.json();
    })
    .then((searchResults) => {
      console.log(searchResults);
      moveToTempInfo(searchResults);
    });
}

//Write code to compare a searched album to the starting album

//Create an object that will take in temporary information:

let temporaryAlbumInfo = {
  album: undefined,
  artists: undefined,
  extraartists: undefined,
  labels: undefined,
  styles: undefined,
  year: undefined,
};

//create a function called once an album is chosen to update the temp values in temporaryAlbumInfo:

function moveToTempInfo(info) {
  temporaryAlbumInfo.album = info.title;
  temporaryAlbumInfo.artists = info.artists;
  temporaryAlbumInfo.extraartists = info.extraartists;
  temporaryAlbumInfo.labels = info.labels;
  temporaryAlbumInfo.styles = info.styles;
  temporaryAlbumInfo.year = info.year;
  console.log(temporaryAlbumInfo); // this is where I should add a result box underneath the search
}

//Create a function to compare the data of temporary album info
