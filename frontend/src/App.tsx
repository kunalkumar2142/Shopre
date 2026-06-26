import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from "@/pages/Home"
import Shop from "@/pages/Shop"
import Deals from "@/pages/Deals"
import NewArrivals from "@/pages/NewArrivals"
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/deals' element={<Deals />} />
          <Route path='/new' element={<NewArrivals />} />
        </Routes>
        <Toaster richColors closeButton position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
