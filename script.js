fetch(getRandomStartPointer())
  .then((response) => {
    return response.json();
  })
  .then((jsonObj) => {
    console.log(jsonObj);
    getFilteredAlbum(jsonObj);
  })
  .catch((error) => {
    console.log(error);
  });

//create objects to store & reference information globally:
let albumsGlobal = new Array();

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
  for (let i = 0; i < currentItem.length; i++) {
    let filteredResults = new Array();
    filteredResults.push(new Arrays(currentItem[i].name, currentItem[i].id));
    return filteredResults;
  }
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
  albumsGlobal.pop();
  albumsGlobal.push(
    new Album(albumPosition, album, artists, extraartists, labels, styles, year)
  );
}

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
