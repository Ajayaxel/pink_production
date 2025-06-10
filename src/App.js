
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import GalleryCards from "./Components/GalleryCards";
import BannerCard from "./Components/BannerCard";
import HandCraftedCards from "./Components/HandCraftedCards";
import FooterSection from "./Components/FotterSection";
import FotterImage from "./Components/FotterImage";
import ProductDetailsPage from "./Components/ShopDetailsPage";
import ShopePage from "./Components/ShopePage";
import PaymentPage from "./Components/PaymentPage";
import CartDrawer from "./Components/CartDrawer";
import list from "./data";
import LoginPage from "./Components/LoginPage";
import RegisterLogin from "./Components/RegisterLogin";
import BestSellerpage from "./Components/BestSellerpage";
import ExclusiveColletionpage from "./Components/ExclusiveColletionpage";
import PartyWearsPage from "./Components/PartyWearsPage";
import SemipartyWearPage from "./Components/SemipartyWearPage";
import CoSetsPage from "./Components/CoSetsPage";
import IndoOutfits from "./Components/IndoOutfits";



function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation(); // ✅ Get current route

  const handleClick = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, amount: (cartItem.amount || 1) + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, amount: 1, price: item.price || 0 }];
      }
    });
  };

  const handleChange = (item, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, amount: Math.max(1, (cartItem.amount || 1) + delta) }
            : cartItem
        )
        .filter((cartItem) => cartItem.amount > 0)
    );
  };

  return (
    <>
      {/* ✅ Hide Header & Navbar on Login and Register Pages */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <>
          <Header cart={cart} setIsCartOpen={setIsCartOpen} />
          <Navbar />
        </>
      )}

      <Routes>
        <Route
          path=""
          element={
            //home page components
            <>
              <Hero />
              <GalleryCards />
              <BannerCard />
              <HandCraftedCards />
              <FotterImage />
              <FooterSection />
            </>
          }
        />
        <Route path="/shop-details/:id" element={<ProductDetailsPage products={list}  handleClick={handleClick} />} />
        <Route path="/party-wears" element={<PartyWearsPage products={list}/>} />
        <Route path="/shop" element={<ShopePage products={list} />} />
        <Route path="/best-seller" element={<BestSellerpage products={list} />} />
        <Route path="/exclusive-collection" element={<ExclusiveColletionpage products={list} />} />
        <Route path="/payment-details/:id" element={<PaymentPage products={list} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterLogin />} />
        <Route path="/semi-party-wears" element={<SemipartyWearPage />} />
         <Route path="/co-ord-sets" element={<CoSetsPage />} />
         <Route path="/indo-western-outfits" element={<IndoOutfits/>} />



      </Routes>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        handleChange={handleChange}
      />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;








