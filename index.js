const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
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
   return res.status(200).json({});
  } 

  return res.status(200).json(response);
});

// Uso de array.find https://www.w3schools.com/jsref/jsref_find.asp
// Uso de Number() https://www.w3schools.com/jsref/jsref_number.asp

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const response = await readFile();

  const talkers = response.find((talker) => talker.id === Number(id));

  if (!talkers) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(talkers);
});

app.post('/login', (req, res) => {
   const token = crypto.randomBytes(8).toString('hex');
   return res.status(200).json({ token });
});
