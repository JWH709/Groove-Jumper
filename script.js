//TOKEN:
let personalAccessToken = "QclYwHOWDnQzeGlmzPcvVVjXcjjxQTckcCIoxQOT";

fetch(getRandomStartPointer())
  .then((response) => {
    return response.json();
  })
  .then((jsonObj) => {
    console.log(jsonObj);
    getMainRelease(jsonObj);
  })
  .catch((error) => {
    console.log(error);
  });

//Code that determines the start point:

//I should make the album pool bigger, but before I do that I should get the app working from one of these two points

function getRandomStartPointer() {
  let pointer = Math.round(Math.random() * (1 - 0) + 0);
  if (pointer == 1) {
    let album = "https://api.discogs.com/masters/8895"; //SWANS
    return album;
  } else {
    let album = "https://api.discogs.com/masters/3239"; //QOTSA
    return album;
  }
}

function getMainRelease(results) {
  let target = results.main_release_url;
  fetch(target)
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      console.log(results);
      getFilteredAlbum(results);
      console.log(albumsGlobal);
    })
    .catch((error) => {
      console.log(error);
    });
}

//create objects to store & reference information globally:

let albumsGlobal = new Array();
let infoGlobal = {
  connectionsMade: 0,
  matches: null,
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

function FilteredArrays(name, id) {
  (this.name = name), (this.id = id);
}

//Create functions that filter the information need for the constructors:

function indexerFilter(currentItem) {
  let filteredResults = new Array();
  for (let i = 0; i < currentItem.length; i++) {
    filteredResults.push(
      new FilteredArrays(currentItem[i].name, currentItem[i].id)
    );
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

//tracklistartists is getting its own section because A) It's very complicated, B) it's a lot of code:

//The main functionion:

function getTracklistArtists(results) {
  let trackList = results.tracklist;
  let unfilteredResults = new Array();
  for (let i = 0; i < trackList.length; i++) {
    if (trackList[i].extraartists == undefined) {
      unfilteredResults.push("Miss");
    } else {
      for (j = 0; j < trackList[i].extraartists.length; j++) {
        unfilteredResults.push(
          new FilteredArrays(
            trackList[i].extraartists[j].name,
            trackList[i].extraartists[j].id
          )
        );
      }
    }
  }
  let somewhatFilteredResults = unfilteredResults.filter(
    filterTracklistArtists
  );
  return somewhatFilteredResults;
}

//Removes entries labeled as "Miss"/tracklists that had no additional artists on them:

function filterTracklistArtists(unfilteredResults) {
  return unfilteredResults !== "Miss";
}

//Merge tracklistartists with extraartists:

function mergeToContributingArtists(extra, tracklist) {
  let contributingArtists = extra.concat(tracklist);
  return contributingArtists;
}

//After the "Miss" entries are removed, the duplicate aritsts occurances are removed:

function killDuplicateTracklist(somewhatFilteredResults) {
  for (i = 0; i < somewhatFilteredResults.length; i++) {}
}

//Functions that will then use the constructors to build an object:

function getFilteredAlbum(parsedJSON) {
  let albumPosition = getAlbumCount();
  let album = parsedJSON.title;
  let artists = indexerFilter(parsedJSON.artists);
  let extraartists = indexerFilter(parsedJSON.extraartists);
  let tracklistArtists = getTracklistArtists(parsedJSON);
  let contributingArtists = mergeToContributingArtists(
    extraartists,
    tracklistArtists
  );
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
        contributingArtists,
        labels,
        styles,
        year,
        infoGlobal.connectionsMade
      )
    );
  } else {
    return new Album(
      albumPosition,
      album,
      artists,
      contributingArtists,
      labels,
      styles,
      year,
      infoGlobal.connectionsMade
    );
  }
}

//IMPORTANT: DO NOT PUSH TO GITHUB WITH AUTH TOKEN IN YOUR CODE. CHECK WITH SOMEONE BEFORE DOING THIS
//Auth token + dummy search uri can be found in practice. Don't forget it, but don't leave it in when you push
//Leave the token at the top, and delete it when you push

//Search functions for Discogs database:

//Add functionality to the search bar

const searchBarAlbumInput = document.getElementById("search-input-album");
const searchBarArtistInput = document.getElementById("search-input-artist");
console.log(searchBarArtistInput.value);

searchBarAlbumInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    resetSearchResults();
    searchAlbumAndArtist();
  }
});
searchBarArtistInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    resetSearchResults();
    searchAlbumAndArtist();
  }
});

//function for searching:

function searchAlbumAndArtist() {
  let albumValueCheck = searchBarAlbumInput.value;
  let artistValueCheck = searchBarArtistInput.value;
  if (albumValueCheck == "") {
  } else {
    albumValueCheck = "release_title=" + searchBarAlbumInput.value + "&";
  }
  if (artistValueCheck == "") {
  } else {
    artistValueCheck = "artist=" + searchBarArtistInput.value + "&";
  }
  fetch(
    "https://api.discogs.com/database/search?" +
      albumValueCheck +
      artistValueCheck +
      "type=release&per_page=3&page=1&token=" +
      personalAccessToken
  )
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      console.log(results);
      displaySearchResults(results);
      albumValueCheck.value = "";
      artistValueCheck.value = "";
    });
}

//Need to put results on the page:

//BIG PROBLEM: re-searching adds an additional eventListener.

function displaySearchResults(response) {
  for (i = 0; i < response.results.length; i++) {
    let targetResultElement = document.getElementById("search-result" + i);
    targetResultElement.innerHTML = response.results[i].title;
    targetResultElement.style.display = "block";
    let key = i;
    targetResultElement.addEventListener("click", function () {
      getResourceUrl(response, key);
    });
  }
}

//function for getting the resource url:

function getResourceUrl(response, key) {
  fetch(response.results[key].resource_url)
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      fetch(results.resource_url)
        .then((response) => {
          return response.json();
        })
        .then((results) => {
          let tempAlbum = getFilteredAlbum(results);
          console.log(results);
          console.log(tempAlbum);
          checkForMatches(tempAlbum);
          resetSearchResults();
        })
        .catch((error) => {
          console.log("Search Step 2: " + error);
        });
    })
    .catch((error) => {
      console.log("Search Step 1: " + error);
    });
}

//function for reseting the search results

function resetSearchResults() {
  for (i = 0; i < 3; i++) {
    let targetElement = document.getElementById("search-result" + i);
    targetElement.style.display = "none";
    targetElement.removeEventListener("click", function () {
      getResourceUrl();
    });
  }
} //I cannot get remove event listener working rn, I should ask for help with this, and move forward for now

//COMPARISON CODE

function checkForMatches(selectedSearchedAlbum) {
  let albumKey = infoGlobal.connectionsMade;
  let aritsts = compareArExLa(
    albumsGlobal[albumKey].aritsts,
    selectedSearchedAlbum.artists
  );
  let extraartists = compareArExLa(
    albumsGlobal[albumKey].extraartists,
    selectedSearchedAlbum.extraartists
  );
  let labels = compareArExLa(
    albumsGlobal[albumKey].labels,
    selectedSearchedAlbum.labels
  );
  let styles = compareStyles(
    albumsGlobal[albumKey].styles,
    selectedSearchedAlbum.styles
  );
  let year = compareYears(
    albumsGlobal[albumKey].year,
    selectedSearchedAlbum.year
  );
  console.log(aritsts);
  console.log(extraartists);
  console.log(labels);
  console.log(styles);
  console.log(year);
}

//make a constructor for match data:

function MatchedData(artists, extraartists, labels, styles, year) {
  (this.artists = artists),
    (this.extraartists = extraartists),
    (this.labels = labels),
    (this.styles = styles),
    (this.year = year);
}

//The following code is used for comparing the temp album with the current album

function compareArExLa(currentAlbum, searchedAlbum) {
  let matches = [];
  currentAlbum.forEach((dataItem) => {
    let nestedMatches = compareArrays(dataItem, searchedAlbum);
    matches.push(nestedMatches);
  });
  console.log(matches);
}

//make a function for the compareArExLa .forEach method

function compareArrays(currentAlbumData, searchedAlbumData) {
  let matches = [];
  for (i = 0; i < searchedAlbumData.length; i++) {
    if (currentAlbumData.id == searchedAlbumData[i].id) {
      let match = searchedAlbumData[i];
      matches.push(match);
    } else {
    }
  }
  return matches;
}

//make a function for comparing styles:

function compareStyles(currentAlbum, searchedAlbum) {
  let matches = [];
  currentAlbum.forEach((currentAlbum) => {
    let nestedData = compareStylesArrays(currentAlbum, searchedAlbum);
    matches.push(nestedData);
  });
  return matches;
}

//make a function for the compareStyles .forEach method:

function compareStylesArrays(currentArray, secondArray) {
  let matches = new Array();
  for (i = 0; i < secondArray.length; i++) {
    if (currentArray == secondArray[i]) {
      let match = secondArray[i];
      matches.push(match);
    } else {
    }
  }
  return matches;
}

//make a function for comparing years:

function compareYears(currentAlbum, searchedAlbum) {
  if (currentAlbum == searchedAlbum) {
    return currentAlbum;
  } else {
    return undefined;
  }
}
