import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { userDataContext } from '../Context/UserContext'
import { authDataContext } from '../Context/AuthContext'
import { FaStar, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaArrowLeftLong } from "react-icons/fa6";

function Review() {
    const { listingId } = useParams()
    const navigate = useNavigate()
    const { userData } = useContext(userDataContext)
    const { serverUrl } = useContext(authDataContext)

    const [reviews, setReviews] = useState([])
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [editingReview, setEditingReview] = useState(null)
    const [stats, setStats] = useState(null)

    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5
    })

    const categoryLabels = {
        cleanliness: 'Cleanliness',
        accuracy: 'Accuracy',
        communication: 'Communication',
        location: 'Location',
        checkIn: 'Check-in',
        value: 'Value'
    }

    useEffect(() => {
        fetchReviews()
        fetchListing()
        fetchStats()
    }, [listingId])

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/review/listing/${listingId}`, {
                withCredentials: true
            })
            setReviews(response.data)
        } catch (error) {
            toast.error('Failed to fetch reviews')
        }
    }

    const fetchListing = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/listing/findlistingbyid/${listingId}`, {
                withCredentials: true
            })
            setListing(response.data)
        } catch (error) {
            toast.error('Failed to fetch listing details')
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/review/stats/${listingId}`, {
                withCredentials: true
            })
            setStats(response.data)
        } catch (error) {
            console.error('Failed to fetch stats')
        }
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        
        if (!formData.comment.trim()) {
            toast.error('Please write a review comment')
            return
        }

        try {
            const url = editingReview 
                ? `${serverUrl}/api/review/update/${editingReview._id}`
                : `${serverUrl}/api/review/create`
            
            const response = await axios[editingReview ? 'put' : 'post'](url, {
                listingId,
                ...formData
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            toast.success(editingReview ? 'Review updated successfully!' : 'Review submitted successfully!')
            setShowReviewForm(false)
            setEditingReview(null)
            resetForm()
            fetchReviews()
            fetchStats()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review')
        }
    }

    const handleDeleteReview = async (reviewId) => {
        toast.warn(
            <div>
                <p className="font-medium mb-2">Are you sure you want to delete this review?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss()
                            try {
                                await axios.delete(`${serverUrl}/api/review/delete/${reviewId}`, {
                                    withCredentials: true
                                })

                                toast.success('Review deleted successfully!')
                                fetchReviews()
                                fetchStats()
                            } catch (error) {
                                toast.error(error.response?.data?.message || 'Error deleting review')
                            }
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                    >
                        No
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        )
    }

    const handleEditReview = (review) => {
        setEditingReview(review)
        setFormData({
            rating: review.rating,
            comment: review.comment,
            cleanliness: review.cleanliness,
            accuracy: review.accuracy,
            communication: review.communication,
            location: review.location,
            checkIn: review.checkIn,
            value: review.value
        })
        setShowReviewForm(true)
    }

    const resetForm = () => {
        setFormData({
            rating: 5,
            comment: '',
            cleanliness: 5,
            accuracy: 5,
            communication: 5,
            location: 5,
            checkIn: 5,
            value: 5
        })
    }

    const renderStars = (rating, onChange, interactive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={interactive ? () => onChange(star) : undefined}
                    />
                ))}
            </div>
        )
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <FaArrowLeftLong 
                    onClick={() => navigate(-1)}
                 className='w-[25px] h-[25px] text-[red] cursor-pointer' />
                
                
                {listing && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                        <p className="text-gray-600 mb-4">{listing.city}, {listing.landMark}</p>
                        
                        {stats && (
                            <div className="flex items-center gap-6 mb-4">
                                <div className="flex items-center gap-2">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-semibold">{stats.averageRating}</span>
                                    <span className="text-gray-600">({stats.totalReviews} reviews)</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Review Button */}
            {userData && (
                <div className="mb-6">
                    <button
                        onClick={() => {
                            setShowReviewForm(true)
                            setEditingReview(null)
                            resetForm()
                        }}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        <FaPlus />
                        Write a Review
                    </button>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {editingReview ? 'Edit Review' : 'Write a Review'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowReviewForm(false)
                                    setEditingReview(null)
                                    resetForm()
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Overall Rating</label>
                                {renderStars(formData.rating, (rating) => setFormData({...formData, rating}), true)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {Object.entries(categoryLabels).map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium mb-1">{label}</label>
                                        {renderStars(formData[key], (rating) => setFormData({...formData, [key]: rating}), true)}
                                    </div>
                                ))}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Your Review</label>
                                <textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    rows="4"
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {editingReview ? 'Update Review' : 'Submit Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReviewForm(false)
                                        setEditingReview(null)
                                        resetForm()
                                    }}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-gray-600">No reviews yet. Be the first to write a review!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold">{review.user?.name || 'Anonymous'}</h3>
                                    <div className="flex items-center gap-2">
                                        {renderStars(review.rating)}
                                        <span className="text-sm text-gray-600">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                {userData && (
                                    <div className="flex gap-2">
                                        {review.user?._id === userData._id && (
                                            <button
                                                onClick={() => handleEditReview(review)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <FaEdit />
                                            </button>
                                        )}
                                        {(review.user?._id === userData._id || listing?.host === userData._id) && (
                                            <button
                                                onClick={() => handleDeleteReview(review._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                                {Object.entries(categoryLabels).map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-gray-600">{label}:</span>
                                        <div className="flex items-center gap-1">
                                            {renderStars(review[key])}
                                            <span className="text-xs">{review[key]}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Review