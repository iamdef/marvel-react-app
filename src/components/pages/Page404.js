import ErrorMessage from "../errorMessage/ErrorMessage";
import { useNavigate } from "react-router-dom";


const Page404 = () => {

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    }

    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist!</p>
            <div className="centerer">
            <button
                className="button button__main"
                onClick={handleClick}>
                <div className="inner">go back</div>
            </button>
            </div>
        </div>
    )
}

export default Page404;

