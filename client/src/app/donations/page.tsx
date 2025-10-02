"use client";

import { useState, useEffect } from "react";
import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/StateComponents";
import { apiService, Donation } from "../../lib/api";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDonations();
      setDonations(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const totalDonations = donations.length;
  const totalAmount = donations.reduce(
    (sum, donation) => sum + parseFloat(donation.amount?.toString() || "0"),
    0
  );
  const uniqueDonors = new Set(donations.map((d) => d.donor)).size;
  const avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

  // Get recent donations (last 7 days)
  const recentDonations = donations.filter((d) => {
    const donationDate = new Date(d.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return donationDate >= sevenDaysAgo;
  });
  const recentAmount = recentDonations.reduce(
    (sum, donation) => sum + parseFloat(donation.amount?.toString() || "0"),
    0
  );

  const stats = (
    <>
      <KPICard
        title="Total Donaciones"
        value={totalAmount.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
        subtitle="Monto recaudado"
        icon="💰"
      />
      <KPICard
        title="Esta Semana"
        value={recentAmount.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
        subtitle="Recaudado en últimos 7 días"
        icon="📈"
      />
      <KPICard
        title="Total Donantes"
        value={uniqueDonors}
        subtitle="Donantes únicos"
        icon="👥"
      />
      <KPICard
        title="Donación Promedio"
        value={avgDonation.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
        subtitle="Por donación"
        icon="📊"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
      <thead>
        <tr>
          <th>Donante</th>
          <th>Organización</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Tipo</th>
        </tr>
      </thead>
      <tbody>
        {donations.map((donation) => (
          <tr key={donation.id}>
            <td>{donation.donor}</td>
            <td>{donation.organization}</td>
            <td>
              {parseFloat(donation.amount?.toString() || "0").toLocaleString(
                "es-ES",
                { style: "currency", currency: "EUR" }
              )}
            </td>
            <td>{new Date(donation.date).toLocaleDateString("es-ES")}</td>
            <td>
              <span
                className={`donation-type ${
                  parseFloat(donation.amount?.toString() || "0") >= 1000
                    ? "major"
                    : "standard"
                }`}
              >
                {parseFloat(donation.amount?.toString() || "0") >= 1000
                  ? "Mayor"
                  : "Estándar"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const emptyState = (
    <EmptyState
      icon="💰"
      title="No hay donaciones registradas"
      message="Sube un archivo CSV con datos de donaciones para comenzar"
    />
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDonations} />;
  }

  return (
    <DataPage
      title="Donaciones"
      icon="💰"
      description="Gestión de donaciones y donantes"
      dataType="donations"
      stats={stats}
      dataTable={donations.length > 0 ? dataTable : emptyState}
      emptyState={emptyState}
      onUploadComplete={fetchDonations}
    />
  );
}
