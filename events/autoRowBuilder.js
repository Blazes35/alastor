const {ActionRowBuilder, ButtonBuilder} = require('discord.js');
// const autoButtonBuilder = require('./autoButtonBuilder').createComponentButton;

function createComponentButton(customId, label, style) {
    const button = new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(style);

    return button;
}

function createComponentRow(buttonDataArray) {
    const row = new ActionRowBuilder();

    for (const buttonData of buttonDataArray) {
        const {customId, label, style} = buttonData;
        const button = createComponentButton(customId, label, style);
        row.addComponents(button);
    }

    return row;
}

module.exports.createComponentRow = createComponentRow;