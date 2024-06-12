const Review = require('../models/Review');
const Movie = require('../models/Movie');

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
    await movie.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReviewsForMovie = async (req, res) => {
  // try {
  //   const reviews = await Review.find({ movie: req.params.movieId }).populate('user', 'username email');
  //   res.json(reviews);
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
  const id = req.params.movieId
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
        return res.status(400).json({ error: "Movie not found" });
    }
    const reviewbymovie = await Movie.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'user',
            select: 'username'
        }
    });
    res.json(reviewbymovie);
  }
  catch (err) {
       res.status(500).json({ error: err.message });
     }
}

