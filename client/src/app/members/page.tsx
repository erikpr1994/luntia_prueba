"use client";

import { useState, useEffect } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/StateComponents";
import { apiService, Member } from "../../lib/api";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMembers();
      setMembers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const totalMembers = members.length;
  const premiumMembers = members.filter(
    (m) => m.monthly_contribution >= 75
  ).length;
  const totalContributions = members.reduce(
    (sum, m) => sum + m.monthly_contribution,
    0
  );
  const avgContribution =
    totalMembers > 0 ? Math.round(totalContributions / totalMembers) : 0;

  const stats = (
    <>
      <KPICard
        title="Total Socios"
        value={totalMembers}
        subtitle="Socios registrados"
        icon="👤"
      />
      <KPICard
        title="Socios Premium"
        value={premiumMembers}
        subtitle="Membresías premium"
        icon="⭐"
      />
      <KPICard
        title="Contribución Total"
        value={`$${totalContributions.toLocaleString()}`}
        subtitle="Contribución mensual total"
        icon="💰"
      />
      <KPICard
        title="Contribución Promedio"
        value={`$${avgContribution}`}
        subtitle="Contribución promedio por socio"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Organización</th>
          <th>Fecha Ingreso</th>
          <th>Contribución Mensual</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.name}</td>
            <td>{member.organization}</td>
            <td>{new Date(member.join_date).toLocaleDateString("es-ES")}</td>
            <td>${member.monthly_contribution.toLocaleString()}</td>
            <td>
              <span
                className={`membership ${
                  member.monthly_contribution >= 75 ? "premium" : "basic"
                }`}
              >
                {member.monthly_contribution >= 75 ? "Premium" : "Básico"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const emptyState = (
    <EmptyState
      icon="👤"
      title="No hay socios registrados"
      message="Sube un archivo CSV con datos de socios para comenzar"
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchMembers} />;
  }

  return (
    <DataPage
      title="Socios"
      icon="👤"
      description="Gestión de Socios y suscripciones"
      dataType="members"
      stats={stats}
      dataTable={members.length > 0 ? dataTable : emptyState}
      emptyState={emptyState}
      onUploadComplete={fetchMembers}
    />
  );
}
