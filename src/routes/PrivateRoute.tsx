import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { api } from "../service/api";



export function PrivateRoute({children} : PrivateRouteProps) {

  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() =>

    {

    api.get("/auth/user", {withCredentials: true})

      .then(() => setAuth(true))

      .catch(() => setAuth(false));

    }, []);

  if (auth === null) return <p>Carregando...</p>;

  if (auth === false) {
    console.log(auth);
    return <Navigate to="/" />;
  }

  return children;

}





interface PrivateRouteProps { children: ReactNode; }
