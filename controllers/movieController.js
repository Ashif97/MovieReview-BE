// const Movie = require('../models/Movie');
// const cloudinary = require('../config/cloudinary');

// exports.createMovie = async (req, res) => {
//   const { title, description, releaseDate, topCast, genres, image } = req.body;
//   try {
//     const result = await cloudinary.uploader.upload(image, { folder: 'movies' });
//     const movie = new Movie({ title, description, releaseDate, topCast, genres, image: result.secure_url });
//     await movie.save();
//     res.status(201).json(movie);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getMovies = async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     res.json(movies);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.getMovie = async (req, res) => {
//   try {
//     const movie = await Movie.findById(req.params.id).populate('ratings');
//     if (!movie) return res.status(404).json({ message: 'Movie not found' });
//     res.json(movie);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.searchMovies = async (req, res) => {
//   const { query, genres, rating } = req.query;
//   const filter = {};

//   if (query) {
//     filter.title = { $regex: query, $options: 'i' };
//   }

//   if (genres) {
//     filter.genres = { $in: genres.split(',') };
//   }

//   if (rating) {
//     const [min, max] = rating.split('-').map(Number);
//     filter['ratings.rating'] = { $gte: min, $lte: max };
//   }

//   try {
//     const movies = await Movie.find(filter);
//     res.json(movies);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
const Movie = require('../models/Movie');
const cloudinary = require('../config/cloudinary');

exports.createMovie = async (req, res) => {
  const { title, description, releaseDate, topCast, genres, image } = req.body;
  try {
    const result = await cloudinary.uploader.upload(image, { folder: 'movies' });
    const movie = new Movie({ 
      title, 
      description, 
      releaseDate, 
      topCast, 
      genres, 
      image: result.secure_url 
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
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
    if (rating === 'unrated') {
      filter.rating = { $exists: false };
    } else {
      const [min, max] = rating.split('-').map(Number);
      filter.rating = { $gte: min, $lte: max };
    }
  }

  try {
    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Extract public_id from the Cloudinary URL
    const publicId = movie.image.split('/').pop().split('.')[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(`movies/${publicId}`);

    // Delete movie from database
    await Movie.findByIdAndDelete(req.params.id);

    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { title, description, releaseDate, topCast, genres, image } = req.body;
  try {
    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    let imageUrl = movie.image;
    if (image && image !== movie.image) {
      // Delete old image
      const oldPublicId = movie.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`movies/${oldPublicId}`);

      // Upload new image
      const result = await cloudinary.uploader.upload(image, { folder: 'movies' });
      imageUrl = result.secure_url;
    }

    movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, description, releaseDate, topCast, genres, image: imageUrl },
      { new: true }
    );

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

