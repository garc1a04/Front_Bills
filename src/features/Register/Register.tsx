import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import "./Register.css";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";
import { AuthTitle } from "../../components/AuthTitle/AuthTitle";
import { Input } from "../../components/InputText/Input";
import { PasswordGroup } from "../../components/PasswrodGroup/PasswordGroup";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../../service/api";
import { ErrorMensage } from "../../components/MensageErr/ErrorMensage";

export function Register() {
  const [errClass, setErrClass] = useState("")
  const [Error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate(); 

  function validationInputs(name: string, password: string) {
    const nameVal = validationText(name, 3, 16,"Name must contain only letters and numbers", "Name must contain legnth beetween 3 and 16")
    const passwordVal = validationText(password,3, 20, "Password must contain only letters and numbers", " Password must contain legnth beetween 3 and 20")

    if(!nameVal.result){setError(nameVal.mensage); setErrClass("Name"); return false;}
    if(!passwordVal.result){setError(passwordVal.mensage); setErrClass("Password"); return false;}

    return true;
  }

  function validationText(text: string, start: number, end: number, textInvalid: string, textLength: string){
    if(!IsLetterAndNumbers(text)) return {result: false, mensage: textInvalid};
    if(!(text.length >= start && text.length <= end)) return {result: false, mensage: textLength};
     return {result: true, mensage: "ok"};
  }

  function IsLetterAndNumbers(text: string) {
    const regex = /^[a-zA-Z0-9]+$/;
    if(!regex.test(text)){return false}
    return true;
  }

  function onClickInput() {
    setErrClass("");
  }

  async function handleSubmit() {

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return undefined;
    }
    
    if(!validationInputs(name, password)) return undefined;
    
    try {
      const response = await api.post("/user", {name,email,password});
      navigate("/", {state: { showCard: true, type:"acess" }})
    } catch(e) {
      if(e.response.data.message.includes("User")) {setErrClass("Email")}
      setError(e.response.data.message)
    }
  }

  return (
    <AuthLayout position="left">
      <AuthTitle 
        title="Let's Sign You Up"
        subtitle="Create your account"
      />

      <div className="inputs">
        <Input
          classname={errClass == "Name" ? "errClass" : ""}
          label="Name"
          id="name"
          type="text"
          OnChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          OnClick={onClickInput}
        />

        <Input
          classname={errClass == "Email" ? "errClass" : ""}
          label="Email"
          id="email"
          type="email"
          OnChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          OnClick={onClickInput}
        />

        <PasswordGroup
          classname={errClass == "Password" ? "errPassword" : ""}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          OnClick={onClickInput}
        />

        <div className="forgot_div">
          <a className="anchor forgot" href="#">Forgot password?</a>
          {Error ?  <ErrorMensage classname="errAuth" nome={Error}/> : undefined}
        </div>

        <Button classname="" name="Sign Up" OnClick={handleSubmit} />

        <p className="SignIn">
          Already have an account?
          <Link className="anchor" to="/"> Sign In </Link>
        </p>

      </div>
    </AuthLayout>
  );
}