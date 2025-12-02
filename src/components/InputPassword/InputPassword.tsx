import { useState, type ChangeEvent } from "react"
import vis from "../../assets/vis.svg";
import visOFF from "../../assets/visOff.svg";

import "./InputPassword.css"

export function InputPassword({id,label, placeholder, OnChange}: InputInterface) {
    const [isVisible, setIsVisible] = useState(false)
    const [img, setImg] = useState(visOFF)
    const [type, setType] = useState("password")

    function visibleON() {
        setIsVisible(true);
        setImg(vis);
        setType("text")
    }

    function visibleOFF() {
        setIsVisible(false);
        setImg(visOFF);
        setType("password")
    }

    return (
        <div className="password_input">
            <label htmlFor={id}>{label}</label>
            <input className="password_trade" type={type} placeholder={placeholder} onChange={OnChange}></input>
            <button className="button_password" onMouseDown={visibleON} onMouseUp={visibleOFF} onMouseLeave={visibleOFF}
            onTouchStart={visibleON} onTouchEnd={visibleOFF}>
                <img className="button_img" src={img}></img>
            </button>
        </div>
    )
}

interface InputInterface {
    id: string,
    label: string
    placeholder: string,
    OnChange(event: ChangeEvent<HTMLInputElement>): void,
}