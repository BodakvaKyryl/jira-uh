"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const SignUpCard = () => {
  return (
    <Card className="h-full w-full border-none shadow-none md:w-[500px]">
      <CardHeader className="flex flex-col items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and
          <Link href="/terms">
            {" "}
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form className="space-y-4">
          <Input
            required
            type="text"
            placeholder="Enter your name"
            onChange={() => {}}
            value={"name"}
            disabled={false}
          />
          <Input
            required
            type="email"
            placeholder="Enter email address"
            onChange={() => {}}
            value={"email"}
            disabled={false}
          />
          <Input
            required
            type="password"
            placeholder="Enter your password"
            onChange={() => {}}
            value={"password"}
            disabled={false}
            min={8}
            max={256}
          />
          <Button disabled={false} size="lg" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
      <div className="flex flex-col gap-y-4 px-7">
        <DottedSeparator />
        <Button
          variant={"secondary"}
          disabled={false}
          size="lg"
          className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>
        <Button
          variant={"secondary"}
          disabled={false}
          size="lg"
          className="w-full">
          <FaGithub className="mr-2 size-5" />
          Login with GitHub
        </Button>
      </div>
    </Card>
  );
};
