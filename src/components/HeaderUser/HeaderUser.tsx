import "./HeaderUser.css"
import logo from "../../assets/logo.png"
import logoff from "../../assets/logoff.svg"
import { Link } from "react-router-dom"
import { Button } from "../Button/Button"
import { api } from "../../service/api"
import { useEffect, useState } from "react"

export function HeaderUser({page}: HeaderUserInterface) {

    const [nameUser, setNameUser] = useState('nothing')
    
    async function getName() {
        try {
            const res = await api.get("/auth/user");
            console.log(res)
            setNameUser(res.data.name)


        } catch(e) {
            console.log(e)
        }
    }

    async function logout() {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
            window.location.href = "/";
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(()=> {
        getName();
    },[nameUser])


    return (
        <header className="header_user">
            <div className="logo_header">
                <img className="logo" src={logo}/>
                <h1 className="title">Bills</h1>
            </div>

            <div className="list_header">
                <ul className="navbar">
                    {page == "home" ? <li> <Link className="active_header" to={'/home'}>Home</Link> </li> : <li> <Link to={'/home'}>Home</Link> </li> }
                    {page == "analytics" ? <li> <Link className="active_header" to={'/analytics'}>Analytics</Link> </li> : <li> <Link to={'/analytics'}>Analytics</Link> </li>}
                </ul>
            </div>

            <div className="profile">
                <p className="profile_person">Hi {nameUser}!</p>
                <Button classname="btn_header" name="Logout" OnClick={logout}
                    image={<img src={logoff}/>}/>
            </div>
        </header>
    )
}

interface HeaderUserInterface {
    page: string
}