// noinspection JSCheckFunctionSignatures

const {EmbedBuilder} = require('discord.js');

/**
 * Creates an embed for an infraction event.
 *
 * @param {GuildMember} target - The member who is receiving the infraction.
 * @param {User} applicant - The user who is applying the infraction.
 * @param {string} sanction - The type of infraction being applied.
 * @param {Guild} guild - The guild where the infraction is taking place.
 * @param {string} durationOption - The duration of the infraction.
 * @param {string} reason - The reason for the infraction.
 * @returns {EmbedBuilder} - The embed to be sent in the message.
 */
function createInfractionEmbed(target, applicant, sanction, guild, durationOption, reason) {
    return new EmbedBuilder()
        .setColor('Red')
        .setAuthor({name: target.user.tag, iconURL: target.user.displayAvatarURL()})
        .setThumbnail(target.user.displayAvatarURL())
        .setTitle('New Infraction')
        .setDescription(`Issued by <@${applicant.id}>`)
        .addFields(
            {
                inline: true,
                name: 'Id:',
                value: "`" + target.user.id + "`"
            },
            {
                name: "Type:",
                value: "`"+sanction+"`",
                inline: true
            },
            {
                name: "Guild:",
                value: "`" + guild.name + "`",
                inline: false
            },
            {
                name: "Duration:",
                value: "`" + durationOption + "`",
                inline: true
            },
            {
                name: "Reason:",
                value: "`" + reason + "`",
                inline: true
            }
        );
}

module.exports.createInfractionEmbed = createInfractionEmbed;