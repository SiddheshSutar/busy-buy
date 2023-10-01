import { AuthContextProvider } from "./authContext";
import { ProductsContextProvider } from "./productsContext";
import { SnackbarContextProvider } from "./snackBarContext";

const Provider = ({ children }) => {
    return (
        <>
            <AuthContextProvider>
                <SnackbarContextProvider>
                    <ProductsContextProvider>
                        {children}
                    </ProductsContextProvider>
                </SnackbarContextProvider>
            </AuthContextProvider>
        </>
    );
}
 
export default Provider;