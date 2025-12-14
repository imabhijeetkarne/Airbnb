import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    cleanliness: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    accuracy: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    communication: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    location: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    checkIn: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    value: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;