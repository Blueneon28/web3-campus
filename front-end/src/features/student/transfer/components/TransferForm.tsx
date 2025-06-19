"use client";
import { Colors } from "@/constants/colors";
import {
  Box,
  Button,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/providers/Web3Provider";
import { contracts } from "@/constants/contracts";
import { parseUnits } from "viem";

const campusCreditContract = {
  address: contracts.campusCredit.address as `0x${string}`,
  abi: contracts.campusCredit.abi,
};

const TransferForm = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [amount, setAmount] = useState<string | number>("");
  const [recipient, setRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTransfer = async () => {
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
        functionName: "transfer",
        args: [recipient, parseUnits(amount.toString(), 18)],
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Confirming transfer...", {
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
      console.error("Transfer failed:", error);
      toast.dismiss();
      toast.error("Transfer failed. Please try again.", {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });
    } finally {
      setIsLoading(false);
      setAmount(0);
      setRecipient("");
    }
  };

  return (
    <Paper
      radius="lg"
      p="xl"
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Text size="24px" fw="700" lts="-0.25px" color={Colors.primary}>
        Transfer
      </Text>
      <Stack mt="35px" gap="20px">
        <Stack gap="6px">
          <Text fw="500">You will send</Text>
          <NumberInput
            placeholder="Amount"
            styles={{
              input: {
                height: "60px",
                borderColor: "#ced4da",
                borderRadius: "10px",
              },
            }}
            thousandSeparator=","
            hideControls
            value={amount}
            onChange={setAmount}
          />
        </Stack>
        <Stack gap="6px">
          <Text fw="500">Recipient</Text>
          <TextInput
            placeholder="Recipient wallet address"
            styles={{
              input: {
                height: "60px",
                borderColor: "#ced4da",
                borderRadius: "10px",
              },
            }}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Stack>
        <Button
          mt="20px"
          h="50px"
          radius="50px"
          color={Colors.primary}
          loading={isLoading}
          onClick={() => handleTransfer()}
        >
          Send
        </Button>
      </Stack>
    </Paper>
  );
};

export default TransferForm;
