import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      toast.warning("Missing fields", {
        description: "Please enter your email and password.",
      });
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.ok) {
      toast.success("Welcome back!", {
        description: "You are signed in to Shopre.",
      });
      navigate("/dashboard");
    } else {
      toast.error("Sign in failed", {
        description: result.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm shadow-md">
          <CardHeader>
            <CardTitle>Login to Shopre</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link to="/signup">
                <Button variant="link">Sign Up</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    value={email}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              onClick={() => handleLogin()}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Login"}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
