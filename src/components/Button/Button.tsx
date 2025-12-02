import "./Button.css"

export function Button({name,classname, OnClick, image, loading}: ButtonInterface) {
    const classDefault = "button"

    return (
        <>
            <button className={`${classname || ""} ${classDefault}`} onClick={OnClick}>
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    name
                )}
                
                {image}
            </button>
        </>
    )
}

interface ButtonInterface {
    name: string;
    classname: string;
    loading: boolean;
    OnClick(): void;
    image?: React.ReactNode;
}