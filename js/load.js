/* A script that loads common elements across the site */


let templateDoc = null;
fetch("../templates/index.html").then(response => {
    return response.text();
}).then(htmlContent => {
    templateDoc = new DOMParser().parseFromString(htmlContent, "text/html");

    // Append the footer
    document.body.appendChild(
        templateDoc.getElementById("footer-wrap")
            .content.cloneNode(true));
});