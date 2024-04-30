const { SlashCommandBuilder } = require('discord.js');
const logChannels = require('../../logChannels.json');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to time out.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the timeout in seconds.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout.')
                .setRequired(true)),
    // .setDefaultMemberPermissions(false),
    async execute(interaction) {
        await  interaction.deferReply({});
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration')*1000;
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.editReply('User is not in this server.');
        }
        if (duration<5 || duration>2.419e9) {
            return interaction.editReply('Duration is too long. Maximum is 28 days.');
        }
        try {
            await interaction.editReply("Done :white_check_mark: ");
            await member.timeout(duration); // convert minutes to milliseconds

            // Get the log channel
            const logChannel = interaction.guild.channels.cache.get(logChannels[interaction.guild.id.toString()]);
            // Send a message to the log channel
            logChannel.send(`User ${user.tag} has been timed out for ${duration/1000} seconds. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply( 'There was an error while trying to time out this user!');
        }
    },
};