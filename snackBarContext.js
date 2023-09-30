'use client';

import CustomSnackbar from "@/app/components/Snackbar";

const { createContext, useState, useContext } = require("react");

const initialState = {
    open: false,
    onClose: () => {},
    message: '',
    severity: 'info'
}

const SnackbarContext = createContext()

export const useSnackbarValue = () => {
    const value = useContext(SnackbarContext);
    return value;
  }; 

export const SnackbarContextProvider = ({ children }) => {

    const [state, setState] = useState({...initialState})
    
    const toggle = ({open, message, severity}) => {
        let newObj = {...state}
        setState({
            open, message, severity
        })
    }

    return <>
        <SnackbarContext.Provider value={{...state, toggle}}>
            {children}
            <CustomSnackbar
                open={state.open}
                onClose={() => toggle({
                    open: false,
                    message: '',
                    severity: 'info'
                })}
                message={state.message}
                severity={state.severity}
            />
        </SnackbarContext.Provider>
    </>
}