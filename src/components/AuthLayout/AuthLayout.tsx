import type { ReactNode } from 'react';
import './AuthLayout.css'

export function AuthLayout({children, position}: AuthLayoutInterface) {
    return (
        <div className="Auth">
            <div className='backgroundAuth'></div>

            <div className="container">
                {position === "left" && <div className="div_image"></div>}
                
                <div className="div_input">
                    {children}
                </div>
                
                {position === "right" && <div className="div_image"></div>}
            </div>
        </div>
    )
}

interface AuthLayoutInterface {
    position: string;
    children: ReactNode
}