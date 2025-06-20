/** @format */
"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";

import { contracts } from "@/constants/contracts";
import { config } from "@/providers/Web3Provider";

import {
  Button,
  Group,
  Text,
  Paper,
  Stack,
  Modal,
  Alert,
  Badge,
} from "@mantine/core";
import { CircleAlert, Pause } from "lucide-react";

export default function AdminControl() {
  const { campusCredit } = contracts;
  const { address: walletAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isShow, setShow] = useState<boolean>(false);

  const { data: isPaused, refetch: refetchPaused } = useReadContract({
    address: campusCredit.address,
    abi: campusCredit.abi,
    functionName: "paused",
  });

  console.log(isPaused);

  const handleAction = async () => {
    try {
      setLoading(true);
      const result = await writeContractAsync({
        address: campusCredit.address,
        abi: campusCredit.abi,
        functionName: isPaused ? "unpause" : "pause",
        account: walletAddress as `0x${string}`,
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });
      setLoading(false);
      refetchPaused();
      setShow(false);
    } catch (e) {
      console.log(e);
      setShow(false);
      setLoading(false);
    }
  };

  useWatchContractEvent({
    address: campusCredit.address,
    abi: campusCredit.abi,
    eventName: "Paused",
    onLogs(log) {
      console.log("log", log);
    },
  });

  useWatchContractEvent({
    address: campusCredit.address,
    abi: campusCredit.abi,
    eventName: "Unpaused",
    onLogs(log) {
      console.log("log", log);
    },
  });

  return (
    <Paper shadow="xs" p="xl" radius="md">
      <Stack gap="lg">
        {/* Header Section */}
        <Group justify="space-between" align="center">
          <div>
            <Group>
              <Text size="xl" fw={600} c="dark.8">
                Transaction Status
              </Text>
              {isPaused === undefined ? (
                <Badge color="gray">Loading</Badge>
              ) : isPaused ? (
                <Badge color="yellow">Paused</Badge>
              ) : (
                <Badge color="blue">Active</Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed">
              Pause or Unpause all contract transaction
            </Text>
          </div>
          <Button
            leftSection={<Pause size={16} />}
            onClick={() => setShow(true)}
            radius="md"
            size="sm"
            disabled={isPaused === undefined}
          >
            {isLoading
              ? "Loading..."
              : isPaused
              ? "Unpause Transaction"
              : "Pause Transaction"}
          </Button>
        </Group>
      </Stack>
      <Modal
        opened={isShow}
        onClose={() => {
          setShow(false);
        }}
        title={
          <Group gap="xs">
            <Text fw={700} size="lg">
              Confirm Action
            </Text>
          </Group>
        }
        centered
        radius="md"
        size="md"
      >
        <Stack gap="lg">
          <Alert
            variant="light"
            color="yellow"
            icon={<CircleAlert size="1rem" />}
            title={`${isPaused ? "Unpause" : "Pause"} Contract Transactions`}
          >
            <Text size="sm">
              {!isPaused
                ? "This action will immediately pause all transaction functions on the smart contract. Users will be unable to interact with the contract until it is manually resumed."
                : "This action will resume all transaction functions on the smart contract. Users will be able to interact with the contract normally."}
            </Text>
          </Alert>

          <Group justify="flex-end" gap="md" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => {
                setShow(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              onClick={() => handleAction()}
              loading={isLoading}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
}
