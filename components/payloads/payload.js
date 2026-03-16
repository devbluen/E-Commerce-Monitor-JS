
const cache = require("../cache.js");
const func = require("../functions.js");

async function Payloads(payload, name, client, discordInternal) {
    for (const p of payload) {
        if(p.percent >= process.env.PROMOTION_MINIMUM_VALUE && cache.verify(p.link, p.new_price)) {
            await discordInternal.SendPromotion(client, name.toUpperCase(), p);
            cache.save(p.link, p.new_price);
            await func.delay(1500);
        }
    }
}

module.exports = {
    Payloads
}