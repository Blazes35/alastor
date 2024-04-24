// full-reload.js
const { SlashCommandBuilder } = require('discord.js');
const deployCommands = require('../../deploy-commands.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('full-reload')
        .setDescription('Reloads all commands.'),
    async execute(interaction) {
        try {
            await deployCommands();
            await interaction.reply(`All commands were reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading all commands:\n\`${error.message}\``);
        }
    },
};