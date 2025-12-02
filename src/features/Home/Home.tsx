import { useEffect, useState, type ReactNode } from "react";
import { HeaderUser } from "../../components/HeaderUser/HeaderUser";
import { ModalExpenses } from "../../components/ModalExpenses/ModalExpenses";
import { CardBasic } from "../../components/CardBasic/CardBasic";
import { CardHome } from "../../components/CardHome/CardHome";
import { TableExpenses } from "../../components/TableExpenses/TableExpenses";
import { Button } from "../../components/Button/Button";
import { Link } from "react-router-dom";
import cardLogo from "../../assets/finance.svg"
import cardCalendar from "../../assets/calendar.svg"
import plus from "../../assets/add.svg";
import { api } from "../../service/api";
import io from 'socket.io-client';
import "./Home.css"
import { socket } from "../../service/socket";

export function Home() {
    const[isModal, setIsModal] = useState(false)
    const[isDel, setIsDel] = useState(false)
    const [dashboardData, setDashboardData] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [delExpense, setDelExpense] = useState(null);
    async function addGasto(id: string, idCategory: number, type: number | null, dateValue: string, value: number) {
    if(!value || !idCategory) return;
    try {
        const payload = {
            value: Number(value), 
            type: !type ? 20 : Number(type),
            id_category: Number(idCategory), 
            date_payment: dateValue 
        };

        console.log("Enviando payload:", payload); 

        const response = await api.post("/expenses", payload, { withCredentials: true });
        
        setIsModal(false);
        loadDashboard();
        return {ok: true}
    } catch(e) {
        console.error("Erro ao salvar:", e.response?.data?.message);
        setIsModal(false);
        return {err: e}
    }
}
    
    async function updateGasto(id: string, idCategory: number, type: number | null, Date: string, value: number) {
        if (!editingExpense) return;

        try {
            await api.put(`/expenses/${id}`, {
                value: value,
                type: !type ? 20 : type,
                id_category: idCategory,
                date_payment: Date,
                idCategory: idCategory
            }, { withCredentials: true });

            setIsModal(false);      
            setEditingExpense(null);
            loadDashboard();
        } catch(err) {
            console.error(err);
        }
    }

    async function delGasto(id: string) {
        try {
            await api.delete(`/expenses/${id}`, { withCredentials: true });
            loadDashboard();
        } catch(err) {
            console.error(err);
        }
    }

    async function loadDashboard() {
        try {
            const response = await api.get("/expenses/dashboard");
            setDashboardData(response.data);
        } catch (err) {
            console.error(err);
        }
    }

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

    useEffect(() => {
        loadDashboard();
        socket.on('new-expense',() => {loadDashboard();});

        return () => {
            socket.off('new-expense');
        };
    }, []);

    if (!dashboardData) return <p>Loading...</p>;
    
    return (
        <>
            <HeaderUser page="home"/>

            {isModal ? <ModalExpenses
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                onSubmit={editingExpense != null ? updateGasto : addGasto}
                defaultData={editingExpense}
            /> : undefined}

            { isDel 
            ? 
                <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                    <h2>Tem certeza?</h2>
                    </div>
                    
                    <div className="modal-body">
                    <p>Você deseja realmente apagar este gasto? Essa ação não poderá ser desfeita.</p>
                    </div>

                    <div className="modal-actions">
                    <button 
                        className="btn-cancel" 
                        onClick={() => {setDelExpense(null);setIsDel(false)}}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirm" 
                        onClick={() => {setIsDel(false);delGasto(delExpense?.id)}}
                    >
                        Sim, apagar
                    </button>
                    </div>
                </div>
                </div>
            :   
                undefined
            }
            
            <div className="cards">
                <div className="cards_container">
                    <div className="left">
                        <CardHome title="Total Annual Spending" valueAnnual={formatValue(dashboardData.totalAnnual)}valueAvgMontly={formatValue(dashboardData.averageMonthly)} quantityTransactions={dashboardData.totalTransactions} informations={<p>this mouth</p>}/>  
                    </div>

                    <div className="card_right">
                        <CardBasic icon={<img className="logo_card" src={cardLogo}/>} title="Monthly Spending" valuePrefix="R$ " value={formatValue(dashboardData.monthlySpending)} badge="This Month" iconBadgeColor="black" iconBgColor="#ff7373" iconBgBadge="" />  
                        <CardBasic icon={<img className="logo_card" src={cardCalendar}/>} title="Average Daily" valuePrefix="R$ " value={formatValue(dashboardData.averageDaily)} badge="Daily Avg" iconBadgeColor="black" iconBgColor="#DBEAFE" iconBgBadge="#F3F4F6"/>  
                    </div>
                </div>


                <div className="cards_tables">

                    <div className="cards_tables__actions">

                        <div className="cards_tables__actions__informations">
                            <h1 className="cards_tables__actions__informations__title"> Recent Transactions </h1>
                            <p className="cards_tables__actions__informations__title">Your latest spending activities</p>
                        </div>


                        <div className="cards_tables__actions__actions">
                            <Button
                                classname="button_actions"
                                name="Add Expenses"
                                OnClick={() => {
                                    setEditingExpense(null);
                                    setIsModal(true);
                                }}
                                image={<img className="button_img" src={plus}/>}
                            />
                            <Link className="view_all" to="/analytics"> View All </Link>
                        </div>
                    </div>

                    <TableExpenses onDelete={(e) => {
                        setDelExpense(e);
                        setIsDel(true)
                    }} onEdit={(e) => { 
                        setEditingExpense(e);
                        setIsModal(true);
                    }} lista={dashboardData.transactions.slice(0,6)} />
                </div>
            </div>
        </> 
    )
}
               