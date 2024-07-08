const Review = require('../models/Review');
const Movie = require('../models/Movie');
const User = require('../models/User');

// exports.getLatestReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'username')
//       .populate('movie', 'title');

//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Helper function to calculate average rating
const calculateAverageRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId });
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

exports.createReview = async (req, res) => {
  const { userId, movieId, rating, reviewText } = req.body;
  try {
    const review = new Review({ user: userId, movie: movieId, rating, reviewText });
    await review.save();

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    movie.reviews.push(review._id);
    
    // Calculate and update average rating
    movie.averageRating = await calculateAverageRating(movieId);
    
    await movie.save();

    res.status(201).json({ review, averageRating: movie.averageRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsForMovie = async (req, res) => {
  const id = req.params.movieId;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    const reviews = await Review.find({ movie: id }).populate('user', 'username');
    
    // Calculate average rating
    const averageRating = await calculateAverageRating(id);

    res.json({ reviews, averageRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAverageRating = async (req, res) => {
  const id = req.params.movieId;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    
    const averageRating = await calculateAverageRating(id);

    res.json({ averageRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

