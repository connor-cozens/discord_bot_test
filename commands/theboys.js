const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('theboys')
		.setDescription('Checks on the boys...')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Which boy to check in on...')
                .setRequired(true)
                .addChoice('DM', 'Caelan')
                .addChoice('Virric', 'AJ')
                .addChoice('Aut\'khem', 'Rogan')
                .addChoice('Kermit', 'Kermit'))
};