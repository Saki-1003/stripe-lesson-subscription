import { createServerComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/lib/database.types";


const getAllLessons = async (supabase: SupabaseClient<Database>) => {
  const {data:lessons} = await supabase.from("lesson").select("*")
  return lessons;
}

export default async function Home() {
  const supabase = createServerComponentClient<Database>({cookies})
  const lessons = await getAllLessons(supabase)
  
  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <div className="flex flex-col gap-4">
      {lessons?.map((lesson) => (
        <Link href={`/${lesson.id}`} key={lesson.id}>
          <Card>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{lesson.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
      </div>
    </main>
  );
}
