import { createContext, useState,useEffect } from "react";
import { loginUser, registerUser, logoutUser, getMe } from "./services/auth.api";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {

    const [user, setUser] = useState(null);
    // start in loading state so protected routes wait for auth check on refresh
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // run auth check on mount; it will clear loading when done
        handlegetMe();
    }, []);

    const handleLoginUser = async (usernameorEmail, password) => {
        setLoading(true);

        try {

            const result = await loginUser(usernameorEmail, password);

            if (result.success) {
                // set the authenticated user so protected routes allow navigation
                setUser(result.data.user);
            }

            return result;

        } catch (error) {

            return {
                success: false,
                message: error.message
            };

        } finally {
            setLoading(false);
        }
    };

    const handleRegisterUser = async (username, email, password) => {
        setLoading(true);

        try {

            const result = await registerUser(username, email, password);

            return result;

        } catch (error) {

            return {
                success: false,
                message: error.message
            };

        } finally {
            setLoading(false);
        }
    };

    const handleLogoutUser = async () => {

        setLoading(true)

        try {

            const result = await logoutUser()

            if(result.success){
                setUser(null)
            }

            return result

        } catch (error) {

            return {
                success:false,
                message:error.message
            }

        } finally {

            setLoading(false)

        }
    }

    const handlegetMe = async ()=>{
        setLoading(true)

        try {

            const result = await getMe();

            if (result.success) {
                setUser(result.data.user);
            }

            return result

        } catch (error) {

            return {
                success:false,
                message:error.message
            }

        } finally {

            setLoading(false)

        }
    }

    const value = {
        user,
        loading,
        handleLoginUser,
        handleRegisterUser,
        handleLogoutUser
        // note: handlegetMe is internal and not exposed
    };

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    );
};

export default AuthContext;