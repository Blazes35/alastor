module.exports = {
    name: 'source_list',
    description: 'Get the current character usage of DeepL\'s API',
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