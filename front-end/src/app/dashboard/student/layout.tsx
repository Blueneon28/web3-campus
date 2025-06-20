"use client";
import Header from "@/components/Header";
import SidebarItem from "@/components/SidebarItem";
import { Box, Flex, Stack } from "@mantine/core";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  History,
  Send,
  ShieldUser,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Colors } from "@/constants/colors";
import { useAccount, useReadContract } from "wagmi";
import { contracts } from "@/constants/contracts";

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
  {
    title: "Transfer",
    icon: Send,
    path: "/dashboard/student/transfer",
  },
  { title: "History", icon: History, path: "/dashboard/student/history" },
];

const StudentDashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { studentID } = contracts;

  const { data: detailStudent } = useReadContract({
    address: studentID.address,
    abi: studentID.abi,
    functionName: "getStudentByAddress",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useLayoutEffect(() => {
    if (!isConnected || !detailStudent) {
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
