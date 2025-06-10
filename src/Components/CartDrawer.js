import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // Close icon
import { HiOutlineTrash } from "react-icons/hi"; // Trash icon

const CartDrawer = ({ isOpen, onClose, cart = [], setCart, handleChange }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ Calculate total price dynamically
  useEffect(() => {
    let total = cart.reduce(
      (acc, item) => acc + item.amount * item.discountedPrice,
      0
    );
    setTotalPrice(total);
  }, [cart]);

  // ✅ Remove item from cart
  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[90%] sm:w-[500px] p-[20px] sm:p-[30px] bg-white shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-[15px] sm:pb-[20px]">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <IoClose className="text-2xl cursor-pointer" onClick={onClose} />
        </div>

        <div className="h-[1px] w-full bg-black mb-[20px] sm:mb-[30px]"></div>

        {/* Cart Items */}
        {cart.length > 0 ? (
          <div className="flex flex-col space-y-3 overflow-y-auto max-h-[65vh]">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-[20px] sm:pb-[30px]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[90px] sm:w-[103px] h-[120px] sm:h-[140px] object-cover"
                />
                <div className="flex-1 px-2 sm:px-3">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-xs">Size: {item.sizes?.[0] || "N/A"}</p>
                  <p className="text-red-500 font-semibold">
                    ₹{item.discountedPrice}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleChange(item, -1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                    disabled={item.amount <= 1}
                  >
                    -
                  </button>
                  <span>{item.amount}</span>
                  <button
                    onClick={() => handleChange(item, +1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <HiOutlineTrash
                  className="text-lg text-gray-500 cursor-pointer ml-4"
                  onClick={() => handleRemove(item.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">Your cart is empty</p>
        )}

        {/* Checkout Button */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full p-5 bg-white shadow-lg">
            <button className="w-full h-[50px] bg-[#C5892F] text-black font-semibold text-lg">
              CHECK OUT · ₹{totalPrice}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;



