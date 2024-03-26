const express = require('express');
const connectDB = require('./db/dbConnection');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});