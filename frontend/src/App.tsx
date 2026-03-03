import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from "@/pages/Home"
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import { SignIn } from './pages/SignIn'

function App() {

  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
