// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function(){
    console.log("Hello, webpage!")
});

function getContact(){
    console.log("click button - contact me")
    document.getElementById('ShowContact').style.display = "block"
}

function notAvailable(){
    console.log("not available now. Coming soon.")
}