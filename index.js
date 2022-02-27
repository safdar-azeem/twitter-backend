const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDb = require('./config/connectDb.config');
const routes = require('./routes');

app.use(fileUpload());
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