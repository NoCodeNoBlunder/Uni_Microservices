const express = require('express');
const path = require('path');

// Create a server via express rather than ng now.
const server = express();

// built in middleware to serve static content just as images, css, html etc
server.use(express.static(path.join(__dirname, 'dist', 'micro-shop-frontend')));

// all get requests will point to angular's index.html in dist folder
server.get('/*', async (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'micro-shop-frontend', 'index.html'));
});

const port = process.env.PORT || 4400;
server.listen(port, () => console.log('Shop frontend Running on port ' + port));
