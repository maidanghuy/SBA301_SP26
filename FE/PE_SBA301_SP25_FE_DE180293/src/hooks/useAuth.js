import { useContext } from "react";
import { AuthContext } from "../store/auth/AuthContext";

export default function useAuth() {
    return useContext(AuthContext);
}