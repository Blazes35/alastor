// noinspection JSUnresolvedReference,JSUnusedLocalSymbols
const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField,
    EmbedBuilder,
    default_member_permissions
} = require('discord.js');


const {PermissionFlagsBits} = require('discord-api-types/v10');
const logChannels = require('../../logChannels.json');
const autoEmbedBuilder = require('../../events/autoEmbedBuilder').createInfractionEmbed;
const autoRowBuilder = require('../../events/autoRowBuilder').createComponentRow;

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out a user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to time out.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('duration')
            .setDescription('The duration of the timeout in seconds.')
            .setRequired(true))
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the timeout.')
            .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const {options, guild, user} = interaction;

        const target = await options.getMember('user');
        let durationOption = options.getString('duration').split(' ');
        let reason = options.getString('reason') ?? 'No reason provided';
        let duration = 0;

        for (const time of durationOption) {
            if (/(\d+)[wW]/.test(time)) {
                duration += parseInt(time) * 7 * 24 * 60 * 60;
            } else if (/(\d+)[dD]/.test(time)) {
                duration += parseInt(time) * 24 * 60 * 60;
            } else if (/(\d+)[hH]/.test(time)) {
                duration += parseInt(time) * 60 * 60;
            } else if (/(\d+)[mM]/.test(time)) {
                duration += parseInt(time) * 60;
            } else if (/(\d+)[sS]/.test(time)) {
                duration += parseInt(time);
            } else if (/(\d+)/.test(time) && durationOption.length === 1) {
                duration = parseInt(time);
                durationOption[0] = durationOption[0] + 's';
            } else {
                return interaction.editReply('Invalid duration format.');
            }
        }

        if (duration < 5 || duration > 2.4192e6) return interaction.editReply('Duration must be between 5 seconds and 28 days.');
        if (user.id === target.id) return interaction.editReply("You cannot time out yourself.");
        if (!target.moderatable) return interaction.editReply("I can't time out this member.");

        const senderRoles = interaction.member.roles.cache.map(r => r);
        const targetPerms = target.permissions;

        let higherPerms = new PermissionsBitField();

        for (let role of senderRoles) {
            if (role.rawPosition > target.roles.highest.rawPosition) {
                higherPerms.add(role.permissions);
            }
        }

        // noinspection JSCheckFunctionSignatures
        let embed = autoEmbedBuilder(target, user, 'timeout', guild, durationOption, reason);

        if (user.id !== guild.ownerId) {
            if (!higherPerms.has('ModerateMembers'))
                return interaction.editReply("You do not have permission to time out this user.");
            else if (targetPerms.has('Administrator') && !higherPerms.has('Administrator'))
                return interaction.editReply("You do not have permission to time out this user.");
        }

        const row = autoRowBuilder([
            {customId: 'cancel', label: 'Cancel', style: ButtonStyle.Secondary},
            {customId: 'confirm', label: 'Confirm timeout', style: ButtonStyle.Danger}
        ]);

        const response = await interaction.editReply({
            silent: true,
            content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60_000});

            if (confirmation.customId === 'confirm') {

                duration *= 1000;
                await target.timeout(duration, reason);
                await interaction.editReply({silent: true, embeds: [embed], components: []});


                // Get the log channel and set the embed recap
                const logChannel = interaction.guild.channels.cache.get(logChannels[interaction.guild.id.toString()]);
                logChannel.send({silent: true, embeds: [embed]});

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
                // Send all other types of errors to the console
                console.error(e.message);
            }
        }
    }
};