import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("diary_entries")
      .delete()
      .match({ id });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "Entry deleted successfully" });
  }

  res.setHeader("Allow", ["DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
