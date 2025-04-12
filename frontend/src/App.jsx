

import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import axios from 'axios'
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
import Analytics from './components/Analytics'
import WhatsAppButton from './components/WhatsappBtn'

const App = () => {
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const role = user?.role || null;
  const isUserLoggedIn = !!user && !!role;
  const [visitor, setVisitor] = useState(0)
  useEffect(() => {
    setVisitor((prevVisitor) => prevVisitor + 1);
  }, [])
  console.log(visitor)

  const updateVisitCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/globalVisitCount`,
      );
      console.log('Updated Visit Count:', response.data); // log the response
    } catch (error) {
      console.error('Error updating visit count:', error); // log the error
    }
  };
  useEffect(() => {
    updateVisitCount()
  },[])
  return (
    <div className='overflow-hidden'>
      {/* <Launch /> */}
      <WhatsAppButton />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/product/:id' element={<ProductDisplay />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/all-products' element={<AllProducts />} />
        <Route path="/products/:category" element={<AllProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/success" element={<SuccessPayment />} />
        <Route path="/payment/cancel" element={<CancelPayment />} />

        {/* Admin Routes - Use ProtectedRoute for access control */}
        <Route path='/admin' element={<ProtectedRoute role={role} requiredRole="admin"><Admin /></ProtectedRoute>} />
        <Route path='/add-product' element={<ProtectedRoute role={role} requiredRole="admin"><AddProduct /></ProtectedRoute>} />
        <Route path='/add-users' element={<ProtectedRoute role={role} requiredRole="admin"><User /></ProtectedRoute>} />
        <Route path='/edit-product/:id' element={<ProtectedRoute role={role} requiredRole="admin"><EditProduct /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute role={role} requiredRole="admin"><AdminOrdersPage /></ProtectedRoute>} />
        <Route path='/analytics' element={<ProtectedRoute role={role} requiredRole="admin"><Analytics /></ProtectedRoute>} />
        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;

