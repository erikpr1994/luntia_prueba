import styles from "./StateComponents.module.css";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Error",
  message = "Ha ocurrido un error al cargar los datos",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h2 className={styles.errorTitle}>{title}</h2>
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export function EmptyState({
  title = "Sin datos",
  message = "No hay datos disponibles para mostrar",
  icon = "📊",
}: EmptyStateProps) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptyMessage}>{message}</p>
    </div>
  );
}
