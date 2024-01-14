fetch(getRandomStartPointer())
  .then((response) => {
    return response.json();
  })
  .then((jsonObj) => {
    console.log(jsonObj);
  })
  .catch((error) => {
    console.log(error);
  });

//Code that determines the start point

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
