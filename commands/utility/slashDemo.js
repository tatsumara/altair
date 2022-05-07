module.exports = {
	name: 'slash_demo',
	description: 'does something with a string and a number in true JS fashion',
	examples: [
		'/slash_demo action:add string:5 number:3 -> 53',
		'/slash_demo action:sub string:5 number:3 -> 2',
	],
	slashOptions: [
		{ name: 'action', description: 'action to perform', type: 3, required: true, choices: [
			{ name: 'add', value: 'add' },
			{ name: 'sub', value: 'sub' },
		] },
		{ name: 'string', description: 'string (left hand side)', type: 3, required: true },
		{ name: 'number', description: 'number (right hand side)', type: 4, required: true },
	],
	cooldown: 10,

	async execute(client, interaction, _functions) {
		const action = interaction.options.getString('action');
		const string = interaction.options.getString('string');
		const number = interaction.options.getInteger('number');

		let result = action === 'add' ? string + number : string - number;
		if (typeof result === 'string') {
			result = '"' + result + '"';
		}

		await interaction.editReply(`"${string}" ${action === 'add' ? '+' : '-'} ${number} = ${result}`);
	},
};