import { BrowserRouter as Router, Route, Routes, BrowserRouter, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import StoreFront from './pages/StoreFront.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
// import DashboardContent from './admin/DashboardContent.jsx'
import Product from './admin/Product.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders from './admin/Orders.jsx'
import Dashboard from './admin/Dashboard.jsx'
import Categories from './admin/Category.jsx'

import NewDash from './pages/NewDash.jsx'
import MyOrders from './pages/MyOrder.jsx'
import NewProduct from './pages/NewProduct.jsx'
import NewCart from './pages/NewCart.jsx'
import NewCheckout from './pages/NewCheckout.jsx'

import { useState, useEffect } from 'react'
import { checkSession } from './services/auth.js'

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {

    if(location.pathname === '/signup'){
      setLoading(false);
      return;
    }

    if(location.pathname === '/'){
      setLoading(false);
      return;
    }

    if(location.pathname === '/admin'){
      setLoading(false);
      return;
    }

    checkSession().then((data) => {
      if(data){
        setUser(data);
      }else{

        if(location.pathname !== '/login'){
          alert("Session expired. Please login again.");
        }
        // setUser(null);
      }
      setLoading(false);
    });
  }, [location.pathname]);

  if(loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/homepage" : "/login"} />} />
      <Route path="/login" element={user ? <Navigate to="/homepage" /> : <Login setUser={setUser} />}/>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/storefrontend" element={user ? <StoreFront user={user} /> : <Navigate to="/login" />} />
      {/* <Route path="/admindashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} /> */}

      
      {/* <Route path="/dashboard" element={<DashboardContent />} /> */}
      <Route path="/products" element={user ? <ProductPage user={user}/> : <Navigate to='/login' />} />
      <Route path="/cart" element={user ? <Cart user={user}/> : <Navigate to='/login' />} />
      <Route path="/checkout" element={user ? <Checkout /> : <Navigate to='/login' />} />

      {/* new style */}
      <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/storefrontend" />} />
      <Route path="/admin/products" element={user?.role === 'admin' ? <Product /> : <Navigate to="/storefrontend" />} />
      <Route path='/admin/dashboard' element={user?.role === 'admin' ? <Dashboard /> : <Navigate to="/storefrontend" />} />
      <Route path="/admin/orders" element={user?.role === 'admin' ? <Orders /> : <Navigate to="/storefrontend" />} />
      <Route path="/admin/categories" element={user?.role === 'admin' ? <Categories /> : <Navigate to="/storefrontend" />} />


      <Route 
          path="/my-orders" 
          element={user ? <NewDash user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/homepage" 
          element={user ? <NewDash user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/product" 
          element={user ? <NewDash user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/carts" 
          element={user ? <NewCart user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/checkouts" 
          element={user ? <NewCheckout user={user} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/product/:productId" 
          element={user ? <NewDash user={user} /> : <Navigate to="/login" />} 
        />
    </Routes>
  )
}
export default App
