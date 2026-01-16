"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  CircuitBoard,
  FileText,
  Users,
  BarChart3,
  Bot,
  Library,
  Link,
  ShieldUser,
  Building2,
  BrainCircuit,
} from "lucide-react";

import { NavMain } from "./nav-main";

const navItems = [
  {
    title: "Agents",
    url: "/agents",
    icon: Bot,
  },
  {
    title: "Data Agents",
    url: "/data-agents",
    icon: Link,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FileText,
  },
  {
    title: "Data Projects",
    url: "/data-projects",
    icon: Library,
  },
  {
    title: "Usage Statistics",
    url: "/usage-statistics",
    icon: BarChart3,
  },
  {
    title: "User Management",
    url: "/users-management",
    icon: Users,
  },
  {
    title: "Organization Admin",
    url: "/org-admin",
    icon: ShieldUser,
  },
  {
    title: "Greywiz Admin",
    url: "/greywiz-admin",
    icon: Building2,
  },
  {
    title: "Knowledge Base",
    url: "/kbase",
    icon: BrainCircuit,
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
    >
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    className="md:h-8 md:p-0"
                  >
                    <a href="#">
                      <div className="text-red-500 flex aspect-square w-8 h-8 items-center justify-center rounded-lg">
                        <CircuitBoard className="w-5 h-5" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
              <NavMain items={navItems} />
            </SidebarContent>
          </div>
        </div>
      </Sidebar>
    </Sidebar>
  );
}
