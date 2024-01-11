fetch("./albums.json")
  .then((response) => response.json())
  .then((json) => console.log(json));
