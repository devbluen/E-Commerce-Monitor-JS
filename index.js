
// Packages
const discord = require('discord.js');
require('dotenv').config();

// Components (without automatic require)
const discordInternal = require('./components/discord.js');
const func = require('./components/functions.js');

// Payloads
const payload = require('./components/payloads/payload.js');
const terabyteshop = require("./components/payloads/terabyte.js");
const kabumshop = require("./components/payloads/kabum.js");

// Variables
const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.MessageContent
    ]
});

async function main() {
    await discordInternal.Create(client, process.env.DISCORD_BOT_TOKEN);

    while(true) {
        
        // Terabyte Promotions
        const productsTera = await terabyteshop.getPromotions();
        await payload.Payloads(productsTera, 'Terabyte', client, discordInternal);

        // Kabum Promotions
        const productsKabum = await kabumshop.getPromotions();
        await payload.Payloads(productsKabum, 'Kabum', client, discordInternal);

        // Others
        console.log(`⏳ Waiting ${process.env.SYSTEM_LOOP} minutes to check the promotions again.`);
        await func.delay(1000 * 60 * process.env.SYSTEM_LOOP);
    }
}

main();