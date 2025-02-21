import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 w-full min-h-[94vh] flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-3xl text-white font-bold">LMCQ Tracker</h1>
        <p className="text-white/50 text-center">
          A remake of the Lmcodequest website that aims to provide a better
          experience
        </p>
      </div>

      <Button variant={"default"} asChild>
        <Link to="/problems">Problems</Link>
      </Button>
    </div>
  );
}
