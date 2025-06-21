"use client";
import Header from "@/components/Header";
import SidebarItem from "@/components/SidebarItem";
import { Box, Flex, Stack } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import {
  ScrollText,
  FilePlus2,
  Users2,
  Medal,
  Presentation,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Colors } from "@/constants/colors";

const sidebarItems = [
  {
    title: "Issue Certificate",
    icon: ScrollText,
    path: "/dashboard/admin/course/issue-certificate",
  },
  {
    title: "Create Certificate Type",
    icon: FilePlus2,
    path: "/dashboard/admin/course/create-certificate",
  },
  {
    title: "Event Badges",
    icon: Users2,
    path: "/dashboard/admin/course/event-badges",
  },
  {
    title: "Grant Achievement",
    icon: Medal,
    path: "/dashboard/admin/course/grant-achievement",
  },
  {
    title: "Workshop Series",
    icon: Presentation,
    path: "/dashboard/admin/course/workshops",
  },
  // {
  //   title: "Student Badges",
  //   icon: BadgeCheck,
  //   path: "/dashboard/admin/course/student-badges",
  // },
  {
    title: "Verify Badge",
    icon: ShieldCheck,
    path: "/dashboard/admin/course/verify-badge",
  },
];

const CourseDashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Box>
      <Header withBorder />
      <Flex className="layout" mt="50px">
        <Box w="20%">
          <Stack gap="30px">
            {sidebarItems.map(({ title, icon: Icon, path }) => {
              const isActive =
                title === "Dashboard"
                  ? pathname === path
                  : pathname.startsWith(path);
              return (
                <SidebarItem
                  key={title}
                  title={title}
                  isActive={isActive}
                  icon={
                    <Icon
                      strokeWidth={isActive ? 2 : 1.75}
                      absoluteStrokeWidth
                      color={isActive ? Colors.primary : "gray"}
                    />
                  }
                  route={path}
                />
              );
            })}
          </Stack>
        </Box>
        <Box w="80%" pl='60px'>{children}</Box>
      </Flex>
    </Box>
  );
};

export default CourseDashboardLayout;
