import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Problem } from "shared/types";

const getProblem = async (slug: string, uid?: string) => {
  const res = await fetch(
    `/api/problem?slug=${slug}${uid ? `&uid=${uid}` : ""}`
  );

  const data = await res.json();

  return data;
};

export const Route = createFileRoute("/problem/$slug")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { uid?: string } => {
    return {
      uid: search?.uid as string,
    };
  },
  loaderDeps: ({ search: { uid } }) => ({ uid }),
  loader: ({ params: { slug }, deps: { uid } }) => getProblem(slug, uid),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const data = Route.useLoaderData() as unknown as Problem;
  console.log(data);
  console.log(slug);

  const hasResourcePacket =
    data.tags.filter((t) => t.slug === "resource-packet").length > 0;

  const difficulty =
    data.difficulty.level === "1"
      ? "Practice"
      : data.difficulty.level === "2"
        ? "Easy"
        : data.difficulty.level === "3"
          ? "Medium"
          : "Hard";

  const diffColor =
    difficulty === "Easy"
      ? "oklch(.596 .145 163.225)"
      : difficulty === "Medium"
        ? "oklch(.588 .158 241.966)"
        : difficulty === "Hard"
          ? "oklch(.577 .245 27.325)"
          : "oklch(.681 .162 75.834)";
  return (
    <div className="w-full min-h-[94vh] flex items-center justify-center">
      <div className="w-full sm:w-8/12 flex flex-col p-4 items-center rounded-lg space-y-4">
        <div className="flex flex-col space-y-2 w-full">
          <h1 className="text-2xl text-white font-bold">{data.title}</h1>
          <div className="flex space-x-2 items-center">
            <span
              className=""
              style={{
                color: diffColor,
              }}
            >
              {difficulty}
            </span>
            <span>●</span>
            <span>{data.points} pts</span>
            <span>●</span>

            <span>{data.year}</span>
          </div>
        </div>
        <p>{data.description}</p>
        <div className="w-full flex space-x-2">
          {data.tags.map((t) => (
            <Badge className="">{t.label}</Badge>
          ))}
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-2 items-center justify-center">
          <a
            href={`https://lmcodequestacademy.com/api/static/problems/${data.slug}`}
            className="w-full sm:w-fit"
            target="_blank"
          >
            <Button className="w-full">Problem Description</Button>
          </a>
          {hasResourcePacket && (
            <a
              href={`https://lmcodequestacademy.com/resource-packets/${data.slug}.pdf`}
              className="w-full sm:w-fit"
              target="_blank"
            >
              <Button className="w-full">Resource Packet</Button>
            </a>
          )}
          <a
            href={`https://lmcodequestacademy.com/problem/${data.slug}`}
            className="w-full sm:w-fit"
            target="_blank"
          >
            <Button className="w-full">Submit Solution</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
