import React, { useEffect, useState } from "react";
import {collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { txtDB } from '../firebaseConfig';
import Order from './Order'


const ProductsUpload = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [showCartModal, setShowCartModal] = useState(false)

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

    return (
        <div className="container">     
            <button onClick={toggleCartModal}>shopping cart</button>
            {showCartModal && (
                <div className="cart">
                <ul>
                    {cart.map((cartItem) => (
                        <li key={cartItem.id}>
                            <p> {cartItem.name} - {cartItem.price}₪</p>
                        </li>
                    ))}
                </ul>
                <button onClick={handleClearCart}>clear cart</button>
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