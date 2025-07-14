require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const router = require('./router');
const errorMiddleware = require('./middlewares/errorMiddleware');

const server = express();
const PORT = process.env.PORT || 2300;

server.use(express.json());
server.use(cors());
server.use(cookieParser());
server.use('/restapi', router);
server.use(errorMiddleware);


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
    } catch (error) {
        console.error(error);
    }
}
start();