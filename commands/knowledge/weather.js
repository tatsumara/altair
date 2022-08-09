const { MessageEmbed } = require('discord.js');
const got = require('got');

function readablePassedSince(date) {
	const now = new Date();
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
	const milestones = [
		{ suffix: 'y', div: 3600 * 24 * 365, fraction: 1 },
		{ suffix: 'mo', div: 3600 * 24 * 30, fraction: 1 },
		{ suffix: 'd', div: 3600 * 24, fraction: 0 },
		{ suffix: 'h', div: 3600, fraction: 0 },
		{ suffix: 'm', div: 60, fraction: 0 },
	];

	for (const { suffix, div, fraction } of milestones) {
		if (diff >= div) {
			return `${(diff / div).toFixed(fraction)}${suffix} ago`;
		}
	}

	return 'just now';
}

function azimuthToEmoji(degrees) {
	const directions = [
		{ range: [337, 22], direction: 'up' },
		{ range: [22, 67], direction: 'upper_right' },
		{ range: [67, 112], direction: 'right' },
		{ range: [112, 157], direction: 'lower_right' },
		{ range: [157, 202], direction: 'down' },
		{ range: [202, 247], direction: 'lower_left' },
		{ range: [247, 292], direction: 'left' },
		{ range: [292, 337], direction: 'upper_left' },
	];

	for (const { range: [left, right], direction } of directions) {
		if (left <= degrees && degrees <= right) {
			return `:arrow_${direction}:`;
		}
	}
}

module.exports = {
	name: 'weather',
	description: 'Gets the current weather.',
	usage: 'weather [<location> OR <@user>]',
	args: true,
	aliases: ['we'],

	async execute(client, message, args) {
		const location = args.join('+');

		// get weather
		// i love pattern matching
		const {
			current_condition: [{
				weatherDesc: [{ value: condition }],
				FeelsLikeC: feelsC,
				FeelsLikeF: feelsF,
				temp_C: tempC,
				temp_F: tempF,
				windspeedKmph: windKmph,
				winddirDegree: windAzimuth,
				localObsDateTime: observationTime,
			}],
			nearest_area: [{
				areaName: [{ value: city }],
				country: [{ value: country }],
				region: [{ value: region }],
				latitude, longitude,
			}],
		} = JSON.parse((await got(`https://wttr.in/${location}?format=j1`)).body);

		// get UTC offset
		const {
			currentUtcOffset: { seconds: timeOffs },
		} = JSON.parse((await got(`https://www.timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`)).body);

		// convert their local time to a Date object
		const offsHrs = ('00' + Math.floor(timeOffs / 3600)).slice(-2);
		const offsMins = ('00' + Math.floor((timeOffs % 3600) / 60)).slice(-2);
		const obsTime = new Date(`${observationTime}+${offsHrs}${offsMins}`);
		const difference = readablePassedSince(obsTime);

		// convert wind speed
		const windMs = (windKmph * 0.277778).toFixed(1);

		// get location string
		const resultLocation = region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;

		const embed = new MessageEmbed()
			.setTitle(`${condition}, feels like ${feelsC}°C (${feelsF}°F)`)
			.setDescription(`in ${resultLocation}`)
			.addField(`${tempC}°C (${tempF}°F)`, ':thermometer: Actual temperature')
			.addField(`${windMs} m/s (${windKmph} km/h)`, `${azimuthToEmoji(windAzimuth)} Wind`)
			.setColor(client.colors.blue)
			.setFooter({ text: `observed ${difference}` });

		await message.reply({ embeds: [embed] });
	},
};