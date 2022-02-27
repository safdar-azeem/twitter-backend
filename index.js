const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDb = require('./config/connectDb.config');
const cloudinary = require('cloudinary').v2;
const routes = require('./routes');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
	fileUpload({
		useTempFiles: true,
	}),
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the API');
})

app.use('/api/v1/', routes);


const startServer = async () => {
    const port = process.env.PORT || 5050;
    try {
        await connectDb();
        app.listen(port, () => {
					console.log(`Server running on port ${port}`);
				});
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

startServer();