import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserStore } from "@/stores";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Cookies from "js-cookie";
export const Route = createRootRoute({
  component: ReactComponent,
});

function ReactComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const userStore = useUserStore();
  const loggedIn = Cookies.get("session") ? true : false;

  const ACCOUNT_FEATURE_FLAG =
    import.meta.env.VITE_ACCOUNT_ENABLED === "true" ? true : false;

  const loginWithEmail = async () => {
    if (!ACCOUNT_FEATURE_FLAG) {
      return toast.error("Login is disabled at this time.");
    }
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      userStore.setUserID(data.user.id);
      userStore.setEmail(data.user.email);
      userStore.setFirstName(data.user.firstName);
      userStore.setLastName(data.user.lastName);
      userStore.setFullName(data.user.fullName);
      toast.success("Logged in successfully");
      setDialogOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen ">
      <nav className=" px-4 h-[6vh] gap-4 border-b-2 border-border flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/" className="[&.active]:font-bold text-white">
            LMCQ Tracker
          </Link>
          <div className=" gap-4 flex text-white">
            <Link to="/problems">Problems</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <h2>{userStore.fullName}</h2>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <User size={24} />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign in</DialogTitle>
                  <DialogDescription>
                    Sign in to pull your LMCQ data and see problems you've
                    completed. This also allows you to be on the leaderboard.
                    You can either log in with your email and password or with
                    your user id.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="account" className="w-full">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="uid" className="w-full">
                      User id
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="account" className="gap-2 flex flex-col">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <Input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder="Password"
                      className="w-full"
                    />
                    <Button onClick={loginWithEmail}>Login</Button>
                  </TabsContent>
                  <TabsContent value="uid" className="gap-2 flex flex-col">
                    <Input placeholder="User id" className="w-full" />
                    <Button>Login</Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
}
