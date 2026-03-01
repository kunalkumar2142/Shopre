import { Button } from '../components/ui/button'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"

const SignIn = () => {
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
            navigate('/signIn');
        }
    } 
    return <Button onClick={handleLogin}>SignIn</Button>
};

export default SignIn;