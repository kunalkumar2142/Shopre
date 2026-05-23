import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignUp() {
  return (
    <div className="flex justify-center item-center min-h-[100v]">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>SignUp to shopre</CardTitle>
        <CardDescription>
          Enter your name, email below to SignUp on shopre
        </CardDescription>
        <CardAction>
          <Link to="/signin">
                <Button variant="link">Sign In</Button>
            </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="john"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          SignUp
        </Button>
        <Button variant="outline" className="w-full">
          SignUp with Google
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
