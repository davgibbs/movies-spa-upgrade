'use strict';

var favicon = require('../images/favicon.ico');
require('bootstrap/js/dropdown');
require('bootstrap/dist/css/bootstrap.css');  // import the css. Bootstrap 3
require('./app.js');

var meta = document.createElement('meta');  // Needed for Bootstrap
meta.httpEquiv = "X-UA-Compatible";
meta.content = "IE=edge";
document.head.appendChild(meta);

var metaTwo = document.createElement('meta'); // Needed for Bootstrap
metaTwo.name = "viewport";
metaTwo.content = "width=device-width, initial-scale=1";
document.head.appendChild(metaTwo);

var link = document.createElement('link'); // Add favicon
link.rel = "icon";
link.type = "image/x-icon";
link.href = favicon;
document.head.appendChild(link);

var root = document.createElement("div"); // Create the base layout for the app
root.setAttribute("data-ng-app", "movieApp");
root.setAttribute("class", "container");
root.innerHTML = '<simple-navbar></simple-navbar>' +
                 '<div ui-view></div>' +
                 '<div class="footer">Movie Gallery 2018</div>';
document.body.appendChild(root);
