const Review = require('../models/Review');
const Movie = require('../models/Movie');
const User = require('../models/User');
const mongoose = require('mongoose');
const calculateAverageRating = async (movieId) => {
  const reviews = await Review.find({ movie: movieId });
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

exports.createReview = async (req, res) => {
  const { userId, movieId, rating, reviewText } = req.body;
  try {
    const existingReview = await Review.findOne({ user: userId, movie: movieId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this movie.' });
    }
    const review = new Review({ user: userId, movie: movieId, rating, reviewText });
    await review.save();

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    movie.reviews.push(review._id);
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

// New function to get all reviews made by a particular user
// exports.getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find().sort({ createdAt: -1 }).populate('user', 'username').populate('movie', 'title');
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find().sort({ createdAt: -1 });
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// // };
// exports.getUserReviewsWithMovies = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const reviews = await Review.aggregate([
//       { $match: { user: mongoose.Types.ObjectId(userId) } },
//       {
//         $lookup: {
//           from: 'movies',
//           localField: 'movie',
//           foreignField: '_id',
//           as: 'movie'
//         }
//       },
//       {
//         $unwind: '$movie'
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'user',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       {
//         $unwind: '$user'
//       },
//       {
//         $project: {
//           _id: 1,
//           user: '$user.username',
//           movie: {
//             _id: '$movie._id',
//             title: '$movie.title',
//             image: '$movie.image'
//           },
//           rating: 1,
//           reviewText: 1,
//           createdAt: 1,
//           updatedAt: 1
//         }
//       }
//     ]);

//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// exports.getUserMovies = async (req, res) => {
//   try {
//     const reviews = await Review.find().populate('user', '_id').populate('movie', '_id');
//     const userMovies = reviews.map(review => ({
//       userId: review.user._id,
//       movieId: review.movie._id
//     }));

//     res.json(userMovies);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getUserMovies = async (req, res) => {
  try {
    const userId =  req.params.userId;
    console.log(userId,'userId');
    const reviews = await Review.find( { user: userId } ).populate('movie', 'title');
    res.json(reviews);
  } catch (err) {
    console.error('Error in getUserMovies:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating, reviewText },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ review: updatedReview });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// deleteReview function
exports.deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};