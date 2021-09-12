module.exports = (result) => {
	const author = result.data.author_name || result.data.member_name || result.data.creator || result.data.artist || result.data.author || result.data.twitter_user_handle || 'Unknown';
	const thumbnail = result.header.thumbnail;

	let source;
	let title;
	if (!result.data.ext_urls) result.data.ext_urls = ['https://saucenao.com/'];

	if (result.data.source?.startsWith('http')) {
		source = result.data.source;
		title = result.data.title || 'Unknown';
	} else if (result.data.source) {
		source = result.data.ext_urls[0];
		title = result.data.source;
	} else {
		source = result.data.ext_urls[0];
		title = result.data.title || 'Unknown';
	}

	const confidence = result.header.similarity;
	let embedTitle = 'Source Found!';
	let color = '#0073E6';
	if (confidence < 50.0) {
		embedTitle = 'Source probably not found.';
		color = '#FF0000';
	} else if (confidence < 75.0) {
		embedTitle = 'Source found?';
		color = '#FFA500';
	}

	return {
		embedTitle: embedTitle,
		color: color,
		thumbnail: thumbnail,
		title: title,
		author: author,
		source: source,
		confidence: confidence,
	};
};