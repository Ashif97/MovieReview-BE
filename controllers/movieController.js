const Movie = require('../models/Movie');
const cloudinary = require('../config/cloudinary');

exports.createMovie = async (req, res) => {
  const { title, description, releaseDate, topCast, genres } = req.body;
  try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'movies' });
      const movie = new Movie({
          title, description, releaseDate, topCast, genres, image: result.secure_url
      });
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

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    await movie.remove();
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { title, description, releaseDate, topCast, genres, image } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    if (image) {
      const result = await cloudinary.uploader.upload(image, { folder: 'movies' });
      movie.image = result.secure_url;
    }

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.topCast = topCast || movie.topCast;
    movie.genres = genres || movie.genres;

    await movie.save();
    res.json({ message: 'Movie updated successfully', movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

