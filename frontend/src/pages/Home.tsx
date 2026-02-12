import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const Home = () => {
    return <div> 
        <Link to="/signin">
            <Button>Login</Button>
        </Link>
    </div>
}

export default Home;