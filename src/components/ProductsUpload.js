import React, { useEffect, useState } from "react";
import {collection, getDocs } from "firebase/firestore";
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

    return (
        <div className="container">
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h3> {product.name} </h3>
                        <p> price:${product.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ProductsUpload