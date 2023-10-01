'use client';
const { createContext, useState, useContext } = require("react");

const initialState = {
    loading: false,
    products: [],
    cart: []
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
            case 'SET_ALL':
                setState(state => ({
                    ...state,
                    products: payload
                }))
                break;
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