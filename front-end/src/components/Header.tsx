"use client";
import { Box, Flex, Image, Text } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { shortenAddress } from "@/utils/helpers";
import { contracts } from "@/constants/contracts";
import { useRouter } from "next/navigation";

interface IHeaderProps {
  withBorder: boolean;
}

const Header: React.FC<IHeaderProps> = ({ withBorder }) => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [role, setRole] = useState<string>("");
  const { studentID, campusCredit } = contracts;

  const { data: detailStudent } = useReadContract({
    address: studentID.address,
    abi: studentID.abi,
    functionName: "getStudentByAddress",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: detailMerchant } = useReadContract({
    address: campusCredit.address,
    abi: campusCredit.abi,
    functionName: "isMerchant",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (isConnected) {
      if (detailStudent) {
        setRole("Student");
      } else if (detailMerchant) {
        setRole("Merchant");
      }
    } else {
      setRole("");
    }
  }, [isConnected, detailStudent, detailMerchant]);

  return (
    <Box
      py="15px"
      pos="fixed"
      top="0px"
      right="0px"
      left="0px"
      bg="rgba(255, 255, 255, 0.8)"
      style={{
        zIndex: "10",
        backdropFilter: "blur(10px)",
        borderBottom: "solid 1px rgb(237, 237, 237)",
      }}
    >
      <Flex className="layout" align="center" justify="space-between">
        <Image
          src="/logo.png"
          alt="Web3 Campus Logo"
          h={55}
          w="auto"
          fit="contain"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/")}
        />
        <Flex align="center" gap="10px">
          {role === "Student" ? (
            <Text
              onClick={() => router.push("/dashboard/student")}
              style={{ cursor: "pointer" }}
              fw="500"
            >
              Student Dashboard
            </Text>
          ) : role === "Merchant" ? (
            <Text
              onClick={() => router.push("/dashboard/merchant")}
              style={{ cursor: "pointer" }}
              fw="500"
            >
              Merchant Dashboard
            </Text>
          ) : role === "Admin" ? (
            <Text
              onClick={() => router.push("/dashboard/admin")}
              style={{ cursor: "pointer" }}
              fw="500"
            >
              Admin Dashboard
            </Text>
          ) : (
            <></>
          )}
          <ConnectButton />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
