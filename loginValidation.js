const emailRegex = /^[\w-/.]+@([\w-]+\.)+[\w-]{2,4}$/g;

function emailValidation(email) {
  if (!email) {
    return { code: 400, error: 'O campo "email" é obrigatório' };
  }
  if (!emailRegex.test(email)) {
    return { code: 400, error: 'O "email" deve ter o formato "email@email.com"' };
  }
  return true;
}

function passwordValidation(password) {
  if (!password) {
    return { code: 400, error: 'O campo "password" é obrigatório' };
  }
  if (password.length < 6) {
    return { code: 400, error: 'O "password" deve ter pelo menos 6 caracteres' };
  }
  return true;
}

module.exports = { emailValidation, passwordValidation }; 