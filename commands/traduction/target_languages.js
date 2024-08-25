const { DeepLToken } = require('../../config.json');
const deepl = require('deepl-node');
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('target_languages')
        .setDescription('Get the current character usage of DeepL\'s API'),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        let text ="";
        const translator = new deepl.Translator(DeepLToken);
        translator.getTargetLanguages().then(results =>{
            results.forEach(result => {
                text += `Language: ${result.name} - Code: ${result.code} - Formality: ${result.supportsFormality}.\n`;
            });
            console.log(text);
            interaction.editReply({ephemeral: false, content: text});
        })
    },
};