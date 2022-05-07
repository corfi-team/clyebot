const gbans = require('../../../gbans.json');
const { writeFileSync } = require('fs');

module.exports = {
	name: 'gban',
	ownerOnly: true,
	run: async ({ args }) => {
		if (!args[0]) return {
			type: 'error',
			text: 'Oznacz osobę lub podaj jej ID'
		}

		args[0] = args[0].replace(/[<@!>]/g, '');

		const user = await client.users.fetch(args[0]).catch(e => e);

		if (user instanceof Error) return {
			type: 'error',
			text: 'Taka osoba nie istnieje'
		}

		if (gbans[args[0]]) {
			delete gbans[args[0]];

			writeFileSync('./gbans.json', JSON.stringify(gbans, null, 4));

			return {
				text: `Odebrano gbana dla <@${user.id}>`
			}
		} else {
			gbans[args[0]] = args[1] ? args.slice(1).join(' ') : 'Nie podano'

			writeFileSync('./gbans.json', JSON.stringify(gbans, null, 4));

			return {
				text: `Nadano gbana dla <@${user.id}>`
			}
		}
	}
}