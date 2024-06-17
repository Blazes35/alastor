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
const autoEmbedBuilder = require('../../events/autoEmbedBuilder').createInfractionEmbed;
const autoRowBuilder = require('../../events/autoRowBuilder').createComponentRow;

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('reaction-role')
        .setDescription('create a message with reaction roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addRoleOption(option => option
            .setName(`role1`)
            .setDescription(`role1 to give`).setRequired(true))
        .addRoleOption(option => option
            .setName(`role2`)
            .setDescription(`role2 to give`).setRequired(false))
        .addRoleOption(option => option
            .setName(`role3`)
            .setDescription(`role3 to give`).setRequired(false))
        .addRoleOption(option => option
            .setName(`role4`)
            .setDescription(`role4 to give`).setRequired(false))
        .addRoleOption(option => option
            .setName(`role5`)
            .setDescription(`role5 to give`).setRequired(false)),
    async execute(interaction) {
        // const roles = {}
        // roles.add(interaction.options.getRole('role1'));
        // interaction.getRole('role2') == null ? null : roles.add(interaction.options.getRole('role2'));
        // roles.add(interaction.options.getRole('role3'));
        // roles.add(interaction.options.getRole('role4'));
        // roles.add(interaction.options.getRole('role5'));
        const role1 = interaction.options.getRole('role1');
        const role2 = interaction.options.getRole('role2');
        const role3 = interaction.options.getRole('role3');
        const role4 = interaction.options.getRole('role4');
        const role5 = interaction.options.getRole('role5');

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles || PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({content: `You do not have the required permissions to use this command.`,ephemeral: true});
        }

        await interaction.deferReply()

        const row = autoRowBuilder([
            {customId: 'role1', label: role1.name, style: ButtonStyle.Secondary},
            {customId: 'role2', label: role2.name, style: ButtonStyle.Secondary},
            {customId: 'role3', label: role3.name, style: ButtonStyle.Secondary},
            {customId: 'role4', label: role4.name, style: ButtonStyle.Secondary},
            {customId: 'role5', label: role5.name, style: ButtonStyle.Secondary}
        ]);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Reaction Roles')
            .setDescription('Click the buttons below to get the roles')

        await interaction.editReply({content: 'Here are the roles', embeds: [embed], components: [row]});

        const collector = await interaction.channel.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            const member = i.member;

            if (i.guild.members.me.roles.highest.position < role1.position){
                return await i.reply({content: `I do not have the required permissions to give this role`, ephemeral: true});
            } else if (i.guild.members.me.roles.highest.position < role2.position){
                return await i.reply({content: `I do not have the required permissions to give this role`, ephemeral: true});
            } else if (i.guild.members.me.roles.highest.position < role3.position){
                return await i.reply({content: `I do not have the required permissions to give this role`, ephemeral: true});
            } else if (i.guild.members.me.roles.highest.position < role4.position){
                return await i.reply({content: `I do not have the required permissions to give this role`, ephemeral: true});
            } else if (i.guild.members.me.roles.highest.position < role5.position){
                return await i.reply({content: `I do not have the required permissions to give this role`, ephemeral: true});
            }
            if (i.customId === 'role1'){
                member.roles.add(role1);
                i.reply({content: `You have been given the ${role1.name} role`, ephemeral: true});
            } else if (i.customId === 'role2'){
                member.roles.add(role2);
                i.reply({content: `You have been given the ${role2.name} role`, ephemeral: true});
            } else if (i.customId === 'role3'){
                member.roles.add(role3);
                i.reply({content: `You have been given the ${role3.name} role`, ephemeral: true});
            } else if (i.customId === 'role4'){
                member.roles.add(role4);
                i.reply({content: `You have been given the ${role4.name} role`, ephemeral: true});
            } else if (i.customId === 'role5'){
                member.roles.add(role5);
                i.reply({content: `You have been given the ${role5.name} role`, ephemeral: true});
            }
        })
    }
};