import { useState, type ReactNode } from "react";
import photoHome from "../../assets/wallet.svg"
import photoCalendar from "../../assets/calendar.svg"
import "./CardHome.css"


export function CardHome({title, valueAnnual,valueAvgMontly,quantityTransactions, informations}: CardBasicInterface) {

    const [year, setYear] = useState(new Date().getFullYear())


    return (
        <section className="card_home">
            <div className="card_home_principal">
                <div className="header">
                    <div className="header_description">
                        <img className="header_icon" src={photoHome}/>  
                        <p>Annual Overview</p>
                    </div>

                    <div className="card_home_informations">
                        <img src={photoCalendar}/>
                        {year}
                    </div>
                </div>

                <p className="card_home_principal__title"> {title} </p>
                <h1 className="card_home_principal__value">R$ {valueAnnual} </h1>
            </div>

            <div className="informations">
                <div className="informations_montlyAvg">
                    <p className="informations_montlyAvg__title">Average Monthly</p>
                    <p className="informations_montlyAvg__value">R$ {valueAvgMontly}</p>
                </div>

                <div className="informations_totalTransactions">
                    <p className="informations_totalTransactions__title">Total Transactions</p>
                    <p className="informations_montlyAvg__quantity">{quantityTransactions}</p>
                </div>
            </div>
            
        </section>
    )
}

interface CardBasicInterface {
    title: string;
    valueAnnual: number;
    valueAvgMontly: number;
    quantityTransactions: number;
    informations: ReactNode
}