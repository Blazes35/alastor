const { DeepLToken } = require('../../config.json');
const deepl = require('deepl-node');
const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translation')
        .setDescription('translation commands')
        .addSubcommand(subCommand => subCommand
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
                .setRequired(false)))
        .addSubcommand(subCommand => subCommand
            .setName('quota')
            .setDescription('Get the current character usage of DeepL\' API'))
        .addSubcommandGroup(subCommandGroup => subCommandGroup
            .setName('languages')
            .setDescription('Get target and source languages')
            .addSubcommand(subCommand => subCommand
                .setName('source_list')
                .setDescription('get a list of all source languages from DeepL'))
            .addSubcommand(subCommand => subCommand
                .setName('target_list')
                .setDescription('get a list of all target languages from DeepL'))),

    async execute(interaction) {
        await interaction.deferReply();
        const translator = new deepl.Translator(DeepLToken);

        const subCommandGroup = interaction.options.getSubcommandGroup();
        const subCommand = interaction.options.getSubcommand();

        if (subCommandGroup === 'languages') {
            let text ="";
            if (subCommand === 'source_list') {
                translator.getTargetLanguages().then(results =>{
                    results.forEach(result => {
                        text += `Language: ${result.name} - Code: ${result.code}.\n`;
                    });
                    interaction.editReply({ephemeral: false, content: text});
                })
            }
            else if (subCommand === 'target_list') {
                translator.getTargetLanguages().then(results =>{
                    results.forEach(result => {
                        text += `Language: ${result.name} - Code: ${result.code} - Formality: ${result.supportsFormality}.\n`;
                    });
                    interaction.editReply({ephemeral: false, content: text});
                })
            }
            else{interaction.editReply({content: 'Invalid subcommand'});}
        }else {
            if (subCommand === 'translate') {
                const text = interaction.options.get('text').value;
                const sourceOption = interaction.options.get('source');
                const source = sourceOption? sourceOption.value : null;
                const target = interaction.options.get('target').value;
                const formalityOption = interaction.options.get('formality');
                let formality = formalityOption ? formalityOption.value : null;

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

                const result = await translator.translateText(text, source, target, formality);
                interaction.editReply({content:'> '+result.text});
            }
            else if (subCommand === 'quota') {
                translator.getUsage().then(usage =>{
                    const count = usage.character.count.toLocaleString();
                    const limit = usage.character.limit.toLocaleString();
                    interaction.editReply(`You have used ${count}/${limit} characters.`);
                });
            }
            else{interaction.editReply({content: 'Invalid subcommand'});}
        }
    }
};