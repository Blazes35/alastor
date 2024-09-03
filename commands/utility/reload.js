const {SlashCommandBuilder, ButtonStyle} = require('discord.js');
const logChannels = require("../../logChannels.json");
const {PermissionFlagsBits} = require("discord-api-types/v10");
const path = require("path");
const dirname = path.basename(__dirname)+' ';
const rowBuilder = require('../../events/autoRowBuilder').createComponentRow;


module.exports = {
    category: dirname,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to reload.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        const commandName = interaction.options.getString('command', true).toLowerCase();
        const command = interaction.client.commands.get(commandName);

        await interaction.client.application.fetch();
        if (interaction.user.id !== interaction.client.application.owner.id) {
            return await interaction.editReply({content: `You are not allowed to use this command!`, ephemeral: true});
        }
        if (!command) {
            return interaction.editReply(`There is no command with name \`${commandName}\`!`);
        }

        const row = rowBuilder([
            {customId: 'cancel', label: 'cancel', style: ButtonStyle.Secondary},
            {customId: `confirm`, label: 'confirm reload', style: ButtonStyle.Danger}
        ]);

        const response = await interaction.editReply({
            silent: true,
            content: `Are you sure you want to reload ${command.data.name} ?`,
            components: [row]
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60_000});

            if (confirmation.customId === 'confirm') {

                delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];
                await interaction.client.commands.delete(command.data.name);
                const newCommand = require(`../${command.category}/${command.data.name}.js`);
                await interaction.client.commands.set(newCommand.data.name, newCommand);

                await confirmation.update({
                    content: `Command \`${newCommand.data.name}\` was reloaded!`,
                    components: []
                });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({content: 'Action cancelled', components: []});
            }
        } catch (e) {
            if (e.message === 'Collector received no interactions before ending with reason: time') {
                // Send auto-cancel message if there is a delay error
                await interaction.editReply({
                    content: 'Confirmation not received within 1 minute, cancelling',
                    components: []
                });
            } else {
                console.error(e.message);
                await interaction.editReply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${e.message}\``);
            }
        }
    },
};
