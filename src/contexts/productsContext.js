'use client';
const { createContext, useState, useContext } = require("react");

const initialState = {
    loading: false,
    products: [],
    cart: [],
    orders: [],
    maxCartValue: 0,
    cartId: null
}

const ProductsContext = createContext()

export const useProductsValue = () => {
    const value = useContext(ProductsContext);
    return value;
  }; 

export const ProductsContextProvider = ({ children }) => {

    const [state, setState] = useState({...initialState})
    
    const productsAction = (type, payload) => {
        switch (type) {
            case 'SET_LOADING':
                setState(state => ({
                    ...state,
                    loading: payload
                }))
                break;
            case 'SET_CART': {
                setState(state => ({
                    ...state,
                    cart: payload
                }))
                break;
            }
            case 'SET_CART_ID': {
                setState(state => ({
                    ...state,
                    cartId: payload
                }))
                break;
            }
            case 'SET_ALL': {
                let max = 0
                for (const item of payload) {
                    if (item.price > max) max = item.price
                }

                setState(state => ({
                    ...state,
                    products: payload,
                    maxCartValue: max
                }))
                break;
            }
            default:
                break;
        }
    }

    return <>
        <ProductsContext.Provider value={{...state, productsAction}}>
            {children}
        </ProductsContext.Provider>
    </>
}