const User = require('../models/User');

exports.followUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.follow(userId);
    res.json({ message: 'User followed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.unfollow(userId);
    res.json({ message: 'User unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFavoriteMovie = async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.addToFavorites(movieId);
    res.json({ message: 'Movie added to favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavoriteMovie = async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.removeFromFavorites(movieId);
    res.json({ message: 'Movie removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId, bio, profilePicture, instagram } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (instagram) user.instagram = instagram;
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
