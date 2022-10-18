function getArtist() {
  const text = document.getElementById("id");
  document.cookie = `url=${text.value}`;
}
function getData() {
  fetch("http://localhost:8080/testing", {
    method: "POST",
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/json",
    }
  }).catch(err=>{
    console.log("Error -> "+err)
  })
}
