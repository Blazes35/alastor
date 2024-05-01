
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('miku')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply({content:'<@575683317010137089> tu es MA salope',
            files: [{
                attachment: 'require/Miku.png',
                name: 'Miku.png',
                description: 'Miku claimed by Alastor'
            }]
        })
            // .then(console.log)
            .catch(console.error);
    },
};
