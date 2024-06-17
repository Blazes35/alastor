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
        .addStringOption(option => option
            .setName('message')
            .setDescription('The message to add reaction roles to')
            .setRequired(true))
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

        const message = interaction.options.getString('message') ?? 'Please react to get the role';

        let roles = [];
        roles.push(interaction.options.getRole('role1'));
        if (interaction.options.getRole('role2')!==null) {
            roles.push(interaction.options.getRole('role2'));
        }
        if (interaction.options.getRole('role3')!==null) {
            roles.push(interaction.options.getRole('role3'));
        }
        if (interaction.options.getRole('role4')) {
            roles.push(interaction.options.getRole('role4'));
        }
        if (interaction.options.getRole('role5')) {
            roles.push(interaction.options.getRole('role5'));
        }

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles || PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({content: `You do not have the required permissions to use this command.`,ephemeral: true});
        }

        await interaction.deferReply()

        let components = [];
        for (let i in roles) {
            if (roles[i]) {
                components.push({customId: `role${parseInt(i) + 1}`, label: roles[i].name, style: ButtonStyle.Secondary});
            }
        }

        const row = autoRowBuilder(components);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Reaction Roles')
            .setDescription('Click the buttons below to get the roles')

        await interaction.editReply({content: `${message}`, embeds: [embed], components: [row]});

        const collector = await interaction.channel.createMessageComponentCollector();

        collector.on('collect', async (i) => {
            const member = i.member;

            for (let j = 0; j < roles.length; j++) {
                if (i.guild.members.me.roles.highest.position < roles[j].position) {
                    await i.update({content: `I do not have the required permissions to give ${roles[j].name} `, embeds:[], components: []});
                    return;
                }
                if (i.customId === `role${j+1}`) {
                    if (member.roles.cache.has(roles[j].id)) {
                        member.roles.remove(roles[j]);
                        i.reply({content: `You have been removed from the ${roles[j].name} role`, ephemeral: true});
                        return;
                    }else{
                    member.roles.add(roles[j]);
                    i.reply({content: `You have been given the ${roles[j].name} role`, ephemeral: true});
                    }
                }
            }
            //
            // for (const role in roles) {
            //     if(i.guild.members.me.roles.highest.position < role.position){
            //         return await i.update({content: `I do not have the required permissions to give ${role.name} `, embed: [], components: []});
            //     } if (i.customId === `role`){
            //         member.roles.add(role);
            //         // i.reply({content: `You have been given the ${role.name} role`, ephemeral: true});
            //     }
            // }
        })
    }
};