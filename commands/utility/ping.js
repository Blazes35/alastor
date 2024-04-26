
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    //cooldowns:5,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
