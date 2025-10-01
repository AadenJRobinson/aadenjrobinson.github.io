/* A script that loads common elements across the site */


fetch("../template/index.html").then(response => {
    return response.text();
}).then(htmlContent => {
    let templateDoc = new DOMParser().parseFromString(htmlContent, "text/html");

    // Apply the footer code into the footer-wrap div
    document.getElementById("footer-wrap").innerHTML = templateDoc.getElementById("footer-wrap").innerHTML;
});