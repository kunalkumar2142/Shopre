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

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.warning("Missing fields", {
        description: "Please fill in name, email, and password.",
      });
      return;
    }
    if (password.length < 6) {
      toast.warning("Weak password", {
        description: "Password should be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    const result = await register({ name, email, password });
    setLoading(false);

    if (result.ok) {
      toast.success("Account created!", {
        description: "Welcome to Shopre. You're all set.",
      });
      navigate("/dashboard");
    } else {
      toast.error("Sign up failed", {
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
            <CardTitle>Sign up for Shopre</CardTitle>
            <CardDescription>
              Enter your name and email to create your Shopre account
            </CardDescription>
            <CardAction>
              <Link to="/signin">
                <Button variant="link">Sign In</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => handleSignUp()}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Sign up"}
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Sign up with Google
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
