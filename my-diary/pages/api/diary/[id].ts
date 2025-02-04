import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data)
      return res.status(404).json({ error: "일기를 찾을 수 없습니다." });

    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: "제목과 내용은 필수입니다." });
    }

    const { data, error } = await supabase
      .from("diary_entries")
      .update({
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("diary_entries")
      .delete()
      .match({ id });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "일기가 삭제되었습니다." });
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
