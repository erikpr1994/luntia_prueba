"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./Chart.module.css";

interface ChartData {
  [key: string]: string | number;
}

interface ChartProps {
  title: string;
  data: ChartData[];
  loading?: boolean;
  error?: string;
  type?: "bar" | "line";
  dataKey?: string;
  secondaryDataKey?: string;
  xAxisKey?: string;
}

export default function Chart({ 
  title, 
  data, 
  loading, 
  error, 
  type = "bar",
  dataKey = "value",
  secondaryDataKey,
  xAxisKey = "name"
}: ChartProps) {
  if (loading) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>⏳</div>
          <p className={styles.emptyStateText}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>⚠️</div>
          <p className={styles.emptyStateText}>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📊</div>
          <p className={styles.emptyStateText}>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    if (type === "line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              typeof value === 'number' ? value.toLocaleString() : value,
              name === dataKey ? 'Voluntarios' : 'Turnos'
            ]}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          {secondaryDataKey && <Legend />}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            name="Voluntarios"
          />
          {secondaryDataKey && (
            <Line 
              type="monotone" 
              dataKey={secondaryDataKey} 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Turnos"
            />
          )}
        </LineChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#3b82f6" />
      </BarChart>
    );
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
