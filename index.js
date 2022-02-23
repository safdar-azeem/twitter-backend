const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./config/connectDb.config');


app.use(bodyParser.json());
app.use(cors());

const startServer = async () => {
    const port = process.env.PORT || 5010;
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