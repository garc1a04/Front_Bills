
import { useEffect, useState } from "react";
import "./CardAcess.css"

export function CardAcess({showCardPrp, text, classname, nameIcon}: CardAcessProps) {
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
            setTimeout(() => {
                setShowCard(showCardPrp);
            }, 500);
    }, [showCardPrp]);

    return (
        <>
            {showCard 
            ? 
            <div className={`${classname} card_acess`}>
                
                <div className="material-symbols-rounded">
                    {nameIcon}
                </div>
                
                <p className="card__text">{text}</p>
            </div>
            :
            undefined
            }
        </>
    )
}


interface CardAcessProps {
    text: string;
    classname: string;
    nameIcon: string;
    showCardPrp: boolean;
}