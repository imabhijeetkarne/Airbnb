import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createReview, getListingReviews, getUserReviews, updateReview, deleteReview, getReviewStats, getAllReviews } from "../controllers/reviewController.js"

let reviewRouter = express.Router()

reviewRouter.post("/create", isAuth, createReview)
reviewRouter.get("/listing/:listingId", getListingReviews)
reviewRouter.get("/user", isAuth, getUserReviews)
reviewRouter.put("/update/:reviewId", isAuth, updateReview)
reviewRouter.delete("/delete/:reviewId", isAuth, deleteReview)
reviewRouter.get("/stats/:listingId", getReviewStats)
reviewRouter.get("/all", getAllReviews)

export default reviewRouter
