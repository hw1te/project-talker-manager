const readFile = require('fs').promises;

const readFile = async () => {
    const data = await readFile('./talker.json', 'utf8');
    return JSON.parse(data);
};

module.exports = readFile; 