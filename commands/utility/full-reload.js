// full-reload.js
const { SlashCommandBuilder, ButtonStyle} = require('discord.js');
const deployCommands = require('../../deploy-commands.js');
const {PermissionFlagsBits} = require("discord-api-types/v10");
const {createComponentRow: rowBuilder} = require("../../events/autoRowBuilder");

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('full-reload')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Reloads all commands.'),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        await interaction.client.application.fetch();
        if (interaction.user.id !== interaction.client.application.owner.id) {
            return await interaction.editReply({content:`You are not allowed to use this command!`, ephemeral: true});
        }

        const row = rowBuilder([
            {customId: 'cancel', label: 'cancel', style: ButtonStyle.Secondary},
            {customId: `confirm`, label: 'confirm full reload', style: ButtonStyle.Danger}
        ]);

        const response = await interaction.editReply({
            silent: true,
            content: `Are you sure you want to reload all commands ?`,
            components: [row]
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {

            const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60_000});

            if (confirmation.customId === 'confirm') {

                await deployCommands();

                await confirmation.update({
                    content: `All commands were reloaded!`,
                    components: []
                });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({content: 'Action cancelled', components: []});
            }
        } catch (e) {
            if (e.message === 'Collector received no interactions before ending with reason: time'){
                // Send auto-cancel message if there is a delay error
                await interaction.editReply({
                    content: 'Confirmation not received within 1 minute, cancelling',
                    components: []
                });
            }else{
                console.error(e);
                await interaction.editReply()({content:`There was an error while reloading all commands:\n\`${e.message}\``,ephemeral:true});
            }
        }
    },
};