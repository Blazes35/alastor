const path = require('path');
const { SlashCommandBuilder } = require('discord.js');
const dirname = path.basename(__dirname)+' ';

module.exports = {
    category: dirname,
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
        await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
    },
};
