import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home/index";
import Footer from "./components/footer";
import ProductCards from "./pages/ProductPage/cards";
import ShopPage from "./pages/shop-page";
import ProductDetail from "./product-detail";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cards" element={<ProductCards />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product-detail" element={<ProductDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
