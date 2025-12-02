import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Login } from "../features/Login/Login"; 
import { Register } from "../features/Register/Register"; 
import { PageNotFound } from "../features/PageNotFound/PageNotFound"; 
import { PrivateRoute } from "./PrivateRoute"; 
import { Home } from "../features/Home/Home"; 
import { Analytics } from "../features/Analytics/Analytics"; 

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PageNotFound/>} />

        <Route path="/" element={<Login />} />
        
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={
          <PrivateRoute>
            <Home/>
          </PrivateRoute>
        } />

      <Route path="/analytics" element={
          <PrivateRoute>
            <Analytics/>
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}