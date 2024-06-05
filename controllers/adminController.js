const User = require('../models/User');
const Review = require('../models/Review');

exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalRatings = await Review.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    res.json({
      totalUsers,
      totalReviews,
      averageRating: totalRatings[0]?.averageRating || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
