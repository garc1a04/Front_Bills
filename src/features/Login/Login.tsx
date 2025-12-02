import { useEffect, useState } from "react"
import { Button } from "../../components/Button/Button"
import { AuthLayout } from "../../components/AuthLayout/AuthLayout"
import { AuthTitle } from "../../components/AuthTitle/AuthTitle"
import { Input } from "../../components/InputText/Input"
import { InputPassword } from "../../components/InputPassword/InputPassword"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ErrorMensage } from "../../components/MensageErr/ErrorMensage"
import { api } from "../../service/api"

import "./Login.css"
import { CardAcess } from "../../components/CardAcess/CardAcess"

export function Login() {
  let location = useLocation()

  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const[isError, setIsError] = useState(false);
  const[MensageErr, setMensagemErr] = useState('')
  const[showCard, setShowCard] = useState(location.state?.showCard)
  const[typeCard, setTypeCard] = useState(location.state?.type)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  async function loginUser() {

    if(loading) return;
    setLoading(true);

    try {
        const response = await api.post('/auth/login', { email, password }, { withCredentials: true });

        console.log(response);
        navigate("/home");
    } catch (e) {
      setLoading(false);
      const message = e instanceof Error ? e.message : String(e);
      setIsError(true);
      if(message.includes("401") || message.includes("400")) {setMensagemErr("User invalid"); return;}
      return setMensagemErr("Error undefined");
    }
  }

    useEffect(() => {
      if(showCard){
        setTimeout(() => {
          setShowCard(false);
        }, 3800);
        
      }
    }, [showCard]);

    return (
    <AuthLayout position="right">
      <AuthTitle 
        title="Let's Sign You In"
        subtitle="Sign in to your account"
      />

      <div className="inputs">
        <Input
          value={email}
          label="Email"
          id="email"
          type="email"
          OnChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <InputPassword
          label="Password"
          id="password"
          OnChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div className="forgot_div">
          {isError ?  <ErrorMensage classname="errAuth" nome={MensageErr}/> : undefined}
        </div>

        <Button classname="" name="Sign In" OnClick={loginUser} loading={loading} />

        <p className="SignUp">
          Don't have an account?
          <Link className="anchor" to="/register">Sign Up</Link>
        </p>


      </div>


        <CardAcess showCardPrp={showCard} nameIcon="Check" text="Cadastro feito" classname={`card_${typeCard}`}/>
    </AuthLayout>
    );
}