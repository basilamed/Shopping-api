const express = require('express');
const connectDB = require('./db/dbConnection');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const ProductRoutes = require('./routes/productRoutes');
const RatingRoutes = require('./routes/ratingRoutes');
const LikeRoutes = require('./routes/likeRoutes');
const TypeRoutes = require('./routes/typeRoutes');
const AuthRoutes = require('./routes/authRoutes');
const CommentRoutes = require('./routes/commentRoutes');

app.use('/api/products', ProductRoutes);
app.use('/api/ratings', RatingRoutes);
app.use('/api/likes', LikeRoutes);
app.use('/api/types', TypeRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/comments', CommentRoutes);

app.get("/nesto",(req,res)=>res.json("rutica"));
app.use("/",(req,res,next)=>res.json("Failed route"))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});