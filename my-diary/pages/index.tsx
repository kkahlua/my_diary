import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiaryEntry } from "@/types/diary";
import DiaryList from "@/components/DiaryList";

export default function Home() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/diary");
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Failed to fetch entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">나의 일기장</h1>
        <Button onClick={() => (window.location.href = "/write")}>
          <Plus className="mr-2 h-4 w-4" /> 일기 쓰기
        </Button>
      </div>
      <DiaryList entries={entries} isLoading={isLoading} />
    </main>
  );
}
