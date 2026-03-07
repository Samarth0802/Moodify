import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:5000/api/auth",
    withCredentials:true
})

export async function loginUser(usernameorEmail, password) {

    try {

        const response = await api.post('/login',{
            usernameorEmail,password
        })
        return {
            success: true,
            data: response.data
        }

    } catch (error) {

        return {
            success: false,
            message: error.response?.data?.message || error.message
        }
    }
}

export async function registerUser(username, email, password) {
    try {

        const response = await api.post('/register', {
            username,
            email,
            password
        });

        return {
            success: true,
            data: response.data
        };

    } catch (error) {

        return {
            success: false,
            message: error.response?.data?.message || error.message
        };

    }
}

export async function logoutUser(){
    try{
        const response = await api.post('/logout')

        return{
            success:true,
            data:response.data
        }
    }
    catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
}

export async function getMe(){
    try{
        const response = await api.get('/get-me')

        return{
            success:true,
            data:response.data
        }
    }
    catch(error){
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
}