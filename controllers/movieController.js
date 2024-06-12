const Movie = require('../models/Movie');
const cloudinary = require('../config/cloudinary');

exports.createMovie = async (req, res) => {
  const { title, description, releaseDate, topCast, genres, image } = req.body;
  try {
    const result = await cloudinary.uploader.upload(image, { folder: 'movies' });
    const movie = new Movie({ title, description, releaseDate, topCast, genres, image: result.secure_url });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('ratings');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  const { query, genres, rating } = req.query;
  const filter = {};

  if (query) {
    filter.title = { $regex: query, $options: 'i' };
  }

  if (genres) {
    filter.genres = { $in: genres.split(',') };
  }

  if (rating) {
    const [min, max] = rating.split('-').map(Number);
    filter['ratings.rating'] = { $gte: min, $lte: max };
  }

  try {
    const movies = await Movie.find(filter);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
