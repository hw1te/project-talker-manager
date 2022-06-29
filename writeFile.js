const fs = require('fs/promises');

const writeFile = async (data) => {
  await fs.writeFile('./talker.json', JSON.stringify(data));
};

module.exports = writeFile; 