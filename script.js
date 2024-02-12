//TOKEN:
let personalAccessToken = "QclYwHOWDnQzeGlmzPcvVVjXcjjxQTckcCIoxQOT";

//02/05/2024: Wrapping this in a function & attaching it to the start game button

// fetch(getRandomStartPointer())
//   .then((response) => {
//     return response.json();
//   })
//   .then((jsonObj) => {
//     getMainRelease(jsonObj);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//Code that determines the start point:

//I should make the album pool bigger, but before I do that I should get the app working from one of these two points

function getRandomStartPointer() {
  let pointer = Math.round(Math.random() * (1 - 0) + 0);
  if (pointer == 1) {
    let album = "https://api.discogs.com/masters/8895"; //SWANS
    document.getElementById("album-cover").src =
      "https://i.discogs.com/1kVMCE0M2vRuBUBxpcy5GTHY2cqECn2ur8VGk_jo5JY/rs:fit/g:sm/q:90/h:302/w:340/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMyOTc5/Ny0xMTAzMTEzMDI3/LmpwZw.jpeg";
    return album;
  } else {
    let album = "https://api.discogs.com/masters/3239"; //QOTSA
    document.getElementById("album-cover").src =
      "https://i.discogs.com/RrY6_HSWVQPSyV_Y8Nylk7l8d8Fm-44FHIsZIhdGmgw/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM4NDcx/My0xNTIwMjA4MTk1/LTUwMjEuanBlZw.jpeg";
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
      displayCurrentAlbum(albumsGlobal);
      console.log(albumsGlobal);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Edit the page to display the start album information:

function displayCurrentAlbum() {
  let albumName = document.getElementById("last-connection-album-title");
  let artistName = document.getElementById("last-connection-artist");
  albumName.innerHTML = albumsGlobal[albumsGlobal.length - 1].album;
  artistName.innerHTML = albumsGlobal[albumsGlobal.length - 1].artists[0].name;
  if (albumsGlobal.length > 1) {
    let match = undefined;
    let connectionName = document.getElementById("last-connection");
    let matchType = infoGlobal.matches[albumsGlobal.length - 1].type;
    if (Array.isArray(infoGlobal.matches[albumsGlobal.length - 1].data)) {
      if (
        infoGlobal.matches[albumsGlobal.length - 1].data[0]?.name == undefined
      ) {
        match = infoGlobal.matches[albumsGlobal.length - 1].data[0];
        connectionName.innerHTML = matchType + ": " + match;
      } else {
        match = infoGlobal.matches[albumsGlobal.length - 1].data[0].name;
        connectionName.innerHTML = matchType + ": " + match;
      }
    } else {
      match = infoGlobal.matches[albumsGlobal.length - 1].data;
      connectionName.innerHTML = matchType + ": " + match;
    }
  }
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
  year
) {
  (this.albumPosition = albumPosition),
    (this.album = album),
    (this.artists = artists),
    (this.extraartists = extraartists),
    (this.labels = labels),
    (this.styles = styles),
    (this.year = year);
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
  if (albumsGlobal.length < 1) {
    return 0;
  } else {
    return albumsGlobal.length;
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
        year
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
      year
    );
  }
}

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
  let formats = ["Album", "EP"];
  let currentFormat = "";
  for (i = 0; i < formats.length; i++) {
    currentFormat = "format=" + formats[i] + "&";
    fetch(
      "https://api.discogs.com/database/search?" +
        albumValueCheck +
        artistValueCheck +
        currentFormat +
        "type=master&per_page=20&page=1&token=QclYwHOWDnQzeGlmzPcvVVjXcjjxQTckcCIoxQOT"
    )
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        console.log(results);
        displaySearchResults(results);
      });
  }
}

//Need to put results on the page:

function displaySearchResults(results) {
  let parent = document.getElementById("search-results-ul");
  for (i = 0; i < results.results.length; i++) {
    let formats = results.results[i].format;
    Check: for (j = 0; j < formats.length; j++) {
      if (
        formats[j] == "Single" ||
        formats[j] == "Compilation" ||
        formats[j] == "Unofficial Release"
      ) {
      } else {
        let newResult = document.createElement("li");
        newResult.innerHTML = results.results[i].title;
        newResult.className = "search-result-li";
        newResult.title = results.results[i].title;
        eventListenerWrapper(results, newResult, i);
        parent.appendChild(newResult);
        break Check;
      }
    }
  }
}

function eventListenerWrapper(results, child, key) {
  child.addEventListener("click", function () {
    let coverArt = results.results[key].thumb;
    resetSearchResults();
    fetch(results.results[key].resource_url)
      .then((response) => {
        return response.json();
      })
      .then((results) => {
        fetch(results.main_release_url)
          .then((response) => {
            return response.json();
          })
          .then((results) => {
            let tempAlbum = getFilteredAlbum(results);
            console.log(results);
            console.log(tempAlbum);
            checkForMatches(
              albumsGlobal[albumsGlobal.length - 1],
              tempAlbum,
              coverArt
            );
          })
          .catch((error) => {
            console.log("Search Step 2");
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("Search Step 1: " + error);
      });
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

function checkForMatches(currentGlobalAlbum, selectedSearchedAlbum, coverArt) {
  if (compareAlbumTitles(selectedSearchedAlbum)) {
    alert("This album has been used already!");
  } else {
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
    let year = compareYears(
      currentGlobalAlbum.year,
      selectedSearchedAlbum.year
    );
    let comparedData = new MatchedItems(
      aritsts,
      extraartists,
      labels,
      styles,
      year
    );
    getMatchUsed(
      comparedData,
      infoGlobal.matches,
      selectedSearchedAlbum,
      coverArt
    );
    filterComparisonMissesArrays(albumsGlobal);
    displayCurrentAlbum(selectedSearchedAlbum);
  }
}

//The function for rejecting an album if it's the same as the one being compared against:

function compareAlbumTitles(searchedAlbum) {
  for (i = 0; i < albumsGlobal.length; i++) {
    if (searchedAlbum.album == albumsGlobal[i].album) {
      return true;
    } else {
      return false;
    }
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
  if (currentArray != undefined && secondArray != undefined) {
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
  if (targetArray != undefined) {
    for (i = 0; i < targetArray.length; i++) {
      if (targetArray[i] == undefined) {
        targetArray.splice(i, 1);
        i = 0;
      }
    }
    return targetArray;
  }
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
//need to include the check to see if a match is used more than three times here:
//this is the ugly one this time:

function getMatchUsed(
  matchedItemsObject,
  globalMatches,
  fullAlbumData,
  coverArt
) {
  Loop: for (const property in matchedItemsObject) {
    let targetPropertyValue = matchedItemsObject[property];
    if (Array.isArray(targetPropertyValue)) {
      for (i = 0; i < targetPropertyValue.length; i++) {
        if (targetPropertyValue[i] != undefined) {
          let newMatch = new MatchUsed(property, targetPropertyValue[i]);
          let permission = isMatchBlocked(globalMatches, newMatch);
          console.log(permission); //delete
          if (permission == true) {
            infoGlobal.matches.push(newMatch);
            albumsGlobal.push(fullAlbumData);
            infoGlobal.connectionsMade++;
            displayPastConnections();
            document.getElementById("timer").innerHTML = 30;
            document.getElementById("score-display").innerHTML =
              infoGlobal.connectionsMade;
            document.getElementById("album-cover").src = coverArt;
            break Loop;
          } else {
            alert(
              newMatch.type +
                ": " +
                newMatch.data[0].name +
                " has already been used 3 times!"
            );
            break Loop;
          }
        }
      }
    } else {
      if (targetPropertyValue == undefined) {
        alert("No Matches Found!");
      } else {
        let newMatch = new MatchUsed(property, targetPropertyValue);
        let permission = isMatchBlocked(globalMatches, newMatch);
        console.log(permission); //delete
        if (permission == true) {
          infoGlobal.matches.push(newMatch);
          albumsGlobal.push(fullAlbumData);
          infoGlobal.connectionsMade++;
          displayPastConnections();
          document.getElementById("timer").innerHTML = 30;
          document.getElementById("score-display").innerHTML =
            infoGlobal.connectionsMade;
          break Loop;
        } else {
          alert(
            newMatch.type +
              ": " +
              newMatch.data.name +
              " has already been used 3 times!"
          );
          break Loop;
        }
      }
    }
  }
}

function MatchUsed(type, data) {
  (this.type = type), (this.data = data);
}
//Check to see if a connection has been used already, and how many times it's been used. If used less than 3 times, return true, else return false:

function isMatchBlocked(currentMatches, attemptedMatch) {
  let boolean = undefined;
  let occurances = [];
  for (i = 0; i < currentMatches.length; i++) {
    if (currentMatches[i] != null) {
      switch (attemptedMatch.type) {
        case "artists":
        case "extraartists":
        case "labels":
          if (currentMatches[i].data[0].id == attemptedMatch.data[0].id) {
            occurances.push(attemptedMatch.data[0].id);
            break;
          }
        case "year":
        case "styles":
          if (currentMatches[i].data == attemptedMatch.data) {
            occurances.push(attemptedMatch.data);
            break;
          }
      }
    }
  }
  boolean = strikes(occurances.length);
  occurances = [];
  return boolean;
}

//function for strike system, to be used in isMatchBlocked:

function strikes(numberOfStrikes) {
  let strikeOne = document.getElementById("strike-image-1");
  let strikeTwo = document.getElementById("strike-image-2");
  let strikeThree = document.getElementById("strike-image-3");
  let boolean = undefined;
  switch (numberOfStrikes) {
    case 0:
      strikeOne.style.display = "inline";
      strikeTwo.style.display = "none";
      strikeThree.style.display = "none";
      boolean = true;
      break;
    case 1:
      strikeOne.style.display = "inline";
      strikeTwo.style.display = "inline";
      strikeThree.style.display = "none";
      boolean = true;
      break;
    case 2:
      strikeOne.style.display = "inline";
      strikeTwo.style.display = "inline";
      strikeThree.style.display = "inline";
      boolean = true;
      break;
    case 3:
      strikeOne.style.display = "inline";
      strikeTwo.style.display = "inline";
      strikeThree.style.display = "inline";
      boolean = false;
      break;
  }
  return boolean;
}

//Code pretaining to game start and game end:

//Timer function:

function timerFunctionality() {
  let timer = document.getElementById("timer");
  timer.innerHTML = 30;
  setInterval(function () {
    if (timer.innerHTML == 0) {
      clearInterval(timerFunctionality);
      gameOver();
    } else {
      timer.innerHTML = timer.innerHTML - 1;
    }
  }, 1000);
}

//function for the timer running out:

function gameOver() {
  albumsGlobal = [];
  infoGlobal.connectionsMade = 0;
  infoGlobal.matches = [null];
  document.getElementById("wrapper-hide-on-start").style.display = "none";
  document.getElementById("button-game-start").style.display = "inline";
  document.getElementById("last-connection").innerHTML = "";
  document.getElementById("strike-image-1").style.display = "none";
  document.getElementById("strike-image-2").style.display = "none";
  document.getElementById("strike-image-3").style.display = "none";
  resetSearchResults();
}

//Main game start function via button game start:

document
  .getElementById("button-game-start")
  .addEventListener("click", function () {
    fetch(getRandomStartPointer())
      .then((response) => {
        return response.json();
      })
      .then((jsonObj) => {
        getMainRelease(jsonObj);
        if (document.getElementById("timer").innerHTML == 30) {
          timerFunctionality();
        } else {
          document.getElementById("timer").innerHTML = 30;
        }
        clearPastConnections();
        document.getElementById("wrapper-hide-on-start").style.display = "flex";
        document.getElementById("button-game-start").style.display = "none";
        document.getElementById("score-display").innerHTML = 0;
      })
      .catch((error) => {
        console.log(error);
      });
  });

//Past connections function

function displayPastConnections() {
  let parent = document.getElementById("history-display");
  let newEntry = document.createElement("ul");
  newEntry.innerHTML = albumsGlobal[infoGlobal.connectionsMade].album;
  let entryLink = document.createElement("li");
  entryLink.innerHTML =
    "From " +
    albumsGlobal[infoGlobal.connectionsMade - 1].album +
    " via " +
    infoGlobal.matches[infoGlobal.connectionsMade].type +
    ": " +
    connectionType();
  newEntry.appendChild(entryLink);
  parent.appendChild(newEntry);
}

function connectionType() {
  returnedString = "";
  switch (infoGlobal.matches[infoGlobal.connectionsMade].type) {
    case "artists":
    case "extraartists":
    case "labels":
      returnedString =
        infoGlobal.matches[infoGlobal.connectionsMade].data[0].name;
      break;
    case "styles":
    case "year":
      returnedString = infoGlobal.matches[infoGlobal.connectionsMade].data;
      break;
  }
  return returnedString;
}
//clear past connections on gamer start:

function clearPastConnections() {
  let pastConnections = document.getElementById("history-display");
  if (pastConnections.children.length > 0) {
    while (pastConnections.firstChild) {
      pastConnections.removeChild(pastConnections.firstChild);
    }
  }
}
