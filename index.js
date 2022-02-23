const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./config/connectDb.config');
const routes = require('./routes');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/', routes);

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