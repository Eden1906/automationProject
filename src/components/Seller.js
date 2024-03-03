import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { imgDB, txtDB } from "../firebaseConfig";
import React, { useState } from "react";

const Seller = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImg, setProductImg] = useState(null);
  const [error, setError] = useState("");
  const types = ["image/png", "image/jpeg"];

  const productImgHandler = (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError("");
    } else {
      setProductImg(null);
      setError("image not valid!");
    }
  };

  const addProduct = (e) => {
    e.preventDefault();
    const uploadProduct = async () => {
      const imgRef = ref(imgDB, "productImages/" + productImg.name);
      await uploadBytes(imgRef, productImg);
      const imgUrl = await getDownloadURL(imgRef);
      try {
        const docRef = await addDoc(collection(txtDB, "products"), {
          name: productName,
          price: parseFloat(productPrice),
          imageUrl: imgUrl,
        });
        setProductName("");
        setProductPrice("");
        setProductImg("");
        setError("");
      } catch (error) {
        console.error("error", error);
        setError("error adding product");
      }
    };
    uploadProduct();
  };

  return (
    <div className="container">
      <br />
      <h2> add products</h2>
      <hr />
      <form autoComplete="off" className="form-group" onSubmit={addProduct}>
        <label htmlFor="product-name">product name </label>

        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setProductName(e.target.value)}
          value={productName}
        />
        <br />
        <label htmlFor="product-price">product price </label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setProductPrice(e.target.value)}
          value={productPrice}
        />
        <br />
        <label htmlFor="product-img">product image </label>
        <input
          type="file"
          className="form-control"
          onChange={productImgHandler}
        />
        <br />
        <button className="btn btn-success btn-md">add</button>
      </form>
      {error && <span>{error}</span>}
    </div>
  );
};

export default Seller;
