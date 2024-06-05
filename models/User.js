const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  profilePicture: { type: String },
  instagram: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add role field
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.follow = async function (userId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    await this.save();
  }
};

UserSchema.methods.unfollow = async function (userId) {
  this.following = this.following.filter(followingId => followingId.toString() !== userId.toString());
  await this.save();
};

UserSchema.methods.addToFavorites = async function (movieId) {
  if (!this.favoriteMovies.includes(movieId)) {
    this.favoriteMovies.push(movieId);
    await this.save();
  }
};

UserSchema.methods.removeFromFavorites = async function (movieId) {
  this.favoriteMovies = this.favoriteMovies.filter(favoriteId => favoriteId.toString() !== movieId.toString());
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);
