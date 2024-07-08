const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: { type: String },
  profilePicture: { type: String },
  instagram: { type: String },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next(); 
//   const salt = await bcrypt.genSalt(10); 
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.follow = async function (userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    await this.save();
    const user = await this.constructor.findById(userId);
    user.followers.push(this._id);
    await user.save();
  }
};

userSchema.methods.unfollow = async function (userId) {
  this.following.pull(userId);
  await this.save();
  const user = await this.constructor.findById(userId);
  user.followers.pull(this._id);
  await user.save();
};

userSchema.methods.addToFavorites = async function (movieId) {
  if (!this.favoriteMovies.includes(movieId)) {
    this.favoriteMovies.push(movieId);
    await this.save();
  }
};

userSchema.methods.removeFromFavorites = async function (movieId) {
  this.favoriteMovies.pull(movieId);
  await this.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;
