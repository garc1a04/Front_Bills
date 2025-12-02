import { useEffect, useState, type ReactNode } from "react";
import { HeaderUser } from "../../components/HeaderUser/HeaderUser";
import { CardBasic } from "../../components/CardBasic/CardBasic";
import cardLogo from "../../assets/finance.svg"
import cardCalendar from "../../assets/calendar.svg"
import cardWallet from "../../assets/wallet.svg"
import { Rechart } from "../../components/Rechart/Rechart";
import { TableExpenses } from "../../components/TableExpenses/TableExpenses";
import { api } from "../../service/api";
import { ModalExpenses } from "../../components/ModalExpenses/ModalExpenses";
import io from 'socket.io-client';
import "./Analytics.css"
import { socket } from "../../service/socket";

export function Analytics() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [yearBar, setyearBar] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(0);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [analyticsYearData, setanalyticsYearData] = useState(null);
    const[isModal, setIsModal] = useState(false)
    const[isDel, setIsDel] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null);
    const [delExpense, setDelExpense] = useState(null);
    
    const arr = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]

    async function updateGasto(id: string, idCategory: number, type: number | null, Date: string, value: number) {
        if (!editingExpense) return;

        console.log({value, idCategory, type, Date});

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
            loadTable();
        } catch(err) {
            console.error(err);
        }
    }
    async function delGasto(id: string) {
        try {
            await api.delete(`/expenses/${id}`, { withCredentials: true });
            loadDashboard();
            loadTable();
        } catch(err) {
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

    async function loadDashboard() {
        try {
            const response = await api.get(`/expenses/dashboard?year=${yearBar}`);
            setAnalyticsData(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadTable() {
        try {
            const realMonth = month === 0 ? -1 : month - 1;
            const response = await api.get(`/expenses/dashboardYear?year=${year}&month=${realMonth}`);

            setanalyticsYearData(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    function nextMonth() {
        setMonth((month + 1) % arr.length);
    }

    function prevMonth() {
        setMonth((month - 1 + arr.length) % arr.length);
    }

    useEffect(() => {
        loadDashboard();
        loadTable();

        socket.on('new-expense',() => {
            loadDashboard(); 
            loadTable();
        });

        return () => {
            socket.off('new-expense', ()=> { loadDashboard(); 
            loadTable();});
        };
        
    }, [year, month, yearBar]);

    if (!analyticsData || !analyticsYearData) {
        return <p>Loading...</p>;
    }   


    return (
        <>
            <HeaderUser page="analytics"/>
            
             {isModal ? <ModalExpenses
                isOpen={isModal}
                onClose={() => setIsModal(false)}
                onSubmit={editingExpense != null ? updateGasto : null}
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


            <div className="cards_analytics">

                <div className="cards__home">
                    <CardBasic
                        className="card__analytics"
                        iconBgColor="#FFE2E2"
                        icon={<img src={cardLogo} />}
                        iconBadgeColor="#dc4c4c"
                        badge="Annual"
                        title="Total Expenses"
                        valuePrefix="R$ "
                        value={formatValue(analyticsData.totalAnnual)}
                        colorSubtext="#dc4c4c"
                        subtext={analyticsData.percentDifference < 0 ? `0% from last year (${yearBar-1})` :`${analyticsData.percentDifference}% from last year (${yearBar-1})`}
                    />

                    <CardBasic
                        className="card__analytics"
                        iconBgColor="#DBEAFE"
                        icon={<img src={cardCalendar} />}
                        iconBadgeColor="#4493fcff"
                        badge="Monthly"
                        title="Monthly Average"
                        valuePrefix="R$ "
                        value={formatValue(analyticsData.averageMonthly)}
                        colorSubtext="#555"
                        subtext={`Per month average in ${yearBar}`}
                    />

                    <CardBasic
                        className="card__analytics"
                        iconBgColor="#F3E8FF"
                        icon={<img src={cardWallet} />}
                        iconBadgeColor="#c288ffff"
                        badge="Count"
                        title="Total Transactions"
                        valuePrefix=""
                        value={analyticsData.totalTransactions}
                        colorSubtext="#555"
                        subtext={`In ${analyticsData.year}`}
                    />
                </div>

                 <div className="cards_graphics">
                    <Rechart year={yearBar} nextYear={() => {setyearBar(yearBar < new Date().getFullYear() ? yearBar + 1: yearBar)}} prevYear={() => {setyearBar(yearBar-1)}}/>
                 </div>

                 <div className="transactions">
                    <header className="transactions__header">

                        <div className="transactions__header-info">
                            <h1 className="transactions__title">Transaction History</h1>
                            <p className="transactions__subtitle">Browse expenses by year</p>
                        </div>

                        <div className="options">
                                <div className="transactions__year-selector">
                                    <button className="year-selector__btn" onClick={() => setYear(year - 1)}>
                                        <span className="year-selector__icon">{"<"}</span>
                                    </button>

                                    <span className="year-selector__value">{year}</span>

                                    <button className="year-selector__btn" disabled={year == new Date().getFullYear() ? true : false} onClick={() => setYear(year < new Date().getFullYear() ? year + 1: year)}>
                                        <span className="year-selector__icon">{">"}</span>
                                    </button>
                                </div>

                                <div className="transactions__year-selector">
                                    <button className="year-selector__btn" onClick={() => prevMonth()}>
                                        <span className="year-selector__icon">{"<"}</span>
                                    </button>

                                    <span className="year-selector__value">{arr[month]}</span>

                                    <button className="year-selector__btn" onClick={() => nextMonth()}>
                                        <span className="year-selector__icon">{">"}</span>
                                    </button>
                                </div>
                        </div>
                    </header>


                    <TableExpenses onDelete={(e) => {
                        setDelExpense(e);
                        setIsDel(true)
                    }} onEdit={(e) => { 
                        setEditingExpense(e);
                        setIsModal(true);
                    }} lista={analyticsYearData} />

                </div>
            </div>

        </> 
    )
}

interface TableExpensesInterface {
    Category: string;
    DateFormat: string;
    value: number;
    icon_expense: ReactNode;
}