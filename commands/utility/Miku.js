
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('Miku'),
        // .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply("<@575683317010137089> t'es LA salope");
    },
};
