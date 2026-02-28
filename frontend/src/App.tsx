
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import './App.css'
import  Home from './pages/Home'
import SignIn from './pages/SignIn'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />}/>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
