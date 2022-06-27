const express = require('express');
const bodyParser = require('body-parser');
const readFile = require('./readFile');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});


app.get('/talker', async (__req, res) => {
  const response = await readFile();
  if (!response) {
    return res.status(200).json({})
  } else {
    return res.status(200).json(response)
  }
})
