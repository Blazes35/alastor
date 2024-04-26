
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('info-command')
        .setDescription('give informations about a command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get infos.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);
        console.log(command.toString());
        interaction.reply("```js"+command.toString()+"```");
    },
};
