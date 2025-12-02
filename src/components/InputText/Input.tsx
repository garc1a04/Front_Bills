import type { ChangeEvent } from "react"
import "./Input.css"

export function Input({id,label,type, placeholder,value,classname, OnChange, OnClick}: InputInterface) {

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input onClick={OnClick} className={`${classname}`} value={value} type={type} placeholder={placeholder} onChange={OnChange}></input>
        </>
    )
}

interface InputInterface {
    id: string,
    label: string
    type: string,
    placeholder: string,
    classname: string
    value: any;
    OnClick: () => void;
    OnChange(event: ChangeEvent<HTMLInputElement>): void;
}