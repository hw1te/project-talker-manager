const crypto = require('crypto');

const token = () => {
  crypto.randomBytes(8).soString('hex');
};

module.expors = token;