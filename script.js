//TOKEN:
let personalAccessToken = "QclYwHOWDnQzeGlmzPcvVVjXcjjxQTckcCIoxQOT";

fetch(getRandomStartPointer())
  .then((response) => {
    return response.json();
  })
  .then((jsonObj) => {
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
      displayStartingAlbum(results);
      console.log(albumsGlobal);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Edit the page to display the start album information:

function displayStartingAlbum(album) {
  let albumName = document.getElementById("last-connection-album-title");
  let artistName = document.getElementById("last-connection-artist");
  albumName.innerHTML = album.title;
  artistName.innerHTML = album.artists[0].name;
}

//create objects to store & reference information globally:

let albumsGlobal = [];
let infoGlobal = {
  connectionsMade: 0,
  matches: [null],
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

searchBarAlbumInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    resetSearchResults();
    searchAlbumAndArtist();
    document.getElementById("search-input-album").value = "";
    document.getElementById("search-input-artist").value = "";
  }
});
searchBarArtistInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    resetSearchResults();
    searchAlbumAndArtist();
    document.getElementById("search-input-album").value = "";
    document.getElementById("search-input-artist").value = "";
  }
});

//function for searching:

function searchAlbumAndArtist() {
  let albumValueCheck = searchBarAlbumInput.value; //string literals
  let artistValueCheck = searchBarArtistInput.value;
  if (albumValueCheck == "") {
  } else {
    albumValueCheck = "release_title=" + searchBarAlbumInput.value + "&";
  }
  if (artistValueCheck == "") {
    //!
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
  let parentListItem = document.getElementById("search-results-ul");
  for (i = 0; i < response.results.length; i++) {
    let newListItem = document.createElement("li");
    newListItem.id = "search-result-" + i;
    newListItem.innerHTML = response.results[i].title;
    eventListener(newListItem, response, i);
    parentListItem.appendChild(newListItem);
  }
}

//Call the event listener in a seperate function, this keeps 'i' from throwing errors

function eventListener(element, response, key) {
  element.addEventListener("click", function () {
    getResourceUrl(response, key);
  });
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
          checkForMatches(albumsGlobal[infoGlobal.connectionsMade], tempAlbum); //albumsGlobal.length - 1
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
  let parentListItem = document.getElementById("search-results-ul");
  while (parentListItem.firstChild) {
    parentListItem.removeChild(parentListItem.firstChild);
  }
}

//COMPARISON CODE
//MAIN FUNCTION:

function checkForMatches(currentGlobalAlbum, selectedSearchedAlbum) {
  let aritsts = filterComparisonMissesArrays(
    compareArExLa(currentGlobalAlbum.artists, selectedSearchedAlbum.artists)
  );
  let extraartists = filterComparisonMissesArrays(
    compareArExLa(
      currentGlobalAlbum.extraartists,
      selectedSearchedAlbum.extraartists
    )
  );
  let labels = filterComparisonMissesArrays(
    compareArExLa(currentGlobalAlbum.labels, selectedSearchedAlbum.labels)
  );
  let styles = filterComparisonMissesArrays(
    compareStyles(currentGlobalAlbum.styles, selectedSearchedAlbum.styles)
  );
  let year = compareYears(currentGlobalAlbum.year, selectedSearchedAlbum.year);
  let comparedData = new MatchedItems(
    aritsts,
    extraartists,
    labels,
    styles,
    year
  );
  let returnedMatch = getMatchUsed(comparedData);
  if (returnedMatch == false) {
    alert("No Matches Found!");
    infoGlobal.connectionsMade--;
    console.log(infoGlobal.connectionsMade);
  } else {
    albumsGlobal.push(selectedSearchedAlbum);
    albumsGlobal = filterComparisonMissesArrays(albumsGlobal); //Something is going wrong with albums global, this fixes it, but I should come back to this during debugging
    console.log(albumsGlobal); //delete this
    infoGlobal.matches.push(returnedMatch);
    console.log(infoGlobal.matches); //delete this
  }
}

//The following code is used for comparing the temp album with the current album

function compareArExLa(currentAlbum, searchedAlbum) {
  if (currentAlbum == undefined || searchedAlbum == undefined) {
    return undefined;
  } else {
    let matches = [];
    currentAlbum.forEach((dataItem) => {
      let nestedMatches = compareArrays(dataItem, searchedAlbum);
      matches.push(nestedMatches);
    });
    return matches;
  }
}

//make a function for the compareArExLa .forEach method

function compareArrays(currentAlbumData, searchedAlbumData) {
  for (i = 0; i < searchedAlbumData.length; i++) {
    if (currentAlbumData.id == searchedAlbumData[i].id) {
      let matches = [];
      let match = searchedAlbumData[i];
      matches.push(match);
      return matches;
    } else {
    }
  }
}

//make a function for comparing styles:

function compareStyles(currentAlbum, searchedAlbum) {
  if (currentAlbum == undefined || searchedAlbum == undefined) {
    return undefined;
  } else {
    let matches = [];
    currentAlbum.forEach((currentAlbum) => {
      let nestedData = compareStylesArrays(currentAlbum, searchedAlbum);
      matches.push(nestedData);
    });
    return matches;
  }
}

//make a function for the compareStyles .forEach method:

function compareStylesArrays(currentArray, secondArray) {
  for (i = 0; i < secondArray.length; i++) {
    if (currentArray == secondArray[i]) {
      let matches = [];
      let match = secondArray[i];
      matches.push(match);
      return matches;
    } else {
    }
  }
}

//make a function for comparing years:

function compareYears(currentAlbum, searchedAlbum) {
  if (currentAlbum == searchedAlbum) {
    return currentAlbum;
  } else {
    return undefined;
  }
}

//make a function for filtering out misses

function filterComparisonMissesArrays(targetArray) {
  for (i = 0; i < targetArray.length; i++) {
    if (targetArray[i] == undefined) {
      targetArray.splice(i, 1);
      i = 0;
    }
  }
  return targetArray;
}

//make a constructor for returning the matches

function MatchedItems(artists, extraartists, labels, styles, year) {
  (this.artists = artists),
    (this.extraartists = extraartists),
    (this.labels = labels),
    (this.styles = styles),
    (this.year = year);
}

//Make a function that establishes a hierarchy of matches and returns the first match according to where it ranks in said hierarchy

function getMatchUsed(matchedItemsObject) {
  for (const property in matchedItemsObject) {
    let targetPropertyValue = matchedItemsObject[property];
    if (Array.isArray(targetPropertyValue)) {
      for (i = 0; i < targetPropertyValue.length; i++) {
        if (targetPropertyValue[i] != undefined) {
          return new MatchUsed(property, targetPropertyValue[i]);
        }
      }
    } else {
      if (targetPropertyValue == undefined) {
        return false;
      } else {
        return new MatchUsed(property, targetPropertyValue);
      }
    }
  }
}

function MatchUsed(type, data) {
  (this.type = type), (this.data = data);
}
//Check to see if a connection has been used already, and how many times it's been used:
//I can't really test this until I've debugged the search results error, it's time to do that first

function ifMatchedBlocked(currentMatches, attemptedMatch) {
  currentMatches.forEach((cmData) => {
    let listOfOccurances = ifMatchedBlockedComparison(cmData, attemptedMatch);
    if (listOfOccurances.length >= 3) {
      //block match
    } else {
      //accept match
    }
  });
}
function ifMatchedBlockedComparison(currentMatchesData, attemptedMatchData) {
  let occurances = [];
  if (currentMatchesData.data?.id != undefined) {
    if (currentMatchesData.data.id == attemptedMatchData.data.id) {
      occurances.push(attemptedMatchData.data.id);
    }
  }
  return occurances;
}
