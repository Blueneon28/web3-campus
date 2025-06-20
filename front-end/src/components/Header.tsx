"use client";
import { Box, Flex, Text } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { shortenAddress } from "@/utils/helpers";
import { contracts } from "@/constants/contracts";

interface IHeaderProps {
  withBorder: boolean;
}

const Header: React.FC<IHeaderProps> = ({ withBorder }) => {
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
      py="18px"
      style={withBorder ? { borderBottom: "solid 1px rgb(237, 237, 237)" } : {}}
    >
      <Flex className="layout" align="center" justify="space-between">
        <Text>Web3 Campus</Text>
        <Flex align="center" gap="4px">
          {role === "Student" ? (
            <Text>Student Dashboard</Text>
          ) : role === "Merchant" ? (
            <Text>Merchant Dashboard</Text>
          ) : role === "Admin" ? (
            <Text>Admin Dashboard</Text>
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
