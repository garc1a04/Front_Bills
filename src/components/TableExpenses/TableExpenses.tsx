import { useState, type ReactNode } from "react"
import "./TableExpenses.css"
import { TipoGastoIcon } from "../TipoGastoIcons/TipoGastoIcons";

export function TableExpenses({lista, onDelete, onEdit}: TableExpensesProps) {

    function formatValue(valor: number) {
        if (isNaN(valor) || valor === null || valor === undefined) {
            return "0,00"; 
        }

        if (Math.abs(valor) < 1000) {
            return Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2
            }).format(valor);
        }
        
        else {
            return Intl.NumberFormat("pt-BR", {
                notation: "compact",
                maximumSignificantDigits: 3 
            }).format(valor);
        }
    }
    
    return (
        <div className="datas_expenses">
            {
            lista.length > 0 ?

            lista.map((e, i) => (
                <div className="card_table" key={i}>
                    <div className="description">
                        <div className="div_icon">
                            <TipoGastoIcon  classname="icon" category={e.Category} tipo={e.typeExpense}/>
                        </div>
                        
                        <div className="description_informations">
                            <p className="description_title">{e.typeExpense == 'Nothing' ? e.Category: e.typeExpense }</p>
                            <p className="description_date">{e.DateFormat}</p>
                        </div>
                    </div>

                    <div className="price_edit_remove">

                        <p className="card_table__value">R$ {formatValue(e.value)}</p>

                        <div className="edit_remove" >
                            <button className="btn edit" onClick={() => onEdit(e)}>
                                 <span className={`material-symbols-rounded`}>
                                    Edit
                                 </span>
                            </button>

                            <button className="btn remove" onClick={() => onDelete(e)}>
                                <span className={`btn material-symbols-rounded`}>
                                    Delete
                                 </span>
                            </button>
                        </div>
                    </div>
                </div>
            ))
            :

            <p className="No_result">No result :(</p>
        }
        </div>
    )
}

interface TableExpensesProps {
    lista: TableExpensesInterface[];
    onEdit: (e: any) => void;
    onDelete: (e: any) => void;
}

interface TableExpensesInterface {
    Category: string;
    idCategory: number;
    typeExpense: string;
    typeExpenses: number;
    DateFormat: string;
    Date: string;
    value: number;
    icon_expense: ReactNode;
}