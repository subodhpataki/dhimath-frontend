"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/greywiz-ui/card";
import { Input } from "@/components/greywiz-ui/input";
import { Label } from "@/components/greywiz-ui/label";
import { Button } from "@/components/greywiz-ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/greywiz-ui/sheet";
import { UserRoundPlus, Eye, EyeOff, User, Plus } from "lucide-react";
import { createUser } from "./btns/saveFunctions";

export default function CreateUserSheet() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveUser = () => {
    const success = createUser();
    if (success) setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Users
        </h2>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="cursor-pointer">
              Create User
              <Plus className="w-4 h-4 ml-1" />
            </Button>
          </SheetTrigger>

          <SheetContent
            className="
              w-full
              bg-background
              px-6 py-6
              flex flex-col
              gap-6
            "
          >
            <SheetHeader className="pb-3">
              <SheetTitle className="flex items-center gap-2">
                <UserRoundPlus className="w-4 h-4" />
                Create User
              </SheetTitle>
            </SheetHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 font-sans text-sm text-muted-foreground">
              <div className="flex flex-col gap-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Enter username" />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setOpen(false)} variant="outline" className="hover:cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleSaveUser} className="cursor-pointer">
                Create User
                <User className="w-4 h-4" />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
