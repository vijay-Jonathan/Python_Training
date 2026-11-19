import { useEffect, useState } from "react";
import { Card, PageHeader, Skeleton, Alert } from "../ui";
import { getGreeting } from "../api/greeting";

interface HomePageProps {}

export function HomePage(_props: HomePageProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getGreeting()
      .then((data) => {
        if (!cancelled) setMessage(data.message);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load greeting");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container narrow stack-lg animate-in">
      <PageHeader
        eyebrow="Hello World App"
        title="Full-stack greeting demo"
        subtitle="A minimal React and FastAPI application."
      />
      <Card title="Greeting from the backend">
        {loading && <Skeleton lines={2} />}
        {!loading && error && (
          <Alert tone="danger">Could not load the greeting: {error}</Alert>
        )}
        {!loading && !error && message && (
          <p className="page-title">{message}</p>
        )}
      </Card>
    </div>
  );
}
