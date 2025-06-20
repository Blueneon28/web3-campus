/** @format */

"use client";
import Header from "@/components/Header";
import SidebarItem from "@/components/SidebarItem";
import { Box, Flex, Stack } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { LayoutDashboard, ShieldUser, Store } from "lucide-react";
import { usePathname } from "next/navigation";
import { Colors } from "@/constants/colors";

const sidebarItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
  {
    title: "Student",
    icon: ShieldUser,
    path: "/dashboard/admin/student",
  },
  { title: "Merchant", icon: Store, path: "/dashboard/admin/merchant" },
];

const AdminDashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  return (
    <Box>
      <Header withBorder />
      <Flex className="layout" mt="120px">
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
        <Box w="80%">{children}</Box>
      </Flex>
    </Box>
  );
};

export default AdminDashboardLayout;
