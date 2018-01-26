const express = require('express')
const app = express()

app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});


app.listen(process.env.PORT, () => console.log('Server listening on port 3000'));
