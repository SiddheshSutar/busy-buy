'use client';
const { createContext, useState, useContext } = require("react");

const initialState = {
    users: [],
    signedInUser: {

    }
}

const AuthContext = createContext()

export const useUserValue = () => {
    const value = useContext(AuthContext);
    return value;
  }; 

export const AuthContextProvider = ({ children }) => {

    const [state, setState] = useState({...initialState})
    
    const userAction = (type, payload) => {
        switch (type) {
            case 'ADD':
                
                break;
        
            default:
                break;
        }
    }

    return <>
        <AuthContext.Provider value={{...state, userAction}}>
            {children}
        </AuthContext.Provider>
    </>
}