import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  movieId: {
    type: String,
  },
  userComments: [
    {
      user: {
        type: String,
        required: true,
      },
      comments: {
        type: String,
      },
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
