window.addEventListener('load', (event) => {
    console.log('page is fully loaded');

    var element = document.getElementById("loader");
    element.classList.remove("loader");

    document.getElementsByClassName("loading")[0].classList.remove("loading")
});