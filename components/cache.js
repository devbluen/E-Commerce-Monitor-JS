
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'promotions_cache.json');

function verify(link, new_price) {
    try {
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, JSON.stringify({}), 'utf-8');
            return true; 
        }

        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        const cache = JSON.parse(data || '{}');

        return cache[link] !== new_price;
    }
    catch(error) {
        console.error("⚠️ Error reading or creating JSON cache:", error);
        return true; 
    }
}

function save(link, new_price) {
    try {
        let cache = {};

        if (fs.existsSync(FILE_PATH)) {
            const data = fs.readFileSync(FILE_PATH, 'utf-8');
            cache = JSON.parse(data || '{}');
        }

        cache[link] = new_price;
        fs.writeFileSync(FILE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (error) {
        console.error("⚠️ Error saving to JSON cache:", error);
    }
}

module.exports = {
    verify,
    save
}