import React, { useEffect, useState } from "react";
import {collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { txtDB } from '../firebaseConfig';
import Order from './Order'
import shoppingCartImage from '../shopping-cart.png'



const ProductsUpload = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [showCartModal, setShowCartModal] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0)
    const [couponCode, setCouponeCode] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)
    const couponDiscount = 0.05;

    useEffect (() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(txtDB, "products"))
                const productsData = querySnapshot.docs.map((doc) =>  ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setProducts(productsData)
            } catch (error) {
                console.error("error fetching products", error)
            }
        }
        fetchProducts()
    }, [])

    const handleDelete = async (productId) => {
        const isPasswordCorrect = prompt("enter password")
        if (isPasswordCorrect !== null) {
        if (isPasswordCorrect === '1234') {
            try {
                await deleteDoc(doc(txtDB, "products", productId))
                setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId))
            } catch (error) {
                console.error("error deleting product", error)
            }
        } else {
            alert("incorrect password")
        }
    }
}

const handleAddToCart = (productId) => {
    const productToAdd = products.find(product => product.id === productId)
    setCart((prevCart) => [...prevCart, productToAdd])
}

const handleClearCart = () => {
    setCouponApplied(false)
    setCart([])
}

const toggleCartModal = () => {
    setShowCartModal(!showCartModal)
}

const handlePlaceOrder = async (orderDetails) => {
    try {
        const orderDocRef = await addDoc(collection(txtDB, "orders"), {
            products: cart,
            name: orderDetails.name,
            address: orderDetails.address,
        })
        console.log(orderDocRef.id)
        setCart([])
        setShowCartModal(false)
    } catch (error) {
        console.error("error", error)
    }
}

const updateTotalAmount = () => {
    const total = cart.reduce((acc, item) => acc + item.price, 0)
    setTotalAmount(total)
}
useEffect(() => {
    updateTotalAmount()
}, [cart])

const handleApplyCoupon = () => {
    if (couponCode === "SCE2024" && cart.length > 0 && !couponApplied) {
        setTotalAmount((prevTotal) => prevTotal * (1 - couponDiscount))
        setCouponApplied(true)
    } else if(cart.length === 0) {
        alert("Cart is empty")
    } else if (couponApplied) {
        alert("Coupon has already been applied")
    } else {
        alert("Invalid coupon code")
    }
}

    return (
        <div className="container">   
            <div className="coupon-banner">
                <p> NEW COUPON CODE FOR 5% DISCOUNT! - SCE2024</p>
            </div> 
            <button onClick={toggleCartModal}>
                <img src={shoppingCartImage} alt = "Shopping Cart" style = {{width: '40px', height: '40px'}}/>
            </button>
            {showCartModal && (
                <div className="cart">
                <ul>
                    {cart.map((cartItem) => (
                        <li key={cartItem.id}>
                            <p> {cartItem.name} - {cartItem.price}₪</p>
                        </li>
                    ))}
                </ul>
                <p> Total amount: {totalAmount}₪</p>
                <button onClick={handleClearCart}>clear cart</button>
                <div className="coupon-container">
                    <p> Coupon Code:</p>
                    <input 
                        type = "text"
                        value = {couponCode}
                        onChange={(e) => setCouponeCode(e.target.value)}
                    />
                    <button onClick={handleApplyCoupon}>Apply Coupon</button>
                </div>
                <Order onPlaceOrder={handlePlaceOrder} />
            </div>
            )}     
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id}>
                        <h3> {product.name} </h3>
                        <p> price: {product.price}₪</p>
                        <img src = {product.imageUrl} alt = {product.name} className = "product-image" />
                        <button onClick={() => handleDelete(product.id)}> delete </button>
                        <button onClick={() => handleAddToCart(product.id)}> add to cart </button>
                        
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProductsUpload