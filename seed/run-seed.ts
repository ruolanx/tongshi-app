import { createClient } from "@supabase/supabase-js";
import { SEED_QUESTIONS } from "./questions";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function seed() {
  const supabase = createClient(url, key);

  // Clear existing questions
  console.log("Deleting old questions...");
  await supabase.from("answers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("questions").delete().neq("id", 0);

  // Insert fresh questions
  console.log("Inserting questions...");
  const rows = SEED_QUESTIONS.map((q) => ({
    order_index: q.order_index,
    prompt: q.prompt,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    is_active: true,
  }));

  const { data, error } = await supabase.from("questions").insert(rows).select("id, order_index, prompt");

  if (error) {
    console.error("Insert error:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data.length} questions:`);
  for (const q of data) {
    console.log(`  ${q.order_index}. ${q.prompt}`);
  }
  console.log("Done!");
}

seed();
