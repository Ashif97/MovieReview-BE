const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true },
  reviewText: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema, 'reviews');
