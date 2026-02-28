import React from "react";
import { Button } from '../components/ui/button'
import { useNavigate } from "react-router-dom";
import { UseAuth, useAuth } from "../context/AuthContext"

const SingIn = () => {
    const navigate = useNavigate();
    const { login } = UseAuth();
    const handleLogin = async () => {
        const sucess = await login({
            email : "rahul.kumar@gmail.com",
            password : "jnee"
        })

        if(sucess){
            navigate('/dashboard');
        }
        else{
            navigate('/signIn');
        }
    } 
    return <Button onClick={handleLogin}>SignIn</Button>
};

export default SingIn;