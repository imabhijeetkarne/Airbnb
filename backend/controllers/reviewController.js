import Review from "../model/reviewModel.js";
import Listing from "../model/listing.model.js";
import User from "../model/user.model.js";

export const createReview = async (req, res) => {
    try {
        const { listingId, rating, comment, cleanliness, accuracy, communication, location, checkIn, value } = req.body;
        const userId = req.userId;

        if (!listingId || !rating || !comment) {
            return res.status(400).json({ message: "Listing ID, rating, and comment are required" });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const existingReview = await Review.findOne({ user: userId, listing: listingId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this listing" });
        }

        const review = await Review.create({
            user: userId,
            listing: listingId,
            rating,
            comment,
            cleanliness,
            accuracy,
            communication,
            location,
            checkIn,
            value
        });

        await Listing.findByIdAndUpdate(listingId, {
            $push: { reviews: review._id }
        });

        await User.findByIdAndUpdate(userId, {
            $push: { reviews: review._id }
        });

        const populatedReview = await Review.findById(review._id)
            .populate('user', 'name email')
            .populate('listing', 'title city');

        return res.status(201).json(populatedReview);

    } catch (error) {
        return res.status(500).json({ message: `Create review error: ${error}` });
    }
};

export const getListingReviews = async (req, res) => {
    try {
        const { listingId } = req.params;

        const reviews = await Review.find({ listing: listingId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        return res.status(200).json(reviews);

    } catch (error) {
        return res.status(500).json({ message: `Get listing reviews error: ${error}` });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const userId = req.userId;

        const reviews = await Review.find({ user: userId })
            .populate('listing', 'title city image1 rent')
            .sort({ createdAt: -1 });

        return res.status(200).json(reviews);

    } catch (error) {
        return res.status(500).json({ message: `Get user reviews error: ${error}` });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment, cleanliness, accuracy, communication, location, checkIn, value } = req.body;
        const userId = req.userId;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: "You can only update your own reviews" });
        }

        const updateData = {
            ...(rating && { rating }),
            ...(comment && { comment }),
            ...(cleanliness && { cleanliness }),
            ...(accuracy && { accuracy }),
            ...(communication && { communication }),
            ...(location && { location }),
            ...(checkIn && { checkIn }),
            ...(value && { value })
        };

        const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true })
            .populate('user', 'name email')
            .populate('listing', 'title city');

        return res.status(200).json(updatedReview);

    } catch (error) {
        return res.status(500).json({ message: `Update review error: ${error}` });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.userId;

        const review = await Review.findById(reviewId).populate('listing');
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const isReviewAuthor = review.user.toString() === userId;
        const isListingOwner = review.listing.host.toString() === userId;

        if (!isReviewAuthor && !isListingOwner) {
            return res.status(403).json({ message: "You can only delete your own reviews or reviews on your listings" });
        }

        await Review.findByIdAndDelete(reviewId);

        await Listing.findByIdAndUpdate(review.listing, {
            $pull: { reviews: reviewId }
        });

        await User.findByIdAndUpdate(review.user, {
            $pull: { reviews: reviewId }
        });

        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Delete review error: ${error}` });
    }
};

export const getReviewStats = async (req, res) => {
    try {
        const { listingId } = req.params;

        const reviews = await Review.find({ listing: listingId });

        if (reviews.length === 0) {
            return res.status(200).json({
                totalReviews: 0,
                averageRating: 0,
                ratingBreakdown: {
                    5: 0,
                    4: 0,
                    3: 0,
                    2: 0,
                    1: 0
                },
                categoryAverages: {
                    cleanliness: 0,
                    accuracy: 0,
                    communication: 0,
                    location: 0,
                    checkIn: 0,
                    value: 0
                }
            });
        }

        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        const ratingBreakdown = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length
        };

        const categoryAverages = {
            cleanliness: reviews.reduce((sum, review) => sum + review.cleanliness, 0) / totalReviews,
            accuracy: reviews.reduce((sum, review) => sum + review.accuracy, 0) / totalReviews,
            communication: reviews.reduce((sum, review) => sum + review.communication, 0) / totalReviews,
            location: reviews.reduce((sum, review) => sum + review.location, 0) / totalReviews,
            checkIn: reviews.reduce((sum, review) => sum + review.checkIn, 0) / totalReviews,
            value: reviews.reduce((sum, review) => sum + review.value, 0) / totalReviews
        };

        return res.status(200).json({
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingBreakdown,
            categoryAverages: {
                cleanliness: Math.round(categoryAverages.cleanliness * 10) / 10,
                accuracy: Math.round(categoryAverages.accuracy * 10) / 10,
                communication: Math.round(categoryAverages.communication * 10) / 10,
                location: Math.round(categoryAverages.location * 10) / 10,
                checkIn: Math.round(categoryAverages.checkIn * 10) / 10,
                value: Math.round(categoryAverages.value * 10) / 10
            }
        });

    } catch (error) {
        return res.status(500).json({ message: `Get review stats error: ${error}` });
    }
};

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('listing', 'title city')
            .sort({ createdAt: -1 });

        return res.status(200).json(reviews);

    } catch (error) {
        return res.status(500).json({ message: `Get all reviews error: ${error}` });
    }
};