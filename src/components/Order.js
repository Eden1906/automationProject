import React, {useState} from "react";

const Order = ({ onPlaceOrder }) => {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")

    const handlePlaceOrder = () => {
        if (name && address) {
            onPlaceOrder( {name, address})
            setName("")
            setAddress("")
        } else {
            alert("enter name and address")
        }
    }

    return (
        <div>
            <h2> place your order</h2>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Address:
                <input type = "text" value = {address} onChange={(e) => setAddress(e.target.value)} />
            </label>
            <button onClick={handlePlaceOrder}> place order </button>
        </div>
    )
}

export default Order