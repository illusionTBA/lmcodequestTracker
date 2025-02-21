import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Scroll, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Problem } from "shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/stores";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/problems")({
  component: Component,
});

type Tfilter = {
  difficulty?: string;
  year?: number;
  points?: number;
};

function Component() {
  const [filter, setFilter] = useState<Tfilter>({});
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const userStore = useUserStore();
  const { isLoading, data } = useQuery<Problem[]>({
    queryKey: ["problemList", filter],
    queryFn: async () => {
      const params = new URLSearchParams();

      // Add filter parameters if available.
      if (filter.difficulty) {
        params.append("difficulty", filter.difficulty);
      }
      if (filter.points) {
        params.append("points", filter.points.toString());
      }
      if (filter.year) {
        params.append("year", filter.year.toString());
      }
      if (filter.difficulty === "All") {
        params.delete("difficulty");
      }
      if (userStore.userID) {
        params.append("uid", userStore.userID);
      }
      // Fetch the data with the filter query parameters.
      const response = await fetch(`/api/problems?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    // Optionally, you can add other configurations (staleTime, cacheTime, etc.) here.
  });

  useEffect(() => {
    setProblems(data || []);
    setFilteredProblems(data || []);
  }, [data]);

  return (
    <div className="w-full min-h-[96vh] flex items-center justify-center">
      <div className="h-full w-10/12 rounded-lg p-4 gap-2 flex flex-col items-center justify-center space-y-2">
        <div className="flex space-x-4 items-center w-full justify-center">
          <h1 className="text-white font-bold text-3xl">Problem List</h1>
          <Dialog>
            <DialogTrigger>
              <Filter className="w-6 h-6 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Problem Filter</DialogTitle>
                <DialogDescription>
                  Filter through problems based on your preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col w-full h-full gap-2">
                <Select
                  // Use the filter state value.
                  value={filter.difficulty || ""}
                  onValueChange={(v) =>
                    // Update the filter while preserving other filter fields.
                    setFilter((prev) => ({ ...prev, difficulty: v }))
                  }
                  defaultValue="Difficulty"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>

                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                {/* You can add additional filter components (for points, year, etc.) here */}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-wrap gap-2 w-9/12 items-stretch justify-center pb-5">
          <Input
            placeholder="Search problems"
            className="w-full"
            onChange={(e) => {
              if (!e.target.value) return setFilteredProblems(problems);
              setFilteredProblems(
                problems.filter((p) =>
                  p.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full items-stretch justify-center pb-5">
          {isLoading && <p>Loading...</p>}
          {!isLoading &&
            filteredProblems?.map((p) => (
              <Link
                key={p.id}
                to="/problem/$slug"
                params={{ slug: p.slug }}
                className="max-w-96 cursor-pointer w-full h-32 transition-all hover:-translate-y-1 transform"
              >
                <Card className="w-full h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex gap-2 text-left items-center text-wrap h-full">
                      <Scroll
                        fill={
                          p.difficulty.name === "Easy"
                            ? "green"
                            : p.difficulty.name === "Medium"
                              ? "blue"
                              : p.difficulty.name === "Hard"
                                ? "red"
                                : "orange"
                        }
                      />
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="gap-2">
                    {p.tags.slice(0, 3).map((t, index) => (
                      <Badge
                        key={index}
                        className="text-xs"
                        style={{
                          fontSize: "0.60rem",
                          lineHeight: "0.75rem",
                        }}
                      >
                        {t.label}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Component;
