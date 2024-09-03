const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const path = require("path");
const dirname = path.basename(__dirname)+' ';

module.exports = {
    category: dirname,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
