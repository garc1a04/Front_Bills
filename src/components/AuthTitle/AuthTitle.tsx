import "./AuthTitle.css"
import logo from "../../assets/logo.png"


export function AuthTitle({ title, subtitle }: AuthTitleInterface) {
  return (
    <header>
      <div className="div_input_img">
          <img className="div_input_img__logo" src={logo}/>
          <h2 className="div_input_img__title">Bills</h2>
      </div>

      <div className="div_input__Title">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
    </header>
  );
}

interface AuthTitleInterface {
    title: string;
    subtitle: string;
}