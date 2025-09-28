/* A script that loads common elements across the site */


fetch("../template/index.html").then(response => {
    return response.text();
}).then(htmlContent => {
    let templateDoc = new DOMParser().parseFromString(htmlContent, "text/html");

    // Append the footer
    document.body.appendChild(
        templateDoc.getElementById("footer-wrap")
            .content.cloneNode(true));
});