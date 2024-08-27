const { DeepLToken } = require('../../config.json');
const deepl = require('deepl-node');
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('quota')
        .setDescription('Get the current character usage of DeepL\' API'),
    async execute(interaction) {
        await interaction.deferReply();

        const translator = new deepl.Translator(DeepLToken);
        translator.getUsage().then(usage =>{
            const count = usage.character.count.toLocaleString();
            const limit = usage.character.limit.toLocaleString();
            interaction.editReply(`You have used ${count}/${limit} characters.`);
        });
    },
};
