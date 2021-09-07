module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

        try {
            await playSong();
            console.log('Song is ready to play!');
        } catch (error) {
            console.error(error);
        }
	},
};