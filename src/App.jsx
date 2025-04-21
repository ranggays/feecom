import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import StoreFront from './pages/StoreFront.jsx'
import { useState, useEffect } from 'react'
import { checkSession } from './services/auth.js'

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession().then((data) => {
      if(data){
        setUser(data);
      }else{
        alert("Session expired. Please login again.");
        setLoading(false);
      }
    });
  }, []);

  if(loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/storefrontend" : "/login"} />} />
        <Route path="/login" element={user ? <Navigate to="/storefrontend" /> : <Login setUser={setUser} />}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/storefrontend" element={user ? <StoreFront user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
