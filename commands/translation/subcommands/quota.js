module.exports = {
    name: 'quota',
    description: 'Get the current character usage of DeepL\' API',
    async execute(interaction, translator) {
        translator.getUsage().then(usage =>{
            const count = usage.character.count.toLocaleString();
            const limit = usage.character.limit.toLocaleString();
            interaction.editReply(`You have used ${count}/${limit} characters.`);
        });
    },
};