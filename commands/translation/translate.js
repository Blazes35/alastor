const fs = require('fs');
const path = require('path');
const deepl = require('deepl-node');
const { DeepLToken } = require('../../config.json');
const { SlashCommandBuilder } = require('discord.js');
const translator = new deepl.Translator(DeepLToken);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translation')
        .setDescription('translation commands'),

    options: [], // Will be populated dynamically below

    async execute(interaction) {
        await interaction.deferReply();

        const subCommandGroup = interaction.options.getSubcommandGroup(false); // Optional
        const subCommand = interaction.options.getSubcommand();

        let subcommandFile;
        if (subCommandGroup) {
            subcommandFile = path.join(__dirname, 'subcommands', subCommandGroup, `${subCommand}.js`);
        } else {
            subcommandFile = path.join(__dirname, 'subcommands', `${subCommand}.js`);
        }

        if (fs.existsSync(subcommandFile)) {
            const subcommand = require(subcommandFile);
            await subcommand.execute(interaction, translator);
        } else {
            await interaction.editReply({ content: 'Invalid subcommand' });
        }
    }
};

// Helper to add specific subcommand options
const addSubcommandOptions = (subcommand, builder) => {
    switch (subcommand.name) {
        case 'translate':
            builder
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
                    .setRequired(false));
            break;

        // Add other subcommand-specific options if needed
        case 'quota':
        case 'source_list':
        case 'target_list':
            break;

        default:
            console.warn(`No options specified for subcommand: ${subcommand.name}`);
    }
};

// Load the subcommands and groups dynamically
const subcommandsPath = path.join(__dirname, 'subcommands');

// Load subcommands and subcommand groups dynamically
fs.readdirSync(subcommandsPath).forEach(file => {
    const filePath = path.join(subcommandsPath, file);

    if (fs.statSync(filePath).isDirectory()) {
        // It's a subcommand group (like 'languages')
        const groupName = file;
        const groupOptions = [];

        fs.readdirSync(filePath).forEach(subcommandFile => {
            if (subcommandFile.endsWith('.js')) {
                const subcommand = require(path.join(filePath, subcommandFile));
                const subcommandBuilder = new SlashCommandBuilder()
                    .setName(subcommand.name)
                    .setDescription(subcommand.description);

                addSubcommandOptions(subcommand, subcommandBuilder); // Add specific options

                groupOptions.push({
                    name: subcommand.name,
                    type: 'SUB_COMMAND',
                    description: subcommand.description,
                });
            }
        });

        // Ensure that the argument passed to setName is a string
        module.exports.data.addSubcommandGroup(group => {
            group.setName(groupName)
                .setDescription(`Group ${groupName} of subcommands`);

            groupOptions.forEach(opt => {
                group.addSubcommand(subcommand => subcommand
                    .setName(String(opt.name)) // Ensure opt.name is a string
                    .setDescription(opt.description)
                );
            });

            return group;
        });
    } else if (file.endsWith('.js')) {
        // It's a standalone subcommand (like 'translate' or 'quota')
        const subCommand = require(filePath);
        const subcommandBuilder = new SlashCommandBuilder()
            .setName(subCommand.name)
            .setDescription(subCommand.description);

        addSubcommandOptions(subCommand, subcommandBuilder); // Add specific options

        module.exports.data.addSubcommand(subcommand => subcommand
            .setName(subCommand.name)
            .setDescription(subCommand.description)
        );
    }
});