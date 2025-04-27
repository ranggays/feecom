import { BrowserRouter as Router, Route, Routes, BrowserRouter, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import StoreFront from './pages/StoreFront.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import DashboardContent from './admin/DashboardContent.jsx'
import Product from './admin/Product.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
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
      <Route path="/" element={<Navigate to={user ? "/storefrontend" : "/login"} />} />
      <Route path="/login" element={user ? <Navigate to="/storefrontend" /> : <Login setUser={setUser} />}/>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/storefrontend" element={user ? <StoreFront user={user} /> : <Navigate to="/login" />} />
      {/* <Route path="/admindashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} /> */}
      <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/storefrontend" />} />
      <Route path="/dashboard" element={<DashboardContent />} />
      <Route path="/admin/products" element={user?.role === 'admin' ? <Product /> : <Navigate to="/storefrontend" />} />
      <Route path="/products" element={<ProductPage user={user}/>} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  )
}
export default App
