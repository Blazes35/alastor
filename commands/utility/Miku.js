
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('miku')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('<@575683317010137089> tu es LA salope');
    },
};
