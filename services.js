import axios from "axios"

export const fetchProducts = async (category) => {
    if(!category) return []
    await axios.get(`https://fakestoreapi.com/products/category/jewelery`)
    .then(res=>res.json())
    .then(json=>{
        console.log('dex: ', json)
        return json
    })
}