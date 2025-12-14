import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import { userDataContext } from '../Context/UserContext';
import Card from '../Component/Card';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { bookingDataContext } from '../Context/BookingContext';

function MyBooking() {
    const navigate = useNavigate();
    const { userData } = useContext(userDataContext);
    const { serverUrl } = useContext(authDataContext);
    const { getCurrentUser } = useContext(userDataContext);
    const { refreshBookings } = useContext(bookingDataContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverUrl}/api/booking/mybookings`, {
                withCredentials: true
            });
            console.log('Bookings data:', response.data); // Debug log
            setBookings(response.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to refresh bookings after cancellation
    const refreshBookingsPage = async () => {
        await getCurrentUser(); // Update user data
        fetchBookings(); // Refresh bookings list
    };

    useEffect(() => {
        if (userData?._id) {
            fetchBookings();
        }
    }, [userData, serverUrl]);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen flex flex-col items-center gap-8 p-4 md:p-8'>
            <div className='w-full max-w-4xl flex items-center justify-between'>
                <button 
                    onClick={() => navigate(-1)}
                    className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                >
                    <FaArrowLeftLong className='w-5 h-5' />
                </button>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>MY BOOKINGS</h1>
                <div className='w-8'></div> {/* For layout balance */}
            </div>

            <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {bookings.length > 0 ? (
                    bookings.map((booking) => {
                        console.log('Booking item:', booking); // Debug log
                        return (
                            <Card
                                key={booking._id}
                                id={booking.listingId?._id || booking.listing?._id}
                                title={booking.listingId?.title || booking.title || booking.listing?.title}
                                landMark={booking.listingId?.landMark || booking.landMark || booking.listing?.landMark}
                                city={booking.listingId?.city || booking.city || booking.listing?.city}
                                rent={booking.listingId?.rent || booking.rent || booking.listing?.rent}
                                image1={booking.listingId?.image1 || booking.image1 || booking.listing?.image1}
                                image2={booking.listingId?.image2 || booking.image2 || booking.listing?.image2}
                                image3={booking.listingId?.image3 || booking.image3 || booking.listing?.image3}
                                ratings={booking.listingId?.ratings || booking.ratings || booking.listing?.ratings || 0}
                                isBooked={true}
                                host={booking.listingId?.host || booking.host || booking.listing?.host}
                                guest={userData?._id} // Current user is the guest for their own bookings
                            />
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-600 text-lg">No bookings found.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Browse Properties
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBooking;