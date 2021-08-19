const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { VoiceChannel } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { createDiscordJSAdapter } = require('./adapter.ts');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Defining Voice Channel Functions
const player = createAudioPlayer();

// Function for Playing a Song once in VC
function playSong() {
    const resource = createAudioResource('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', {
		inputType: StreamType.Arbitrary,
	});

    player.play(resource);

    return entersState(player, AudioPlayerStatus.Playing, Se3);
}

// Function for Connecting to an Audio Channel
async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = '877685315026968626';
const guildId = '877681810669178914';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
            // Routes.applicationCommands(clientId), // For Global Servers
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Poing!');
    } else if (interaction.commandName === 'theboys') {
        const member = interaction.options.getString('input')
        if (member === 'Caelan') {
            await interaction.reply(`That's our Dungeon Master, ${member}!`);
        } else if (member === 'Rogan') {
            await interaction.reply(`That's a fucken paladin.`);
        } else if (member === 'AJ') {
            await interaction.reply(`Now that's a sneaky boy.`);
        } else if (member === 'Kermit') {
            await interaction.reply(`This is literally Jeff Bezos.`)
        }
    }
})

client.on('message', async(message) => {
    if (!message.guild) return;

	if (message.content === '-join') {
		const channel = message.member?.voice.channel;

		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
				message.reply('Playing now!');
			} catch (error) {
				console.error(error);
			}
		} else {
			message.reply('Join a voice channel then try again!');
		}
	}
})


client.login(token);