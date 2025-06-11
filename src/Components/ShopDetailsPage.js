import React, { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useProductStore } from "../store/product";
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw, Phone, Minus, Plus, ShoppingCart, Zap } from 'lucide-react';

const ProductDetailsPage = ({ handleClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, fetchProducts } = useProductStore();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeType, setSelectedSizeType] = useState('indian');
  const [cartMessage, setCartMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Load item
  useEffect(() => {
    const loadProduct = async () => {
      if (!products || products.length === 0) await fetchProducts();
      const found = products.find((p) => p._id === id);
      setItem(found);
    };
    loadProduct();
  }, [id, products, fetchProducts]);

  // Reset cart message after 3 seconds
  useEffect(() => {
    if (cartMessage) {
      const timer = setTimeout(() => setCartMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartMessage]);

  // Fixed size variant extraction - uses actual API data only
  const getAvailableSizes = () => {
    if (!item?.sizeVariants) return { indian: [], pakistan: [], hasSizes: false };
    
    const indianSizes = item.sizeVariants.indian || [];
    const pakistanSizes = item.sizeVariants.pakistan || [];
    
    return {
      indian: indianSizes,
      pakistan: pakistanSizes,
      hasSizes: indianSizes.length > 0 || pakistanSizes.length > 0
    };
  };

  const handleAddToCart = () => {
    const sizeInfo = getAvailableSizes();
    
    if (sizeInfo.hasSizes && !selectedSize) {
      setCartMessage('Please select a size before adding to cart.');
      return;
    }
    
    if (item.colorVariants && item.colorVariants.length > 0 && !selectedColor) {
      setCartMessage('Please select a color before adding to cart.');
      return;
    }
    
    const cartItem = {
      ...item,
      quantity,
      selectedSize: selectedSize ? `${selectedSizeType.toUpperCase()}: ${selectedSize}` : null,
      selectedColor,
      selectedSizeType,
      price: item.price - (item.price * item.discount) / 100,
      cartId: `${item._id}-${selectedSize || 'nosize'}-${selectedColor || 'nocolor'}-${Date.now()}`
    };
    
    handleClick(cartItem);
    setCartMessage('✓ Added to cart successfully!');
  };

  const buildImageUrl = (imgPath) => {
    if (!imgPath || imgPath.length === 0) return '/placeholder-image.jpg';
    const cleanedPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
    return `https://backend.pinkstories.ae/${cleanedPath}`;
  };

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto mb-6"></div>
          <h1 className="text-2xl font-semibold text-gray-700">Loading product...</h1>
          <p className="text-gray-500 mt-2">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  const sizeInfo = getAvailableSizes();
  const colors = item.colorVariants || [];
  const discountedPrice = item.price ? item.price - (item.price * item.discount) / 100 : 0;
  const productImages = item.images || [];
  const currentSizes = sizeInfo[selectedSizeType] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Message Toast */}
      {cartMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
          cartMessage.includes('✓') 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {cartMessage.includes('✓') && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
            {cartMessage}
          </div>
        </div>
      )}

      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:block">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-full transition-colors ${
                  isWishlisted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Image Gallery Section */}
            <div className="relative bg-gray-50 p-4 sm:p-6 lg:p-8">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg mb-4 group">
                <img
                  src={productImages.length ? buildImageUrl(productImages[selectedImageIndex]) : '/placeholder-image.jpg'}
                  alt={item.productName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.discount > 0 && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{item.discount}% OFF
                    </div>
                  )}
                  {item.stockQuantity < 5 && (
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Only {item.stockQuantity} left!
                    </div>
                  )}
                </div>

                {/* Image Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : productImages.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(selectedImageIndex < productImages.length - 1 ? selectedImageIndex + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square w-16 sm:w-20 bg-white rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 shadow-md hover:shadow-lg ${
                        selectedImageIndex === index 
                          ? 'border-pink-500 ring-2 ring-pink-200 scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={buildImageUrl(image)}
                        alt={`${item.productName} view ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-pink-500/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                      {item.productName}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        SKU: {item.sku}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
                  <div className="flex items-center gap-4 text-lg mb-2">
                    {item.discount > 0 && (
                      <span className="text-gray-500 line-through text-xl">AED {item.price}</span>
                    )}
                    <span className="text-3xl font-bold text-pink-600">AED {discountedPrice.toFixed(2)}</span>
                  </div>
                  {item.discount > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Save AED {(item.price - discountedPrice).toFixed(2)}
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        ({item.discount}% off)
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.5) • 124 reviews</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-6">
                <p className="text-gray-700 leading-relaxed text-base">
                  {item.productDescription}
                </p>
                {item.shortDescription && item.shortDescription !== item.productDescription && (
                  <p className="text-gray-500 mt-3 text-sm italic">
                    {item.shortDescription}
                  </p>
                )}
              </div>

              {/* Size Selection with Type Toggle - Only show if sizes exist */}
              {sizeInfo.hasSizes && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">Select Size:</h3>
                  
                  {/* Size Type Toggle - Only show if both types have sizes */}
                  {sizeInfo.indian.length > 0 && sizeInfo.pakistan.length > 0 && (
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          selectedSizeType === 'indian'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => {
                          setSelectedSizeType('indian');
                          setSelectedSize(null);
                        }}
                      >
                        Indian Sizes
                      </button>
                      <button
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          selectedSizeType === 'pakistan'
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => {
                          setSelectedSizeType('pakistan');
                          setSelectedSize(null);
                        }}
                      >
                        Pakistan Sizes
                      </button>
                    </div>
                  )}

                  {/* Size Options */}
                  {currentSizes.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {currentSizes.map((size) => (
                        <button
                          key={size}
                          className={`px-4 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-200 min-w-[3rem] ${
                            selectedSize === size 
                              ? "bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105" 
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-md"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {selectedSize && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <span className="font-medium">Selected:</span> {selectedSizeType.toUpperCase()} - {selectedSize}
                    </p>
                  )}

                  {/* Show message if no sizes available */}
                  {!sizeInfo.hasSizes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-amber-800 text-sm">
                        <span className="font-medium">Note:</span> Size variants are not available for this product.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Color Selection */}
              {colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">Select Color:</h3>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`flex items-center gap-3 px-4 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          selectedColor === color 
                            ? "border-gray-900 ring-2 ring-gray-300 bg-gray-50 shadow-lg" 
                            : "border-gray-200 hover:border-gray-400 hover:shadow-md"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        <span className="capitalize">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">Quantity:</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="p-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 min-w-[4rem] text-center font-semibold text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(item.stockQuantity, quantity + 1))} 
                      className="p-3 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= item.stockQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Stock:</span> {item.stockQuantity} units available
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <button
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  onClick={() => navigate(`/payment-details/${item._id}`)}
                  disabled={item.stockQuantity === 0}
                >
                  <Zap className="w-5 h-5" />
                  {item.stockQuantity === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
                <button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                  disabled={item.stockQuantity === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {item.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Product Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.brand && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Brand:</span>
                      <span className="font-semibold capitalize">{item.brand}</span>
                    </div>
                  )}
                  {item.material?.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Material:</span>
                      <span className="font-semibold">{item.material.join(', ')}</span>
                    </div>
                  )}
                  {item.weight && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Weight:</span>
                      <span className="font-semibold">{item.weight}</span>
                    </div>
                  )}
                  {item.deliveryTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Delivery:</span>
                      <span className="font-semibold">{item.deliveryTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center sm:col-span-2">
                    <span className="text-gray-600 font-medium">Stock Status:</span>
                    <span className={`font-semibold flex items-center gap-2 ${
                      item.stockQuantity > 5 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        item.stockQuantity > 5 ? 'bg-green-500' : 'bg-orange-500'
                      }`}></div>
                      {item.stockQuantity > 5 ? 'In Stock' : `Only ${item.stockQuantity} left`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">Easy Returns</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Phone className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-gray-600">24/7 Support</p>
                </div>
              </div>

              {/* Care Instructions */}
              {item.careInstructions && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Care Instructions:</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">{item.careInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;



