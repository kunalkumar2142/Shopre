import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleLogin = async () => {
        try{
        console.log("sign in button clicked"); 
        const sucess = await login({
            email : "rahul.kumar@gmail.com",
            password : "jnee"
        })

        if(sucess){
            console.log("signin succesfully.")
            navigate('/dashboard');
        }
        else{
            console.log("signin is failed!")
            navigate('/signin');
        }
        }catch(error){
            console.log("connection error.")
            navigate('/signin');
        }
    } 
    return <Button onClick={handleLogin}>SignIn</Button>
};
