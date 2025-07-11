import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home/index";
import Footer from "./components/footer";
import ProductCards from "./pages/ProductPage/cards";
import ShopPage from "./pages/shop-page";
import ProductDetail from "./product-detail";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUpPage";
import AddressForm from "./components/addressAndPaymentForm";
import OrderConfirmed from "./pages/OrderConfirmed";
// import { PAYPAL_CLIENT_ID } from "../config";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


function App() {
  

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cards" element={<ProductCards />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/address" element={
          <PayPalScriptProvider options={{
            "client-id": import.meta.env.VITE_APP_PAYPAL_CLIENT_ID ,
            currency: "USD",
            intent: "capture"
          }}>
            {/* Your other components */}
            <AddressForm productPrice={200} /> {/* Pass your actual product price */}
          </PayPalScriptProvider>
        } />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
