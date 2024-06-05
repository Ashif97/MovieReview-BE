const Review = require('../models/Review');
const Movie = require('../models/Movie');

exports.createReview = async (req, res) => {
  const { userId, movieId, rating, reviewText } = req.body;
  try {
    const review = new Review({ user: userId, movie: movieId, rating, reviewText });
    await review.save();

    const movie = await Movie.findById(movieId);
    movie.ratings.push(review._id);
    await movie.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsForMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId }).populate('user');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
