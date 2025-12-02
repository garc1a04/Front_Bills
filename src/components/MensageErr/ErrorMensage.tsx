import './ErrorMensage.css'

export function ErrorMensage({classname, nome}: errInterface) {
    const baseClasses = "compErr";
    return <p className={`${baseClasses} ${classname || ""}`}> {nome} </p>
}

interface errInterface {
    classname: string;
    nome: string;
}