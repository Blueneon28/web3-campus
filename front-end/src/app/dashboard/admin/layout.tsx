/** @format */

"use client";
import Header from "@/components/Header";
import SidebarItem from "@/components/SidebarItem";
import { Box, Flex, Stack } from "@mantine/core";
import React, { PropsWithChildren, useEffect, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldUser,
  Store,
  Settings,
  Library,
} from "lucide-react";
import { Colors } from "@/constants/colors";
import { useAccount, useReadContract } from "wagmi";
import { contracts } from "@/constants/contracts";

const sidebarItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
  {
    title: "Student",
    icon: ShieldUser,
    path: "/dashboard/admin/student",
  },
  { title: "Merchant", icon: Store, path: "/dashboard/admin/merchant" },
  { title: "Course", icon: Library, path: "/dashboard/admin/course" },
  { title: "Control", icon: Settings, path: "/dashboard/admin/control" },
];

const AdminDashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { campusCredit } = contracts;

  const { data: isAdmin } = useReadContract({
    address: campusCredit.address,
    abi: campusCredit.abi,
    functionName: "hasRole",
    args: address
      ? [
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          address,
        ]
      : undefined,
    query: {
      enabled: !!address,
    },
  });

  useLayoutEffect(() => {
    if (!isConnected || !isAdmin) {
      router.push("/");
    }
  }, [isConnected, address]);

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
