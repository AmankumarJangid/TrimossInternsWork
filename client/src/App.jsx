import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './pages/home/index'
import Footer from './components/footer'
import ProductCards from './pages/ProductPage/cards'
import ShopPage from './pages/shop-page'
import ProductDetail from './product-detail'
import LoginPage from './pages/Login'
import SignupPage from './pages/SignUpPage'
import AddressForm from './components/addressAndPaymentForm'
import OrderConfirmed from './pages/OrderConfirmed'
// import { PAYPAL_CLIENT_ID } from "../config";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useAuthCheck from './utils/useAuthCheck'
import PrivateAdminRoute from './routes/privateAdminRoutes'
import NotFound from './pages/pageNotFound404'
import AdminLayout from './layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'

function App () {
  useAuthCheck()

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/cards' element={<ProductCards />} />
        <Route path='/shop' element={<ShopPage />} />
        <Route path='/product-detail' element={<ProductDetail />} />
        <Route path='/address' element={<AddressForm />} />{' '}
        {/* Pass your actual product price /*productPrice={1}*/}
        <Route path='/order-confirmed' element={<OrderConfirmed />} />
        

        {/* Admin Pages */}
        <Route path="/admin" element={<PrivateAdminRoute> <AdminDashboard /> </PrivateAdminRoute>}>
          {/* <Route path='add-product' element={ <AddProduct /> } /> */}
        </Route>
        
        {/*Catch all route for not found page*/ }
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App
