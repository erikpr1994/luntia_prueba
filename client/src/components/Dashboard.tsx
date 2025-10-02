"use client";

import { useState, useEffect } from "react";
import {
  apiService,
  BasicMetrics,
  OverallStats,
  DailyActivity,
} from "../lib/api";
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
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [basicMetricsData, overallStatsData, dailyActivityData] =
        await Promise.all([
          apiService.getBasicMetrics(),
          apiService.getOverallStats(),
          apiService.getDailyVolunteerActivity(7, organization),
        ]);

      setBasicMetrics(basicMetricsData.metrics);
      setOverallStats(overallStatsData.stats);
      setDailyActivity(dailyActivityData.activity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organization]);

  // Prepare chart data - Volunteer activity over time from API
  const chartData = dailyActivity.map((item) => ({
    date: new Date(item.date).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    }),
    volunteers: item.volunteers,
    hours: item.hours,
    shifts: item.shifts,
  }));

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
          value={`${(basicMetrics.economicValue || 0).toLocaleString("es-ES", {
            style: "currency",
            currency: "EUR",
          })}`}
          subtitle="Valor del trabajo voluntario"
          icon="💰"
        />
        <KPICard
          title="Total Socios"
          value={overallStats.members || 0}
          subtitle="Socios registrados"
          icon="👤"
        />
      </div>

      <div className={styles.chartGrid}>
        <Chart
          title="Actividad de Voluntarios (Últimos 7 días)"
          data={chartData}
          type="line"
          dataKey="volunteers"
          secondaryDataKey="shifts"
          xAxisKey="date"
        />
      </div>
    </div>
  );
}
