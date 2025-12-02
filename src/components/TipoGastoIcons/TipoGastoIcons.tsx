interface TipoGastoIconProps {
    classname: string
    tipo: string;
    category: string | null;
    color?: string;
    size?: number;
}

const iconMap: Record<string, string> = {
  "Pet Food": "restaurant",
  "Pet Treats": "cookie",
  "Bones / Snacks": "pets",
  "Veterinary": "medical_services",
  "Vaccines": "vaccines",
  "Medication": "medication",
  "Pet Insurance": "shield",
  "Bath and Grooming": "shower",
  "Shampoo / Hygiene": "soap",
  "Pee Pads": "layers",
  "Collar / Leash / Harness": "pets",
  "Pet Clothing": "checkroom",
  "Beds and Blankets": "bed",
  "Toys": "toys",
  "Pet Hotel": "hotel",
  "Pet Daycare": "child_care",
  "Training": "school",
  "Pet Transportation": "local_shipping",
  "Others": "Pet_Supplies"
};

const iconCategories: Record<string, string> = {
    "Food": "Food_Bank",
    "Health & Care": "Self_Care",
    "Accessories & Entertainment": "8k_Plus",
    "Services & Others": "Phone_Enable"
};

export function TipoGastoIcon({ classname, tipo, category}: TipoGastoIconProps) {

    const iconName = iconMap[tipo] ?? "help";
    const iconCat = iconName == "help" && category !== null ? iconCategories[category] : null;
    
    console.log(iconCat);

    return (
        <span
            className={`${classname || ""} material-symbols-rounded`}>
            {iconName == "help" ? iconCat : iconName}
        </span>
    );
}
