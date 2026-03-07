import { createContext, useState } from "react";
import { loginUser, registerUser } from "./services/auth.api";

export const authDataContext = createContext();

const AuthContext = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLoginUser = async (usernameorEmail, password) => {
        setLoading(true);

        try {

            const result = await loginUser(usernameorEmail, password);

            if (result.success) {
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

    const value = {
        user,
        loading,
        handleLoginUser,
        handleRegisterUser
    };

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    );
};

export default AuthContext;