import { useContext } from "react";
import { authDataContext } from "../authContext";

export function useAuth() {
    const context = useContext(authDataContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthContext");
    }

    return context;
}