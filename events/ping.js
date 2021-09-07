module.exports = {
	name: 'ping',
	execute(interaction) {
        console.log('FUCKEN PONG');
		interaction.reply('Pong!');
	},
};