// full-reload.js
const { SlashCommandBuilder } = require('discord.js');
const deployCommands = require('../../deploy-commands.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('full-reload')
        .setDescription('Reloads all commands.'),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        await interaction.client.application.fetch();
        if (interaction.user.id !== interaction.client.application.owner.id) {
            return await interaction.editReply({content:`You are not allowed to use this command!`, ephemeral: true});
        }

        try {
            await deployCommands();
            await interaction.editReply({content:`All commands were reloaded!`, ephemeral: true});
        } catch (error) {
            console.error(error);
            await interaction.editReply()({content:`There was an error while reloading all commands:\n\`${error.message}\``,ephemeral:true});
        }
    },
};