const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const dirname = path.basename(__dirname)+' ';

module.exports = {
    category: dirname,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        // await interaction.reply(`Sors avec moi <@628982665512747009>`)
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
    },
};