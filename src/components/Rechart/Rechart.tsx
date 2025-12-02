import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { BarChart3, Activity } from "lucide-react";
import "./Rechart.css";
import { api } from "../../service/api";
import io from 'socket.io-client';

export function Rechart({year, nextYear, prevYear}: RechartProps) {
    const [chartType, setChartType] = useState<"bar" | "area">("bar");
    const [yearData, setYearData] = useState([]);
    const socket = io('http://localhost:3000'); 

    useEffect(() => {
            async function loadData() {
                try {
                    const response = await api.get(`expenses/dashboard/recharts?year=${year}`);
                    console.log("API DATA:", response.data);
                    setYearData(response.data.months);
                } catch (err) {
                    console.error("Erro ao carregar Recharts:", err);
                }
            }

            socket.on('new-expense',() => {loadData();});
            loadData();
        }, [year]);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>Spending Overview</h3>
          <p>Monthly expense analysis</p>
        </div>

        <div className="chart-actions">
          <button onClick={() => setChartType("bar")}>
            <BarChart3 />
          </button>

          <button onClick={() => setChartType("area")}>
            <Activity />
          </button>

          <div className="transactions__year-selector">
            <button className="year-selector__btn"  onClick={prevYear}>
              {"<"}
            </button>

            <span className="year-selector__value">{year}</span>

            <button
              className="year-selector__btn"
              onClick={nextYear}
              disabled={year == new Date().getFullYear() ? true : false}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="99%" height={330}>
          {chartType === "bar" ? 
          (
            <BarChart data={yearData} margin={{ top: 5, right: 10, left: -10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                interval={0} 
                angle={-45}  
                textAnchor="end" 
                height={60}    
              />
              <YAxis/>
              <Tooltip />

                <Bar dataKey="food" name="Food" fill="#ff7675" radius={[8, 8, 0, 0]} />
                <Bar dataKey="health" name="Health & Care" fill="#0080ffff" radius={[8, 8, 0, 0]} />
                <Bar
                    dataKey="entertainment"
                    name="Accessories & Entertainment"
                    fill="#655affff"
                    radius={[8, 8, 0, 0]}
                />
                <Bar
                    dataKey="services"
                    name="Services & Others"
                    fill="#00ff0dff"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>

          ) : (

            <AreaChart data={yearData} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="total"
                dot={true}
                name="Month spending"
                stroke="#ef4444"
                strokeOpacity={1}
                strokeWidth={3}
                fill="#fecaca"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>


          {chartType == "bar" ?
            <div className="group_legend">
                
                <div className="legend Food">
                    <div className="color"></div>
                    <p>Food</p>
                </div>

                <div className="legend Health">
                    <div className="color"></div>
                    <p>Health & Care</p>
                </div>

                <div className="legend Accessories">
                    <div className="color"></div>
                    <p>Accessories & Entertainment</p>
                </div>

                <div className="legend Services">
                    <div className="color"></div>
                    <p>Services & Others</p>
                </div>
            </div>
            :
            undefined
          }
      </div>
    </div>
  );
}

interface RechartProps {
    year: number;
    nextYear: () => void;
    prevYear: () => void;
}