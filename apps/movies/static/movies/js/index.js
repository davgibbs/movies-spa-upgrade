require('./app.js');

const root = document.createElement("div")
root.innerHTML = '<div class="container" data-ng-app="movieApp"><simple-navbar></simple-navbar><div ui-view></div><div class="footer"><p>Movie Gallery 2018</p></div></div>'
document.body.appendChild(root)


