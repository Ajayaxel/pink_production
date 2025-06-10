import React from 'react'
import { useNavigate } from "react-router-dom";
import FooterSection from "./FotterSection";


const PaymentPage = ({products}) => {
    const productData = {
        name: "Lorem ipsum dolor sit amet consectetur",
        price: 3500.00,
        size: "28",
        image: "/Rectangle 14.png"
      };
    
  const navigate = useNavigate();

  return (
    <div>
    <div className="min-h-screen bg-gray-50 p-[50px] ">
    <div className=" ">
      <div className="mb-6">
      <button className="text-gray-600 flex items-center" onClick={() => navigate(-1)}>
  <span className="mr-2">←</span> Back
</button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Contact & Payment Info */}
        <div className="space-y-8">
          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact information</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md"
            />
          </section>

          {/* Delivery Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Delivery</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Country"
                className="w-full p-3 border rounded-md"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 border rounded-md"
                />
              </div>
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="House / flat / Floor no"
                className="w-full p-3 border rounded-md"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Phone No"
                  className="w-full p-3 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="w-full p-3 border rounded-md"
                />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <p className="text-sm text-gray-500 mb-4">
              All transactions are secure and encrypted.
            </p>
            <div className="space-y-4">
              <div className="border rounded-md p-3 flex justify-between items-center">
                <span>Credit / Debit card</span>
                <div className="flex space-x-2">
                  <img src="/visa.sxIq5Dot 1.png" alt="Visa" className="h-5" />
                  <img src="/mastercard.1c4_lyMp 1.png" alt="Mastercard" className="h-5" />
                  <img src="/maestro.ByfUQi1c 1.png" alt="Maestro" className="h-5" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                <input
                  type="text"
                  placeholder="House / flat / Floor no"
                  className="w-full p-3 border rounded-md bg-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YY)"
                    className="w-full p-3 border rounded-md bg-white"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full p-3 border rounded-md bg-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Name of the card"
                  className="w-full p-3 border rounded-md bg-white"
                />
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-600">
                    Use shipping address as billing address
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="bg-white  p-6">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="h-[1px] bg-[#636363] my-4"></div>

            <div className="flex items-start mb-6">
              <img
                src={productData.image}
                alt="Product"
                className="w-[100px] h-[100px] object-cover rounded-[2px]"
              />
              <div className="ml-4 flex-1">
                <p className="font-medium">{productData.name}</p>
                <p className="text-gray-500">Size: {productData.size}</p>
                <p className="text-right">₹{productData.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Discount Code"
                  className="flex-1 p-3 border rounded-l-md"
                />
                <button className="px-6 py-3 bg-pink-100 text-pink-800 rounded-r-md">
                  Validate
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between ">
                <span>Sub Total</span>
                <span>₹3500</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹150</span>
              </div>
              <div className="flex justify-between ">
                <span>CGST</span>
                <span>₹150</span>
              </div>
              <div className="flex justify-between font-semibold bg-gray-50 items-center rounded-md bg-[#F1F1F1] h-[60px] px-2 mt-4">
                <span>TOTAL</span>
                <span>₹3650</span>
              </div>
            </div>

            <button className="w-full mt-[130px] bg-[#C5892F] text-black py-4 rounded-md hover:bg-amber-800 transition-colors">
              Check Order
            </button>

            <p className="text-sm text-gray-600 mt-4">
            Your info will be saved to a Shop account. By continuing, you agree to Shop’s Terms of Service and acknowledge the Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterSection />
  </div>
  )
}

export default PaymentPage;