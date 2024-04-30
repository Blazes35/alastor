const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info-command')
        .setDescription('Provides information about a specific command.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to get information about.')
                .setRequired(true)),
    async execute(interaction) {
        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        if (!command) {
            return interaction.reply(`There is no command with name \`${commandName}\`!`);
        }

        let reply = `**Command:** ${command.data.name}\n**Description:** ${command.data.description}`;

        if (command.data.options) {
            reply += '\n**Options:**\n';
            for (const option of command.data.options) {
                reply += `- ${option.name}: ${option.description} (required: ${option.required})\n`;
            }
        }

        await interaction.reply(reply);
    },
};