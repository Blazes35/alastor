const { SlashCommandBuilder } = require('discord.js');

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
            console.log(`Duration: ${duration}`);
            await interaction.editReply(`Timing out user ${user.tag} for ${duration/1000} seconds . Reason: ${reason}`);
            await member.timeout(duration); // convert minutes to milliseconds
        } catch (error) {
            console.error(error);
            await interaction.editReply( 'There was an error while trying to time out this user!');
        }
    },
};