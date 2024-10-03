module.exports = {
    name: 'source_list',
    description: 'Get a list of all source languages from DeepL',
    async execute(interaction, translator) {
        let text ="";
        translator.getTargetLanguages().then(results =>{
            results.forEach(result => {
                text += `Language: ${result.name} - Code: ${result.code}.\n`;
            });
            interaction.editReply({ephemeral: false, content: text});
        })
    },
};