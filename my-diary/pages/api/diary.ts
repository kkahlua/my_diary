import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: "제목과 내용을 작성해주세요!" });
    }

    const { data, error } = await supabase
      .from("diary_entries")
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
        },
      ])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
