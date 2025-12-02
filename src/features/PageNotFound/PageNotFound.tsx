import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import "./PageNotFound.css"

export function PageNotFound() {
    const navigate = useNavigate();

    return (
       <div className="not_found">
            <div className="container_not_found">
                <h1 className="not_found__title"> 404 :( </h1>
                <h2 className="not_found__subtitle"> Page Not Found </h2>
                <p className="not_found__p"> The request URL page was not found on this server </p>
                <Button classname="" name="Go to homepage" OnClick={() => navigate("/")}/>
            </div>
       </div>
    )
}