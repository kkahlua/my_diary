import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { DiaryEntry } from "@/types/diary";

interface DiaryFormProps {
  initialData?: DiaryEntry;
  isEditing?: boolean;
}

export default function DiaryForm({
  initialData,
  isEditing = false,
}: DiaryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditing ? `/api/diary/${initialData?.id}` : "/api/diary";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("저장에 실패했습니다.");
      }

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Button>

        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? "일기 수정하기" : "새 일기 쓰기"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              placeholder="제목을 입력하세요"
              required
              maxLength={100}
              defaultValue={initialData?.title}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="내용을 입력하세요"
              required
              className="min-h-[300px]"
              defaultValue={initialData?.content}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
