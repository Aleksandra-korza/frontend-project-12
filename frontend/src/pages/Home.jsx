import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate])
    

    return (
        <div>
            <h1>
            Slack Chat
            </h1>
            <p>
                Welcome!
            </p>
        </div>
    )
}

export default Home