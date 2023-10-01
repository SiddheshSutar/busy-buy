import axios from "axios"

export const fetchProducts = async (category) => {
    if(!category) return []

    return await axios.get(`https://fakestoreapi.com/products/category/${category}`)
    .then(res=>{
        if(!res.data) return []
        return res.data
    })
}