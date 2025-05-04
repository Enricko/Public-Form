function loadPage(page) {
    fetch(`pages/${page}.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById("page-content").innerHTML = data;
      })
      .catch(error => console.error("Error loading page:", error));
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    loadPage("home"); // Load the home page by default
  });
  