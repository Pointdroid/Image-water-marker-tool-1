const express = require('express');
const fileUpload = require('express-fileupload');
const addWatermark = require('./watermarker');

const app = express();
const port = 3000;

app.use(fileUpload());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/watermark', (req, res) => {
	if (!req.files || !req.files.image || !req.files.watermark) {
		return res.status(400).send('Please upload both an image and a watermark.');
	}

	const image = req.files.image;
	const watermark = req.files.watermark;
	const position = req.body.position;

	// Generate a unique filename for the output image
	const outputImageName = Date.now() + '_' + image.name;

	addWatermark(image.data, watermark.data, outputImageName, position, () => {
		res.download(outputImageName, () => {
			// Clean up the generated file after it's sent to the user
			fs.unlink(outputImageName, () => { });
		});
	});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
