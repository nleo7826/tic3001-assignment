const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.use(express.static('public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

const PORT = 3000;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.render(path.join(__dirname + '/index.html'));
});

app.get('/success', (req, res) => {
  res.send('Hello World Success!');
})

app.listen(PORT, HOST, () => {
  console.log(`Example app listening on port ${PORT}`);
});
