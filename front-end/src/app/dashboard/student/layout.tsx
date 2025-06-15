"use client";
import Header from "@/components/Header";
import SidebarItem from "@/components/SidebarItem";
import { Box, Flex, Stack } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  History,
  ShieldUser,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Colors } from "@/constants/colors";

const sidebarItems = [
  { title: "Profile", icon: ShieldUser, path: "/dashboard/student" },
  {
    title: "Topup",
    icon: BanknoteArrowUp,
    path: "/dashboard/student/topup",
  },
  {
    title: "Withdraw",
    icon: BanknoteArrowDown,
    path: "/dashboard/student/withdraw",
  },
  { title: "History", icon: History, path: "/dashboard/student/history" },
];

const StudentDashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Box>
      <Header withBorder />
      <Flex className="layout" mt="50px">
        <Box w="20%">
          <Stack gap="30px">
            {sidebarItems.map(({ title, icon: Icon, path }) => {
              const isActive =
                title === "Profile"
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
        <Box w="80%">{children}</Box>
      </Flex>
    </Box>
  );
};

export default StudentDashboardLayout;
