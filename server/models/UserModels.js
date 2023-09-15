import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    max: 50,
  },
  likedMovies: Array,
});

const User = mongoose.model("User", userSchema);

export default User;
