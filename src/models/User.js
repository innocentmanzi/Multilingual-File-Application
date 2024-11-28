const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  language: { type: String, default: 'en', enum: ['en', 'fr', 'es', 'rw'] },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully'); // Add debug log
    next();
  } catch (err) {
    console.error('Error hashing password:', err); // Debug error
    next(err); // Pass the error to Mongoose
  }
});

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    if (!isMatch) {
      console.warn('Password comparison failed'); // Debug log for failed match
    }
    return isMatch;
  } catch (err) {
    console.error('Error during password comparison:', err); // Debug error
    throw err; // Rethrow error to calling function
  }
};


module.exports = mongoose.model('User', UserSchema);
