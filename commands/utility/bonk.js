const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    cooldown: 300,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('Replies with Pong!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to bonk.')
                .setRequired(true)),
    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const emoji = interaction.client.emojis.cache.find(e => e.name === 'bonk');
        if (emoji) {
            await interaction.reply({content: `<@${target.user.id}> ${emoji}`});
        } else {
            console.log('Emoji not found');
        }
    }
};
