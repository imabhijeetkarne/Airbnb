// import React, { useState, useContext } from 'react';
// import { IoMdEye } from "react-icons/io";
// import { IoMdEyeOff } from "react-icons/io";
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { authDataContext } from '../Context/AuthContext';
// import { userDataContext } from '../Context/UserContext';
// import { toast } from 'react-toastify';

// function Login() {
//     const [show, setShow] = useState(false);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const { login, loading, error, setError } = useContext(authDataContext);
//     const { setUserData } = useContext(userDataContext);
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             toast.error("Please fill in all fields");
//             return;
//         }

//         const { success, data, error: loginError } = await login(email, password);
        
//         if (success) {
//             setUserData(data.user);
//             toast.success("Login successful!");
//             navigate("/");
//         } else {
//             toast.error(loginError || "Login failed. Please try again.");
//         }
//     };

//     return (
//         <div className='w-[100vw] min-h-[100vh] flex items-center justify-center relative bg-gray-50'>
//             <div 
//                 className='w-[50px] h-[50px] bg-red-500 cursor-pointer absolute top-[5%] left-[5%] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors'
//                 onClick={() => navigate("/")}
//             >
//                 <FaArrowLeftLong className='w-6 h-6 text-white' />
//             </div>
            
//             <form 
//                 onSubmit={handleLogin}
//                 className='w-full max-w-md bg-white p-8 rounded-xl shadow-md mx-4'
//             >
//                 <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Welcome to Airbnb</h1>
                
//                 <div className='mb-6'>
//                     <label 
//                         htmlFor="email" 
//                         className='block text-gray-700 text-sm font-medium mb-2'
//                     >
//                         Email
//                     </label>
//                     <input 
//                         type="email" 
//                         id='email' 
//                         className='w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
//                         required 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         value={email}
//                         disabled={loading}
//                     />
//                 </div> 
                
//                 <div className='mb-6 relative'>
//                     <label 
//                         htmlFor="password" 
//                         className='block text-gray-700 text-sm font-medium mb-2'
//                     >
//                         Password
//                     </label>
//                     <div className='relative'>
//                         <input 
//                             type={show ? "text" : "password"} 
//                             id='password' 
//                             className='w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all'
//                             required 
//                             onChange={(e) => setPassword(e.target.value)} 
//                             value={password}
//                             disabled={loading}
//                         />
//                         <button 
//                             type="button"
//                             className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
//                             onClick={() => setShow(prev => !prev)}
//                             disabled={loading}
//                         >
//                             {show ? (
//                                 <IoMdEyeOff className='w-5 h-5' />
//                             ) : (
//                                 <IoMdEye className='w-5 h-5' />
//                             )}
//                         </button>
//                     </div>
//                 </div>

//                 {error && (
//                     <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm'>
//                         {error}
//                     </div>
//                 )}

//                 <button 
//                     type="submit" 
//                     className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
//                         loading 
//                             ? 'bg-red-400 cursor-not-allowed' 
//                             : 'bg-red-500 hover:bg-red-600'
//                     }`}
//                     disabled={loading}
//                 >
//                     {loading ? 'Signing in...' : 'Sign In'}
//                 </button>
                
//                 <p className='mt-4 text-center text-gray-600'>
//                     Don't have an account?{' '}
//                     <button 
//                         type="button"
//                         className='text-red-500 font-medium hover:underline focus:outline-none'
//                         onClick={() => navigate("/signup")}
//                         disabled={loading}
//                     >
//                         Sign Up
//                     </button>
//                 </p>
//             </form>
//         </div>
//     );
// }

// export default Login;

import React, { useContext, useState } from 'react'
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { authDataContext } from '../Context/AuthContext';
import axios from 'axios';
import { userDataContext } from '../Context/UserContext';
import { toast } from 'react-toastify';

function Login() {
    let [show,setShow] = useState(false)
    let {serverUrl} = useContext(authDataContext)
    let {userData,setUserData} = useContext(userDataContext)
    let [email,setEmail]= useState("")
    let [password,setPassword]= useState("")
    let {loading,setLoading}= useContext(authDataContext)
    let navigate = useNavigate()
     const handleLogin = async (e) => {
        setLoading(true)
            try {
                e.preventDefault()
                let result = await axios.post(serverUrl + "/api/auth/login",{
                    email,
                    password
    
                },{withCredentials:true})
                setLoading(false)
                setUserData(result.data)
                navigate("/")
                console.log(result)
                 toast.success("Login Successfully")
            } catch (error) {
                setLoading(false)
                console.log(error)
                toast.error(error.response.data.message)

            }
            
        }
  return (
     <div className='w-[100vw] h-[100vh] flex items-center justify-center relative'>
        <div className='w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[20px] rounded-[50%] flex items-center justify-center' onClick={()=>navigate("/")}><FaArrowLeftLong className='w-[25px] h-[25px] text-[white]' /></div>
            <form action="" className='max-w-[900px] w-[90%] h-[600px] flex items-center justify-center flex-col md:items-start gap-[10px]' onSubmit={handleLogin}>
                <h1 className='text-[30px] text-[black]'>Welcome to Airbnb</h1>
                <div className='w-[90%] flex items-start justify-start flex-col gap-[10px]'>
              <label htmlFor="email" className='text-[20px]'>Email</label>
              <input type="text" id='email' className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
              </div> 
              <div className='w-[90%] flex items-start justify-start flex-col gap-[10px] relative  '>
              <label htmlFor="password" className='text-[20px]' >Password</label>
              <input type={show?"text":"password"} id='password' className='w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] ' required onChange={(e)=>setPassword(e.target.value)} value={password} />
              {!show && <IoMdEye className='w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer' onClick={()=>setShow(prev =>!prev)}/>}
              {show && <IoMdEyeOff className='w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer' onClick={()=>setShow(prev =>!prev)}/>}
              </div>
              <button className='px-[50px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg ' disabled={loading}>{loading?"Loading...":"Login"}</button>
              <p className='text-[18px]'>Create new account <span className='text-[19px] text-[red] cursor-pointer' onClick={()=>navigate("/SignUP")}>SignUp</span>
              </p>
            </form>
         
        </div>
  )
}

export default Login
