const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  topCast: [String],
  genres: [String],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);


// movieSchema.virtual('averageRating').get(function () {
//     if (this.ratings.length === 0) return 0;
//     const sum = this.ratings.reduce((total, review) => total + review.rating, 0);
//     return sum / this.ratings.length;
// });


