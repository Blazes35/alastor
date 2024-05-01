const {SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder} = require('discord.js');
const logChannels = require('../../logChannels.json');

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
        .addIntegerOption(option => option
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
        const duration = options.getInteger('duration') * 1000;
        let reason = options.getString('reason') ?? 'No reason provided';

        if (user.id === target.id) return interaction.editReply("You cannot time out yourself.");
        if (!target.moderatable) return interaction.editReply("I can't time out this member.");
        if (duration < 5 || duration > 2.419e9) return interaction.editReply('Duration must be between 5 seconds and 28 days.');

        const senderRoles = interaction.member.roles.cache.map(r => r);
        const targetPerms = target.permissions;

        let higherPerms = new PermissionsBitField();

        for (let role of senderRoles) {
            if (role.rawPosition > target.roles.highest.rawPosition) {
                higherPerms.add(role.permissions);
            }
        }

        if (user.id !== guild.ownerId) {
            if (!higherPerms.has('ModerateMembers'))
                return interaction.editReply("You do not have permission to time out this user.");
            else if (targetPerms.has('Administrator') && !higherPerms.has('Administrator'))
                return interaction.editReply("You do not have permission to time out this user.");
        }

        let embed = new EmbedBuilder()
            .setColor('ff0000')
            .setAuthor({name: target.user.tag, iconURL: target.user.displayAvatarURL()})
            .setTitle('New Infraction')
            .setDescription(`Issued by ${user.tag}`)
            .addFields(
                {
                    inline: true,
                    name: 'Id:',
                    value: "`" + target.user.id + "`"
                },
                {
                    name: "Type:",
                    value: "`Timeout`",
                    inline: true
                },
                {
                    name: "Guild:",
                    value: "`" + guild.name + "`",
                    inline: false
                },
                {
                    name: "Duration:",
                    value: "`" + duration + "`",
                    inline: true
                },
                {
                    name: "Reason:",
                    value: "`" + reason + "`",
                    inline: true
                }
            );




        try{
            await target.timeout(duration, reason);
            await interaction.editReply({embeds: [embed]});
            // Get the log channel
            const logChannel = interaction.guild.channels.cache.get(logChannels[interaction.guild.id.toString()]);
            logChannel.send({embeds:[embed]});
        }catch (error) {
            console.error(error);
            await interaction.editReply('There was an error while trying to time out this user!');
        }
    }
};