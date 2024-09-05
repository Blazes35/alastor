module.exports = {
    name: 'target_list',
    description: 'Get the current character usage of DeepL\'s API',
    async execute(interaction, translator) {
        let text ="";
        translator.getTargetLanguages().then(results =>{
            results.forEach(result => {
                text += `Language: ${result.name} - Code: ${result.code} - Formality: ${result.supportsFormality}.\n`;
            });
            interaction.editReply({ephemeral: false, content: text});
        })
    },
};