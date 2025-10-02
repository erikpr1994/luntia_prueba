import DataPage from "../../components/DataPage";
import KPICard from "../../components/KPICard";

export default function ActivitiesPage() {
  const stats = (
    <>
      <KPICard
        title="Total Actividades"
        value={24}
        subtitle="Actividades organizadas"
        icon="🎯"
      />
      <KPICard
        title="Actividades Activas"
        value={8}
        subtitle="En curso"
        icon="🟢"
      />
      <KPICard
        title="Total Participantes"
        value={456}
        subtitle="Participantes únicos"
        icon="👥"
      />
      <KPICard
        title="Satisfacción"
        value="4.8/5"
        subtitle="Rating promedio"
        icon="⭐"
      />
    </>
  );

  const dataTable = (
    <table className="dataTable">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Ubicación</th>
          <th>Participantes</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Campaña de Limpieza</td>
          <td>Limpieza de playa local</td>
          <td>2024-03-20</td>
          <td>2024-03-20</td>
          <td>Playa Central</td>
          <td>25</td>
          <td>Completada</td>
        </tr>
        <tr>
          <td>Taller de Reciclaje</td>
          <td>Educación sobre reciclaje</td>
          <td>2024-03-25</td>
          <td>2024-03-25</td>
          <td>Centro Comunitario</td>
          <td>30</td>
          <td>Programada</td>
        </tr>
        <tr>
          <td>Mercado Solidario</td>
          <td>Venta de productos locales</td>
          <td>2024-03-18</td>
          <td>2024-03-18</td>
          <td>Plaza Principal</td>
          <td>150</td>
          <td>Completada</td>
        </tr>
      </tbody>
    </table>
  );

  const emptyState = (
    <div className="emptyState">
      <div className="emptyStateIcon">🎯</div>
      <p className="emptyStateText">No hay actividades registradas</p>
    </div>
  );

  return (
    <DataPage
      title="Actividades"
      icon="🎯"
      description="Gestión de actividades y eventos"
      dataType="activities"
      stats={stats}
      dataTable={dataTable}
      emptyState={emptyState}
    />
  );
}
