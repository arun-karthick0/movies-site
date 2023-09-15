import User from "../models/UserModels.js";
import Comment from "../models/Comments.js";

export const getLikedMovies = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ msg: "success", movies: user.likedMovies });
    } else return res.json({ msg: "User with given email not found." });
  } catch (error) {
    return res.json({ msg: "Error fetching movies." });
  }
};

// get comments
export const getComments = async (req, res) => {
  try {
    const movieId = req?.query?.MovieId;
    const comments = await Comment.find({ movieId });

    if (comments.length > 0) {
      const extractedComments = comments.map((comment) => {
        const userComments = comment.userComments.map((userComment) => ({
          user: userComment?.user,
          comment: userComment?.comments,
        }));

        return userComments;
      });

      return res.json({
        data: { comments: extractedComments.flat() },
      });
    } else {
      console.log("No comments found for this movie");
      return res.json({ msg: "Comments not found for this movie" });
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Error fetching comments" });
  }
};

// add comments

export const addComments = async (req, res) => {
  try {
    const { user, comments, Movie_id, name } = req.body;
    console.log(name);

    let existingComment = await Comment.findOne({ movieId: Movie_id });

    if (!existingComment) {
      existingComment = new Comment({
        movieId: Movie_id,
        userComments: [
          {
            name: name,
            user: user,
            comments: comments,
          },
        ],
      });
    } else {
      existingComment.userComments.push({
        user: user,
        comments: comments,
        name: name,
      });
    }

    await existingComment.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComments = async (req, res) => {
  try {
    const data = req?.body;
    const movieId = data?.Movie_id;
    const user = data?.user;
    const comment = data?.comment;

    const userToUpdate = await Comment.findOne({ movieId });

    console.log("userToUpdate", userToUpdate);

    if (!userToUpdate) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const commentIndexToDelete = userToUpdate?.userComments?.findIndex(
      (userComment) => {
        return userComment?.user === user && userComment?.comments === comment;
      }
    );

    console.log(commentIndexToDelete);

    if (commentIndexToDelete === -1) {
      return res
        .status(404)
        .json({ error: "Comment not found for the user and movie" });
    }

    userToUpdate?.userComments?.splice(commentIndexToDelete, 1);

    await userToUpdate.save();

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Error deleting comment" });
  }
};

export const addToLikedMovies = async (req, res) => {
  try {
    const data = req.body;
    const email = data.email;

    const user = await User.findOne({ email });

    if (user) {
      const { likedMovies } = user;
      const movieAlreadyLiked = likedMovies.some(
        (movie) => movie.Movie_id === data.Movie_id
      );

      if (!movieAlreadyLiked) {
        const newMovie = {
          Movie_id: data?.Movie_id,
          name: data?.name,
          genres: data?.genres,
          release_date: data?.release_date,
          poster: data?.poster,
        };

        user.likedMovies.push(newMovie);
        await user.save();

        console.log(user);

        return res.json({ msg: "Movie successfully added to liked list." });
      } else {
        return res.json({ msg: "Movie already added to the liked list." });
      }
    } else {
      const newUser = await User.create({
        email,
        likedMovies: [
          {
            Movie_id: data?.Movie_id,
            name: data?.name,
            genres: data?.genres,
            release_date: data?.release_date,
            poster: data?.poster,
          },
        ],
      });
      return res.json({ msg: "Movie successfully added to liked list." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ msg: "Error adding movie to the liked list" });
  }
};

export const removeFromLikedMovies = async (req, res) => {
  try {
    const data = req.body;
    const email = data?.user;
    const movieId = data?.movie_id;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User with given email not found." });
    }

    const movies = user.likedMovies;
    const movieIndex = movies.findIndex(({ Movie_id }) => Movie_id === movieId);

    movies.splice(movieIndex, 1);
    user.likedMovies = movies;

    await user.save();

    return res.json({ msg: "Movie successfully removed.", movies });
  } catch (error) {
    console.error("Error removing movie:", error);
    return res
      .status(500)
      .json({ msg: "Error removing movie from the liked list" });
  }
};
