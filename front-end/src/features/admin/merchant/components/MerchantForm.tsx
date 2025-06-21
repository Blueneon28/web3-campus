"use client";
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { ArrowLeft, IdCard, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { contracts } from "@/constants/contracts";
import toast from "react-hot-toast";
import { Colors } from "@/constants/colors";
import { config } from "@/providers/Web3Provider";

const MerchantForm = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { campusCredit } = contracts;
  const router = useRouter();
  const [merchantAddress, setMerchantAddress] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const campusCreditContract = {
    address: contracts.campusCredit.address as `0x${string}`,
    abi: contracts.campusCredit.abi,
  };

  const handleSubmit = async () => {
    if (!isConnected) return;

    setIsLoading(true);

    toast.loading(`Loading...`, {
      style: {
        background: Colors.primary,
        color: "white",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    });

    try {
      const result = await writeContractAsync({
        ...campusCreditContract,
        functionName: "registerMerchant",
        args: [merchantAddress, merchantName],
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Confirming merchant...", {
        style: {
          background: Colors.primary,
          color: "white",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });

      toast.dismiss();
    } catch (error) {
      console.error("Merchant registration failed:", error);
      toast.dismiss();
      toast.error("Merchant registration failed. Please try again.", {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });
    } finally {
      setIsLoading(false);
      setMerchantAddress("");
      setMerchantName("");
    }
  };

  return (
    <Box>
      <Paper shadow="xs" radius="md" p="xl">
        <Stack gap="lg">
          {/* Header Section */}
          <Group gap="md" align="center">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </ActionIcon>
            <div style={{ flex: 1 }}>
              <Title order={2} c="dark.8">
                Add New Merchant
              </Title>
              <Text size="sm" c="dimmed">
                Enter Merchant Data
              </Text>
            </div>
          </Group>

          <Divider />

          <Stack gap="md">
            <TextInput
              label="Merchant Address"
              placeholder="0x1234567890abcdef..."
              leftSection={<MapPin size={16} />}
              required
              onChange={(e) => setMerchantAddress(e.target.value)}
            />
            <TextInput
              label="Merchant Name"
              placeholder="MyPizza"
              leftSection={<IdCard size={16} />}
              required
              onChange={(e) => setMerchantName(e.target.value)}
            />
            <Group justify="flex-end" mt="xl">
              <Button
                variant="subtle"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                radius="md"
                size="md"
              >
                Add Merchant
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MerchantForm;
