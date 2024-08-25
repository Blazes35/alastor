const { DeepLToken } = require('../../config.json');
const deepl = require('deepl-node');
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Get the current character usage of DeepL\' API')
        .addStringOption(option => option
                .setName('text')
                .setDescription('The text to translate.')
                .setRequired(true))
        .addStringOption(option => option
                .setName('target')
                .setDescription('The target language.')
                .setRequired(true))
        .addStringOption(option => option
            .setName('source')
            .setDescription('The source language.')
            .setRequired(false))
        .addStringOption(option => option
            .setName('formality')
            .setDescription('Choose the formality of the translation (formal/informal).')
            .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const text = interaction.options.get('text')
        const source = interaction.options.get('source')??null
        const target = interaction.options.get('target')
        let formality = interaction.options.get('formality')

        switch (formality) {
            case 'formal':
                formality = { formality: 'more',};
                break;
            case 'informal':
                formality = { formality: 'less',};
                break;
            default:
                formality = {}
        }

        const translator = new deepl.Translator(DeepLToken);
        const result = await translator.translateText(text, source, target, formality);
        console.log(result.text); // Bonjour, le monde !
        interaction.editReply({ephemeral: false, content: result.text});
    },
};
