const Jimp = require('jimp');

async function addWatermark(imageData, watermarkData, outputImage, watermarkPosition, callback) {
	try {
		const [image, watermark] = await Promise.all([
			Jimp.read(imageData),
			Jimp.read(watermarkData),
		]);


		// Resize the watermark to a percentage of the main image's width
		const widthPercentage = 20; // Adjust as needed
		watermark.resize(image.bitmap.width * (widthPercentage / 100), Jimp.AUTO);

		// Position the watermark based on 'watermarkPosition'
		switch (watermarkPosition) {
			case 'top-left':
				image.composite(watermark, 0, 0);
				break;
			case 'top-right':
				image.composite(watermark, image.bitmap.width - watermark.bitmap.width, 0);
				break;
			case 'bottom-left':
				image.composite(watermark, 0, image.bitmap.height - watermark.bitmap.height);
				break;
			case 'bottom-right':
				image.composite(watermark, image.bitmap.width - watermark.bitmap.width, image.bitmap.height - watermark.bitmap.height);
				break;
			case 'center':
				image.composite(watermark, (image.bitmap.width - watermark.bitmap.width) / 2, (image.bitmap.height - watermark.bitmap.height) / 2);
				break;
			default:
				console.error('Invalid watermark position.');
				return;
		}

		image.write(outputImage, () => {
			console.log('Watermark added successfully.');
			callback();
		});
	} catch (error) {
		console.error('An error occurred:', error);
	}
}

module.exports = addWatermark;
