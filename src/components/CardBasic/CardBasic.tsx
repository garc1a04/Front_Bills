import type { ReactNode } from "react";
import "./CardBasic.css";

export function CardBasic({
    className = "",
    icon,
    badge,
    title,
    value,
    valuePrefix = "",
    subtext,
    iconBgColor,
    colorSubtext,
    iconBadgeColor,
    iconBgBadge
}: CardBasicProps) {

    return (
        <section className={`card ${className}`}>
            <div className="card_left">
                <div className="card_icon" style={{ backgroundColor: iconBgColor }}>
                    {icon}
                </div>

                <p className="card_title">{title}</p>

                <h1 className="card_value">
                    {valuePrefix}{value}
                </h1>

                {subtext && (
                    <p className="card_subtext" style={{color: colorSubtext}}>{subtext}</p>
                )}
            </div>

            {badge && (
                <div className="card_badge" style={{ backgroundColor: iconBgBadge || iconBgColor, color: iconBadgeColor}}>
                    {badge}
                </div>
            )}
        </section>
    );
}

interface CardBasicProps {
    className?: string;
    icon: ReactNode;
    colorSubtext?: string;
    iconBgColor?: string;
    iconBadgeColor?: string;
    iconBgBadge?:string;
    
    title: string;
    value: number | string;
    valuePrefix?: string;

    subtext?: string;
    badge?: ReactNode;  
}