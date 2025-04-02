// // import React, { useState, useEffect } from 'react'
// // import { Route, Routes, Navigate } from 'react-router-dom'
// // import Home from './Home'
// // import Signup from './components/Signup'
// // import Login from './components/Login'
// // import ProductDisplay from './components/ProductDisplay'
// // import Admin from './components/Admin'
// // import AddProduct from './components/AddProducts'
// // import User from './components/User'
// // import Profile from './components/Profile'
// // import EditProduct from './components/EditProduct'
// // import AllProducts from './components/AllProducts'
// // import { SuccessPayment, CancelPayment } from './components/Success';
// // import AdminOrdersPage from './components/AdminOrdersPage'
// // import Launch from './components/Launch'

// // // changed the url to the deployed url of the backend
// // const App = () => {
// //   const user = JSON.parse(localStorage.getItem("user")) || null;
// //   console.log(user.role)
// //   // Ensure user is valid before accessing role
// //   const role = user?.role || null;
// //   const isUserLoggedIn = !!user && !!role;
// //   // alert(isUserLoggedIn)


// //   return (
// //     <>
// //       <div className='overflow-hidden'>
// //         {/* <Launch /> */}
// //         <Routes>
// //           <Route path='/' element={<Home />} />
// //           <Route path='/signup' element={<Signup />} />
// //           <Route path='/login' element={<Login />} />
// //           <Route path='/product/:id' element={<ProductDisplay />} />
// //           <Route path='/profile' element={<Profile />} />
// //           <Route path='/all-products' element={<AllProducts />} />
// //           <Route path="/products/:category" element={<AllProducts />} />
// //           <Route path="/payment/success" element={<SuccessPayment />} />
// //           <Route path="/payment/cancel" element={<CancelPayment />} />

// //           {/* Admin Routes */}
// //           {isUserLoggedIn && role === 'admin' ? (
// //             <>
// //               <Route path='/admin' element={<Admin />} />
// //               <Route path='/add-product' element={<AddProduct />} />
// //               <Route path='/add-users' element={<User />} />
// //               <Route path='/edit-product/:id' element={<EditProduct />} />
// //               <Route path='/orders' element={<AdminOrdersPage />} />

// //             </>
// //           ) : null}

// //           {/* Redirect unknown routes to home */}
// //           <Route path="*" element={<Navigate to="/" />} />
// //         </Routes>
// //       </div>
// //     </>
// //   )
// // }

// // export default App


// import React from 'react'
// import { Route, Routes, Navigate } from 'react-router-dom'
// import Home from './Home'
// import Signup from './components/Signup'
// import Login from './components/Login'
// import ProductDisplay from './components/ProductDisplay'
// import Admin from './components/Admin'
// import AddProduct from './components/AddProducts'
// import User from './components/User'
// import Profile from './components/Profile'
// import EditProduct from './components/EditProduct'
// import AllProducts from './components/AllProducts'
// import { SuccessPayment, CancelPayment } from './components/Success';
// import AdminOrdersPage from './components/AdminOrdersPage'

// const App = () => {
//   const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
//   console.log(user?.role); // Prevent error if user is null
//   const role = user?.role || null;
//   const isUserLoggedIn = !!user && !!role;

//   return (
//     <div className='overflow-hidden'>
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/signup' element={<Signup />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/product/:id' element={<ProductDisplay />} />
//         <Route path='/profile' element={<Profile />} />
//         <Route path='/all-products' element={<AllProducts />} />
//         <Route path="/products/:category" element={<AllProducts />} />
//         <Route path="/payment/success" element={<SuccessPayment />} />
//         <Route path="/payment/cancel" element={<CancelPayment />} />

//         {/* Admin Routes */}
//         {isUserLoggedIn && role === 'admin' ? (
//           <>
//             <Route path='/admin' element={<Admin />} />
//             <Route path='/add-product' element={<AddProduct />} />
//             <Route path='/add-users' element={<User />} />
//             <Route path='/edit-product/:id' element={<EditProduct />} />
//             <Route path='/orders' element={<AdminOrdersPage />} />
//           </>
//         ) : (
//           // Redirect to home if user tries to access an admin route
//           <>
//             <Route path='/admin' element={<Navigate to="/" />} />
//             <Route path='/add-product' element={<Navigate to="/" />} />
//             <Route path='/add-users' element={<Navigate to="/" />} />
//             <Route path='/edit-product/:id' element={<Navigate to="/" />} />
//             <Route path='/orders' element={<Navigate to="/" />} />
//           </>
//         )}

//         {/* Redirect unknown routes to home */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   )
// }

// export default App


import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './Home'
import Signup from './components/Signup'
import Login from './components/Login'
import ProductDisplay from './components/ProductDisplay'
import Admin from './components/Admin'
import AddProduct from './components/AddProducts'
import User from './components/User'
import Profile from './components/Profile'
import EditProduct from './components/EditProduct'
import AllProducts from './components/AllProducts'
import { SuccessPayment, CancelPayment } from './components/Success';
import AdminOrdersPage from './components/AdminOrdersPage'
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './components/Checkout'
import Launch from './components/Launch'

const App = () => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role || null;
  const isUserLoggedIn = !!user && !!role;

  return (
    <div className='overflow-hidden'>
      <Launch />
    </div>
  )
}

export default App;


// <Routes>
// <Route path='/' element={<Home />} />
// <Route path='/signup' element={<Signup />} />
// <Route path='/login' element={<Login />} />
// <Route path='/product/:id' element={<ProductDisplay />} />
// <Route path='/profile' element={<Profile />} />
// <Route path='/all-products' element={<AllProducts />} />
// <Route path="/products/:category" element={<AllProducts />} />
// <Route path="/checkout" element={<Checkout />} />
// <Route path="/payment/success" element={<SuccessPayment />} />
// <Route path="/payment/cancel" element={<CancelPayment />} />

// {/* Admin Routes - Use ProtectedRoute for access control */}
// <Route path='/admin' element={<ProtectedRoute role={role} requiredRole="admin"><Admin /></ProtectedRoute>} />
// <Route path='/add-product' element={<ProtectedRoute role={role} requiredRole="admin"><AddProduct /></ProtectedRoute>} />
// <Route path='/add-users' element={<ProtectedRoute role={role} requiredRole="admin"><User /></ProtectedRoute>} />
// <Route path='/edit-product/:id' element={<ProtectedRoute role={role} requiredRole="admin"><EditProduct /></ProtectedRoute>} />
// <Route path='/orders' element={<ProtectedRoute role={role} requiredRole="admin"><AdminOrdersPage /></ProtectedRoute>} />

// {/* Redirect unknown routes to home */}
// <Route path="*" element={<Navigate to="/" />} />
// </Routes>