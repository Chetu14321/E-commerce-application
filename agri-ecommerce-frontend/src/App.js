
import React from "react";
import { BrowserRouter,Route,Routes } from "react-router-dom";
import {ToastContainer} from "react-toastify"
import Home from "./pages/Default/Home";
import Login from "./pages/Auth/Login";
import Rigister from "./pages/Auth/Register";
import Dashboard from "./pages/Default/Dashboard";
import NotFound from "./pages/Default/NotFound";
import Menu from "./Component/Menu";
import ProtectedRoute from "./AuthGuard/ProtectRoute";
import AdminDashboard from "./Admin/AdminDashboard";
import useAuth from "./Hooks/useAuth";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ProductDetails from "./product/productDetaild";
import Cart from "./product/Cart";
import Userdata from "./Admin/Userdata";
import Products from "./Admin/Products.jsx";
import Orders from "./Admin/Orders.jsx";
import Payment from "./product/Payment.jsx";
import PrivacyPolicy from "./privacyPolicyList/privacyPolicy.js";
import TermsAndConditions from "./privacyPolicyList/Terms.js";
import CancellationPolicy from "./privacyPolicyList/RefundPolicy.js";
import ShippingPolicy from "./privacyPolicyList/Shipping.js";
import ContactUs from "./privacyPolicyList/Contact.js";
import PaymentSuccess from "./product/Paymentsuccess.jsx";






function App() {
  const {user}=useAuth()
  return (
  <BrowserRouter>
        <Menu/>
        <ToastContainer autoClose={4000} position="top-right"/>
            
                <div className="container mt-4"></div>
        <Routes>
          
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Rigister />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route  element={<ProtectedRoute/>}>
            <Route path={"/dashboard/:role"} element={user?.role==="admin" ?<AdminDashboard/> :<Dashboard />} />

          </Route>
           <Route path="/product/:id" element={<ProductDetails />} />
           <Route path="/cart" element={<Cart/>}/>
    


      
          <Route path="*" element={<NotFound />} />
           
            <Route path="/users" element={< Userdata/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/orders" element={<Orders/>} />
            <Route path="/payment" element={<Payment />} />

            {/* terms and conditions */}
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/terms" element={<TermsAndConditions/>}/>
            <Route path="/refund" element={<CancellationPolicy/>}/>
            <Route path="/shipping" element={<ShippingPolicy/>}/>
            <Route path="/contact" element={<ContactUs/>}/>


            <Route path="/payment-success" element={<PaymentSuccess />} />

        </Routes>


  </BrowserRouter>
  );
}

export default App;
