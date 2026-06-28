import axios from 'axios';

const API_URL = "http://localhost:8080/auth";

export const register = async (name, email, password) => {
    try{
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        return response.data;
    }catch(error){
        console.error("Registration error:", error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("currentUser_id",response.data.id);
        localStorage.setItem("currentName",response.data.name);
        return response.data; // ✅ ADD THIS LINE

    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


