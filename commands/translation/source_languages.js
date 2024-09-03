// const { DeepLToken } = require('../../config.json');
// const deepl = require('deepl-node');
// const {SlashCommandBuilder} = require("discord.js");
// const path = require("path");
// const dirname = path.basename(__dirname)+' ';
//
// module.exports = {
//     category: dirname,
//     data: new SlashCommandBuilder()
//         .setName('source_languages')
//         .setDescription('Get the current character usage of DeepL\'s API'),
//     async execute(interaction) {
//         await interaction.deferReply({ephemeral: true});
//         const translator = new deepl.Translator(DeepLToken);
//
//         let text ="";
//         translator.getTargetLanguages().then(results =>{
//             results.forEach(result => {
//                 text += `Language: ${result.name} - Code: ${result.code}.\n`;
//             });
//             interaction.editReply({ephemeral: false, content: text});
//         })
//     },
// };