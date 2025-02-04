import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DiaryForm from "@/components/DiaryForm";
import { DiaryEntry } from "@/types/diary";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query;
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/diary/${id}`);
        if (!response.ok) {
          throw new Error("일기를 불러올 수 없습니다.");
        }
        const data = await response.json();
        setEntry(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "fetchEntry : error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <DiaryForm initialData={entry!} isEditing />;
}
