import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from "@/pages/Home"
import Shop from "@/pages/Shop"
import Deals from "@/pages/Deals"
import NewArrivals from "@/pages/NewArrivals"
import Category from "@/pages/Category"
import SearchPage from "@/pages/Search"
import Cart from "@/pages/Cart"
import Checkout from "@/pages/Checkout"
import Orders from "@/pages/Orders"
import OrderDetail from "@/pages/OrderDetail"
import ProductDetail from "@/pages/ProductDetail"
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Dashboard from './pages/Dashboard'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Toaster } from '@/components/ui/sonner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/product/:slug' element={<ProductDetail />} />
            <Route path='/deals' element={<Deals />} />
            <Route path='/new' element={<NewArrivals />} />
            <Route path='/categories/:slug' element={<Category />} />
            <Route path='/search' element={<SearchPage />} />
            <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path='/orders/:id' element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          </Routes>
          <Toaster richColors closeButton position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
