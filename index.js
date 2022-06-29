const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const readFile = require('./readFile');
const writeFile = require('./writeFile');
const { emailValidation, passwordValidation } = require('./loginValidation');

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

app.post('/login', emailValidation, passwordValidation, (req, res) => {
   const token = crypto.randomBytes(8).toString('hex');

   return res.status(200).json({ token });
});

const ageValidation = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade',
    });
  } 

  return next();
};

const tokenAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  return next();
};

const nameValidation = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  } 
  return next();
};

const rateValidation = (req, res, next) => {
  const { rate } = req.body.talk;

  if (rate < 1 || rate > 5) {
    return res.status(400).json({
        message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
}

  if (!rate) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }

  return next();
};

const talkValidation = (req, res, next) => {
  const { talk } = req.body;

  if (!talk) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório',
    });
  }

  return next();
};

const watchedAtValidation = (req, res, next) => {
  const { watchedAt } = req.body.talk;

  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }

  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  if (!dateRegex.test(watchedAt)) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }

    return next();
};

// Travei na hora de fazer o app.post, consultei o repositório do aluno Alan Souza https://github.com/tryber/sd-019-b-project-talker-manager/pull/134/commits/287ddf543fd7cebd06ef1dccb6240c81701ffe4d
app.post('/talker',
  tokenAuthorization,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  async (req, res) => {
    const { name, age, talk } = req.body;
    
    const user = await readFile();
    const newUser = {
      id: user.length + 1,
      name,
      age,
      talk,
    };
    
    user.push(newUser);
    writeFile(user);
    res.status(201).json(newUser);
  });
  // HTTP PUT https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods/PUT
  app.put('/talker/:id',
    tokenAuthorization,
    nameValidation,
    ageValidation,
    talkValidation,
    watchedAtValidation,
    rateValidation,
    async (req, res) => {
      // req.params --> https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html
      // https://www.geeksforgeeks.org/express-js-req-params-property/
      const { id } = req.params;
      const { name, age, talk } = req.body;
      const talkers = await readFile();
      const newTalker = talkers.map((talker) => {
        if (talker.id === +id) {
          return { 
            id: +id, name, age, talk,
          };
        }
        
        return talker;
      });

      writeFile(newTalker);
      res.status(200).json({ id: +id, name, age, talk });
    });

    app.delete('/talker/:id', tokenAuthorization, async (req, res) => {
      const { id } = req.params;
      // req.params --> https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html
      // https://www.geeksforgeeks.org/express-js-req-params-property/
      try {
        const talkers = await readFile();
        const personId = talkers.filter((person) => person.id !== +id);
        writeFile(personId);
        // https://restfulapi.net/http-status-204-no-content/#:~:text=HTTP%20Status%20204%20(No%20Content)%20indicates%20that%20the%20server%20has,in%20the%20response%20payload%20body.
        // Pensei que era (204).json({})
        return res.status(204).end('');
      } catch (error) {
        res.status(400).json({ message: error });
      }
    });
