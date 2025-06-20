"use client";
import { Colors } from "@/constants/colors";
import { Box, Button, Flex, Paper, Table, Text } from "@mantine/core";
import React from "react";
import MerchantTable from "./components/MerchantTable";
import { useRouter } from "next/navigation";
import { useReadContract } from "wagmi";
import { contracts } from "@/constants/contracts";

const merchantLists = [
  { id: 1, address: "0x123...da3", name: "Merchant 1" },
  { id: 2, address: "0x456...aws", name: "Merchant 2" },
  { id: 3, address: "0x789...0pl", name: "Merchant 3" },
  { id: 4, address: "0x209...11d", name: "Merchant 4" },
];

const AdminDashboardMerchant = () => {
  const router = useRouter();

  return (
    <Box>
      <Flex align="center" justify="space-between">
        <Text size="24px" fw="700" lts="-0.25px" color={Colors.primary}>
          Merchant Management
        </Text>
        <Button onClick={() => router.push("/dashboard/admin/merchant/add")}>
          Add Merchant
        </Button>
      </Flex>
      <Paper
        mt="20px"
        w="100%"
        radius="lg"
        px="20px"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box mt="20px">
          <MerchantTable merchants={merchantLists} />
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboardMerchant;
