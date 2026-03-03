import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleLogin = async () => {
        const sucess = await login({
            email : "rahul.kumar@gmail.com",
            password : "jnee"
        })

        if(sucess){
            navigate('/dashboard');
        }
        else{
            navigate('/signin');
        }
    } 
    return <Button onClick={handleLogin}>SignIn</Button>
};
