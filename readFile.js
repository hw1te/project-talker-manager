const fs = require('fs').promises;

const readFile = async () => {
    const data = await fs('./talker.json', 'utf8');
    return JSON.parse(data);
};

module.exports = readFile; 