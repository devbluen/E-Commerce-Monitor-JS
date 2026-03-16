
const discord = require('discord.js');

async function Create(handle, token) {

    try {
        await handle.login(token);
        console.log("🌍 Bot connected", handle.user.tag);
    }
    catch (error) {
        console.log("⚠️ Bot error connect", error);
    }
}

async function SendPromotion(handle, from, payload) {
    // { name, percent, new_price, old_price, image, link } default payload variable ⚠️

    const embed = new discord.EmbedBuilder()
        .setColor("#8a4dd7")
        .setTitle(`PROMOÇÃO ${String(from)}`)
        .setDescription(payload.name)
        .setImage(payload.image)
        .setFooter({ text: "Created by \".bluen\" with \"Samp Lab\"" })
        .setTimestamp()
        .addFields(
            { name: '💰 De:', value: `~~${payload.old_price}~~`, inline: true },
            { name: '🔥 Por:', value: `**${payload.new_price}**`, inline: true },
            { name: '📉 Desconto:', value: `${payload.percent}% OFF`, inline: true }
        );

    const button = new discord.ButtonBuilder()
        .setLabel("Ver na Loja")
        .setURL(payload.link)
        .setStyle(discord.ButtonStyle.Link);

    const row = new discord.ActionRowBuilder().addComponents(button);
    const channel = await handle.channels.cache.get(process.env.DISCORD_ROOM);

    await channel.send({
        content: process.env.DISCORD_MENTION_ROLE
            ? `👀 Nova promoção <@&${process.env.DISCORD_MENTION_ROLE}>`
            : `👀 Nova promoção`,
        embeds: [embed],
        components: [row]
    });
}

module.exports = {
    Create,
    SendPromotion
}