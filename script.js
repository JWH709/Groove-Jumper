//TOKEN:
let personalAccessToken = "";

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
    infoGlobal.connectionsMade = infoGlobal.connectionsMade + 1;
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
    searchAlbumAndArtist();
  }
});
searchBarArtistInput.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    searchAlbumAndArtist();
  }
});

//function for searching:

function searchAlbumAndArtist() {
  let albumValueCheck = searchBarAlbumInput.value;
  let artistValueCheck = searchBarArtistInput.value;
  if (albumValueCheck == "") {
  } else {
    albumValueCheck = "title=" + searchBarAlbumInput.value + "&";
  }
  if (artistValueCheck == "") {
  } else {
    artistValueCheck = "artist=" + searchBarArtistInput.value + "&";
  }
  fetch(
    "https://api.discogs.com/database/search?" +
      albumValueCheck +
      artistValueCheck +
      "type=release&format=album&per_page=3&page=1&token=" +
      personalAccessToken
  )
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      console.log(results);
      displaySearchResults(results); //Time to fix this!
    });
}

//Need to put results on the page:

function displaySearchResults(response) {
  for (i = 0; i < response.results.length; i++) {
    let targetResultElement = document.getElementById("search-result" + i);
    targetResultElement.innerHTML = response.results[i].title;
    targetResultElement.style.display = "block";
    let key = i;
    targetResultElement.addEventListener("click", function () {
      let test = key;
      console.log("response.results[" + test + "].resource_url");
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
              console.log(results);
              resetSearchResults();
            });
        });
    });
  }
}

//function for reseting the search results

function resetSearchResults() {
  for (i = 0; i < 3; i++) {
    document.getElementById("search-result" + i).style.display = "none";
  }
}
