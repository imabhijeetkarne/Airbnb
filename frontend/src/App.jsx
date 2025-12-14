import React, { useContext, Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userDataContext } from './Context/UserContext';


// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ListingPage1 = lazy(() => import('./pages/ListingPage1'));
const ListingPage2 = lazy(() => import('./pages/ListingPage2'));
const ListingPage3 = lazy(() => import('./pages/ListingPage3'));
const MyListing = lazy(() => import('./pages/MyListing'));
const ViewCard = lazy(() => import('./pages/ViewCard'));
const MyBooking = lazy(() => import('./pages/MyBooking'));
const Booked = lazy(() => import('./pages/Booked'));
const Review = lazy(() => import('./pages/Review'));


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(userDataContext);
  const location = useLocation();

  if (!userData) {
    // Redirect to login page and save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <div className="app">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Suspense>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/listingpage1"
            element={
              <ProtectedRoute>
                <ListingPage1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listingpage2"
            element={
              <ProtectedRoute>
                <ListingPage2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listingpage3"
            element={
              <ProtectedRoute>
                <ListingPage3 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylisting"
            element={
              <ProtectedRoute>
                <MyListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewcard"
            element={
              <ProtectedRoute>
                <ViewCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mybooking"
            element={
              <ProtectedRoute>
                <MyBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booked"
            element={
              <ProtectedRoute>
                <Booked />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews/:listingId"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />
         
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;