import express from "express";

const router = express.Router();
import {
  getLikedMovies,
  addToLikedMovies,
  addComments,
  deleteComments,
  removeFromLikedMovies,
  getComments,
} from "../controller/Controller.js";

router.get("/liked/:email", getLikedMovies);
router.post("/add", addToLikedMovies);
router.put("/remove", removeFromLikedMovies);
router.post("/comments", addComments);
router.delete("/delete", deleteComments);
router.get("/getcomment", getComments);

export default router;
