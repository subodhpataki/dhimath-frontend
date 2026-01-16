"use client";

import * as React from "react";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/greywiz-ui/menubar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/greywiz-ui/alert-dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/greywiz-ui/tooltip";

import { LogOut, UserCircle } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-1.5 z-40 bg-background flex h-10 items-center justify-between gap-2 px-2 shadow-sm">
      <div className="flex items-center gap-2 px-1">
        <div className="pr-2">
          <Image
            src="/bosch-logo.jpeg"
            alt="Bosch"
            width={100}
            height={20}
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-xs">User Name</span>

        <AlertDialog>
          <Menubar className="border-none shadow-none bg-transparent p-0">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer p-0">
                <UserCircle className="h-5 w-5 text-gray-600" />
              </MenubarTrigger>

              <MenubarContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <MenubarItem className="text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </MenubarItem>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to login again to
                access the app.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 text-white hover:bg-red-600">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
