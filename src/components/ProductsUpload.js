import React, { useEffect, useState } from "react";
import {collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { txtDB } from '../firebaseConfig';


const ProductsUpload = () => {
    const [products, setProducts] = useState([])

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

    return (
        <div className="container">     
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id}>
                        <h3> {product.name} </h3>
                        <p> price: {product.price}₪</p>
                        <img src = {product.imageUrl} alt = {product.name} className = "product-image" />
                        <button onClick={() => handleDelete(product.id)}>delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProductsUpload