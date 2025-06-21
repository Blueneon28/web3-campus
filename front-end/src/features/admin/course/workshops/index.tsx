"use client";
import { useState } from "react";
import {
  Box,
  Button,
  NumberInput,
  TextInput,
  Title,
  Notification,
  Group,
} from "@mantine/core";
import { useWriteContract, useTransaction } from "wagmi";
import { contracts } from "@/constants/contracts";
import { Check, X } from "lucide-react";

const CreateWorkshop = () => {
  const { courseBadge } = contracts;
  const [seriesName, setSeriesName] = useState<string>("");
  const [totalSessions, setTotalSessions] = useState<number | "">("");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContract, isPending, error } = useWriteContract({
    mutation: {
      onSuccess: (hash) => setTxHash(hash),
    },
  });

  const transaction = useTransaction({ hash: txHash ?? undefined });
  const isTxPending = transaction.status === "pending";
  const isSuccess = transaction.status === "success";

  const handleReset = () => {
    setTxHash(null);
  };

  if (isSuccess && (seriesName || totalSessions)) {
    setSeriesName("");
    setTotalSessions("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesName.trim() || totalSessions === "") return;

    writeContract({
      address: courseBadge.address,
      abi: courseBadge.abi,
      functionName: "createWorkshopSeries",
      args: [seriesName.trim(), BigInt(totalSessions)],
    });
  };

  return (
    <Box maw={500}>
      <Title order={2} mb="md">
        Create Workshop Series
      </Title>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Series Name"
          placeholder="e.g., Solidity Fundamentals Series"
          value={seriesName}
          onChange={(e) => setSeriesName(e.currentTarget.value)}
          required
          mb="md"
        />

        <NumberInput
          label="Total Sessions"
          placeholder="e.g., 5"
          value={totalSessions}
          onChange={(value) => {
            if (typeof value === "number") setTotalSessions(value);
            else if (value === null || value === "") setTotalSessions("");
          }}
          min={1}
          required
          mb="md"
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isPending || isTxPending}
            disabled={
              isPending || isTxPending || !seriesName || totalSessions === ""
            }
          >
            {isPending || isTxPending ? "Creating..." : "Create Workshop"}
          </Button>
        </Group>
      </form>

      {error && (
        <Notification
          color="red"
          icon={<X />}
          title="Transaction Error"
          onClose={handleReset}
          mt="md"
        >
          {error?.message || "Transaction failed"}
        </Notification>
      )}

      {isSuccess && (
        <Notification
          color="green"
          icon={<Check />}
          title="Workshop Series Created!"
          mt="md"
        ></Notification>
      )}
    </Box>
  );
};

export default CreateWorkshop;
