import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";

export default function DonationsPage() {
  const stats = (
    <>
      <KPICard
        title="Total Donaciones"
        value="$45,680"
        subtitle="Monto recaudado"
        icon="💰"
      />
      <KPICard
        title="Donaciones Este Mes"
        value="$8,420"
        subtitle="Recaudado en marzo"
        icon="📈"
      />
      <KPICard
        title="Total Donantes"
        value={89}
        subtitle="Donantes únicos"
        icon="👥"
      />
      <KPICard
        title="Donación Promedio"
        value="$513"
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
          <th>Monto</th>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Método</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Empresa ABC</td>
          <td>$5,000.00</td>
          <td>2024-03-10</td>
          <td>Corporativa</td>
          <td>Transferencia</td>
          <td>Completada</td>
        </tr>
        <tr>
          <td>Ana Martínez</td>
          <td>$250.00</td>
          <td>2024-03-12</td>
          <td>Individual</td>
          <td>Tarjeta</td>
          <td>Completada</td>
        </tr>
        <tr>
          <td>Fundación XYZ</td>
          <td>$2,500.00</td>
          <td>2024-03-08</td>
          <td>Fundación</td>
          <td>Cheque</td>
          <td>Pendiente</td>
        </tr>
      </tbody>
    </table>
  );

  const emptyState = (
    <div className="emptyState">
      <div className="emptyStateIcon">💰</div>
      <p className="emptyStateText">No hay donaciones registradas</p>
    </div>
  );

  return (
    <DataPage
      title="Donaciones"
      icon="💰"
      description="Gestión de donaciones y donantes"
      dataType="donations"
      stats={stats}
      dataTable={dataTable}
      emptyState={emptyState}
    />
  );
}
