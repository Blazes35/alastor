module.exports = {
    name: 'translate',
    description: 'Translate text to a target language',
    async execute(interaction, translator) {
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
    },
};