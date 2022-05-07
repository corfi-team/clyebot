module.exports = (channel) => {
	let pass = true;

	channel.permissionOverwrites.forEach(perm => {
		const permission = channel.permissionsFor(perm.id);

		if (permission && !permission.has(['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'])) pass = false;
	});

	return pass;
}