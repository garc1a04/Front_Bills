import { use, useEffect, useState } from "react";
import { Input } from "../../components/InputText/Input";
import { Button } from "../../components/Button/Button";
import closeImg from "../../assets/close.svg"
import './ModalExpenses.css'
import { api } from "../../service/api";
import { ErrorMensage } from "../MensageErr/ErrorMensage";

export function ModalExpenses({isOpen, onClose, onSubmit, defaultData }: ModalInterface) {
    const [valor, setValor] = useState(0.0);
    const [displayValue, setDisplayValue] = useState("0,10");

    const [category, setCategory] = useState(0);
    const [tipoValor, setTipoValor] = useState(0);
    const [date, setDate] = useState(new Date().toISOString());
    const [categories, setCategories] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);

    const [errClass, setErrClass] = useState("")
    const [Error, setError] = useState("");

    function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        inputValue = inputValue.replace(/[^0-9,]/g, "");
        const parts = inputValue.split(',');
        if (parts.length > 2) {
            inputValue = parts[0] + ',' + parts.slice(1).join('');
        }

        setDisplayValue(inputValue);
        const numericValue = Number(inputValue.replace(',', '.'));
        setValor(numericValue);
        onClickInput();
    }

    function validationInputs() {
        if (valor <= 0.0 || valor > 1000000000.0) {setError("Limit value (1 a 1000000000)");setErrClass("Value");return;}
        if(category == 0){setError("The expenses must contains category"); setErrClass("Category"); console.log(errClass); return;}

        onSubmit(defaultData?.id, category, tipoValor, date, valor)
        return true;
    }

    function onClickInput() {
        setErrClass("");
    }

    async function getCategories() {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (err) {
            console.error("Erro ao carregar categorias:", err);
        }
    }
    async function getTypes(categoryId: number) {
        try {
            if (!categoryId) {
                setFilteredTypes([]);
                return;
            }
            const response = await api.get(`/categories/${categoryId}/types`);
            setFilteredTypes(response.data);
        } catch (err) {
            console.error("Erro ao carregar tipos:", err);
        }
    }

    useEffect(() => {
        getCategories();
        
        if (defaultData) {
            const numericValue = defaultData.value;
            setValor(numericValue);
            setDisplayValue(String(numericValue).replace('.', ',')); 
            const catId = defaultData.id_Category || 0; 
            setCategory(catId); 
            setTipoValor(defaultData.typeExpenses || 0); 
            setDate(new Date(defaultData.Date).toISOString());
            if(catId > 0) {
                getTypes(catId);
            }
        } else {
            setValor(0);
            setDisplayValue("0");
            setCategory(0);
            setTipoValor(0);
            setDate(new Date().toISOString());
        }

    }, [defaultData, isOpen]);

    if (!isOpen) return null;

    console.log(defaultData);

    return (
        <div className="modal">
            <div className="background_modal" onClick={onClose}></div>

            <div className="modal_expenses">
                <div className="modal_container">
                    <div className="modal_header">
                        <h1>{defaultData ? "Edit Expense" : "Add Expense"}</h1>
                        <button onClick={onClose}> <img src={closeImg}/> </button>
                    </div>

                    <Input
                        classname={errClass == "Value" ? "errModal" : ""}
                        label="Valor (R$)"
                        id="valor"
                        type="text"
                        OnChange={handleValueChange}
                        value={displayValue}
                        placeholder="R$ 0,00"
                        OnClick={onClickInput}
                    />

                    <div className="options">
                        <label>Select a category</label>
                        <select
                            onClick={() => onClickInput()}
                            name="Tipo"
                            id="select"
                            className={errClass == "Category" ? "errModal tipo_select" : "tipo_select"}
                            value={category} 
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);   
                                setCategory(selectedId); 
                                setTipoValor(0); 
                                getTypes(selectedId);
                            }}
                        >
                            <option value={0}>-- Select a Category --</option>
                            {categories.map(cat => (
                                <option key={cat.id_category} value={cat.id_category}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    

                    <div className="options">
                        <label> Select a option (Optional)</label>
                        <select
                            name="Tipo"
                            id="select"
                            className="tipo_select"
                            value={tipoValor}
                            onChange={(e) => setTipoValor(Number(e.target.value))}
                        >
                            <option value={0}>-- Optional --</option>

                            {filteredTypes.map(type => (
                                <option key={type.id_typeExpenses} value={type.id_typeExpenses}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Date"
                        id="tipo"
                        type="date"
                        OnChange={(e) =>{   
                            
                            if(new Date(e.target.value).getFullYear() <= new Date().getFullYear()-5){
                                 setDate(new Date().toISOString());
                                 return
                            }

                            if(new Date(e.target.value).toISOString() <= new Date().toISOString()){
                                setDate(new Date(e.target.value).toISOString());
                                return;
                            }

                            setDate(new Date().toISOString());
                        }}
                        placeholder="Enter your email"
                        value={date.slice(0,10)}
                    />

                    {Error ? 
                        <ErrorMensage classname="" nome={Error} />
                        :
                        undefined
                    }


                    <Button classname="" name={defaultData ? "Save Changes" : "Add Expense"}
                        OnClick={() => validationInputs()} />

                </div>
            </div>
        </div>
    );
}

interface ModalInterface {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string | undefined, category: number, tipoValor: number, date: string, valor: number) => void;
    defaultData?: {
        id: string;
        idCategory: number;
        type: number | null;
        Date: string;
        value: number;
    } | null;
}

export const TipoGastoEnum = {
  Racao: 1,
  Petiscos: 2,
  OssinhosSnacks: 3,
  BanhoTosa: 4,
  Veterinario: 5,
  Vacinas: 6,
  Remedios: 7,
  Brinquedos: 8,
  ColeiraGuiaPeitoral: 9,
  RoupasPet: 10,
  CamasMantas: 11,
  TapeteHigienico: 12,
  ShampooHigiene: 13,
  HotelPet: 14,
  CrechePet: 15,
  Adestramento: 16,
  TransportePet: 17,
  SeguroPet: 18,
} as const;

export type TipoGastoEnum = typeof TipoGastoEnum[keyof typeof TipoGastoEnum];