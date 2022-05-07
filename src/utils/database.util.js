const { MongoClient } = require('mongodb');

module.exports = async (client) => {

	const dbClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	const db = await new Promise(resolve => {
		dbClient.connect(err => {
			if (err) {
				client.log.error('MongoDB connection rejected');
				console.log(err);
				process.exit();
			}

			resolve(dbClient.db('bot_na_zamowienie'));
		});
	});

	client.getGuild = async (guildID) => {
		return await db.collection('guilds').findOne({ guildID });
	}

	client.updateGuild = async (guildID, update) => {
		return await db.collection('guilds').findOneAndUpdate({ guildID }, { $set: update });
	}

	client.insertGuild = async (insert) => {
		return await db.collection('guilds').insertOne(insert);
	}

	client.deleteGuild = async (guildID) => {
		return await db.collection('guilds').findOneAndDelete({ guildID });
	}

	client.getAdByGuildID = async (guildID) => {
		return await db.collection('ads').findOne({ guildID });
	} 

	client.getAdByNumber = async (number) => {
		return await db.collection('ads').findOne({ number });
	}

	client.insertAd = async (insert) => {
		return await db.collection('ads').insertOne(insert);
	}

	client.updateAdByGuildID = async (guildID, update) => {
		return await db.collection('ads').findOneAndUpdate({ guildID }, { $set: update });
	}

	client.updateAdByNumber = async (number, update) => {
		return await db.collection('ads').findOneAndUpdate({ number }, { $set: update });
	}

	client.deleteAdByGuildID = async (guildID) => {
		return await db.collection('ads').findOneAndDelete({ guildID });
	}
	
	client.deleteAdByNumber = async (number) => {
		return await db.collection('ads').findOneAndDelete({ number });
	}

	client.getAdCheckingByGuildID = async (guildID) => {
		return await db.collection('adsChecking').findOne({ guildID });
	}

	client.getAdCheckingByMessageID = async (messageID) => {
		return await db.collection('adsChecking').findOne({ messageID });
	}

	client.insertAdChecking = async (insert) => {
		return await db.collection('adsChecking').insertOne(insert);
	}

	client.deleteAdCheckingByGuildID = async (guildID) => {
		return await db.collection('adsChecking').findOneAndDelete({ guildID });
	}

	client.deleteAdCheckingByMessageID = async (messageID) => {
		return await db.collection('adsChecking').findOneAndDelete({ messageID });
	}

	client.getAdsCount = async () => {
		const ads = await db.collection('ads').countDocuments();

		return ads;
	}

	client.getNumber = async () => {

		let number = (await db.collection('adsConfig').findOne({ name: 'bot' }))?.number;

		if (!number) {
			number = 1;
			db.collection('adsConfig').insertOne({ number, name: 'bot' });
		}

		return number;

	}

	client.setNumber = async (num) => {

		let number = (await db.collection('adsConfig').findOne({ name: 'bot' }))?.number;

		if (!number) {
			number = 1;
			await db.collection('adsConfig').insertOne({ number, name: 'bot' });
		} else {
			number = num || number + 1;
			await db.collection('adsConfig').findOneAndUpdate({ name: 'bot' }, { $set: { number } });
		}

	}

	client.log.ready('MongoDB connected');
}