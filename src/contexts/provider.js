import { AuthContextProvider } from "./authContext";
import { SnackbarContextProvider } from "./snackBarContext";

const Provider = ({ children }) => {
    return (
        <>
            <AuthContextProvider>
                <SnackbarContextProvider>
                    {children}
                </SnackbarContextProvider>
            </AuthContextProvider>
        </>
    );
}
 
export default Provider;