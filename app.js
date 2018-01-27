const express = require('express')
const fetch = require("node-fetch");

const app = express()

app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});


app.get('/newsquery', (req,res) => {
  let url = 'https://content.guardianapis.com/search?q='

  if (req.query.city) {
    url += req.query.city + '%20AND';
  }
  if (req.query.county) {
    url += req.query.county + '%20AND';
  }
  if (req.query.state) {
    url += req.query.state;
  }

  fetch(url + '&api-key=' + process.env.guardianKey)
    .then(response => response.json())
    .then(response => res.json(response))
    // res.json() is the Express method to send a JSON response
});


app.listen(process.env.PORT, () => console.log('Server now listening'));
