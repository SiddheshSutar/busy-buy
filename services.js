import axios from "axios"

export const fetchProducts = async () => {

    return await axios.get(`https://fakestoreapi.com/products`)
    .then(res=>{
        if(!res.data) return []
        console.log('hex c: ', res.data)

        return res.data
    })
}