const mongoose = require('mongoose');
const Review = require('../models/Review');



exports.getTopReviews = async (req, res) => {
  try {
    console.log('Fetching top 5 reviews');
    console.log('Request URL:', req.originalUrl);

    // Fetching top 5 reviews sorted by creation date
    const topReviews = await Review.find()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(5) // Limit to the latest 5 reviews
      .select('rating reviewText createdAt'); // Selecting only desired fields

    console.log('Top reviews fetched successfully', topReviews);
    res.status(200).json(topReviews);
  } catch (error) {
    console.error('Error fetching top reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
