"use client";

import { useState, useEffect } from "react";
import { apiService, BasicMetrics, OverallStats } from "../lib/api";
import KPICard from "./KPICard";
import Chart from "./Chart";
import { LoadingState, ErrorState, EmptyState } from "./StateComponents";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  organization?: string;
}

export default function Dashboard({ organization }: DashboardProps) {
  const [basicMetrics, setBasicMetrics] = useState<BasicMetrics | null>(null);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [basicMetricsData, overallStatsData] = await Promise.all([
        apiService.getBasicMetrics(),
        apiService.getOverallStats(),
      ]);

      setBasicMetrics(basicMetricsData.metrics);
      setOverallStats(overallStatsData.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organization]);

  // Prepare chart data
  const chartData = overallStats
    ? [
        { name: "Voluntarios", value: overallStats.volunteers || 0 },
        { name: "Miembros", value: overallStats.members || 0 },
        { name: "Turnos", value: overallStats.shifts || 0 },
        { name: "Donaciones", value: overallStats.donations || 0 },
        { name: "Actividades", value: overallStats.activities || 0 },
      ]
    : [];

  if (loading) {
    return <LoadingState message="Cargando métricas del dashboard..." />;
  }

  if (error) {
    return <ErrorState onRetry={fetchData} />;
  }

  if (!basicMetrics || !overallStats) {
    return (
      <EmptyState
        title="Sin datos"
        message="No se pudieron cargar las métricas"
      />
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Dashboard {organization ? `- ${organization}` : "General"}
        </h1>
        <p className={styles.subtitle}>
          Métricas clave y estadísticas de la organización
        </p>
      </header>

      <div className={styles.kpiGrid}>
        <KPICard
          title="Voluntarios Activos"
          value={basicMetrics.activeVolunteers || 0}
          subtitle="Voluntarios activos actualmente"
          icon="👥"
        />
        <KPICard
          title="Promedio Horas/Voluntario"
          value={basicMetrics.avgHoursPerVolunteer || 0}
          subtitle="Horas promedio por voluntario"
          icon="⏰"
        />
        <KPICard
          title="Tasa de Retención"
          value={`${basicMetrics.retentionRate || 0}%`}
          subtitle="Voluntarios retenidos"
          icon="📊"
        />
        <KPICard
          title="Valor Económico"
          value={`$${(basicMetrics.economicValue || 0).toLocaleString()}`}
          subtitle="Valor del trabajo voluntario"
          icon="💰"
        />
        <KPICard
          title="Total Miembros"
          value={overallStats.members || 0}
          subtitle="Miembros registrados"
          icon="👤"
        />
      </div>

      <div className={styles.chartGrid}>
        <Chart title="Distribución por Categoría" data={chartData} />
      </div>
    </div>
  );
}
