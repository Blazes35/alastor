const {SlashCommandBuilder} = require('discord.js');
const path = require("path");
const dirname = path.basename(__dirname)+' ';

module.exports = {
    // cooldown: 300,
    category: dirname,
    data: new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('Replies with Pong!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to bonk.')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const stickerName = 'bonk'; // replace with your sticker name
        const stickers = await interaction.guild.stickers.fetch();
        const sticker = stickers.find(s => s.name === stickerName);
        console.log(sticker);
        if (sticker) {
            await interaction.reply({content: `<@${target.user.id}>`, stickers: [sticker.id]});
        } else {
            console.log('Sticker not found');
        }
    }
};
