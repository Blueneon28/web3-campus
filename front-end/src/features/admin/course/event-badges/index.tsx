"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Textarea,
  NumberInput,
  Title,
  Notification,
  Group,
} from "@mantine/core";
import { useWriteContract, useTransaction } from "wagmi";
import { contracts } from "@/constants/contracts";
import { Check, X } from "lucide-react";

const CreateEventBadge = () => {
  const { courseBadge } = contracts;
  const [eventId, setEventId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">(1);
  const [attendeesRaw, setAttendeesRaw] = useState<string>("");
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

  useEffect(() => {
    if (isSuccess) {
      setAttendeesRaw("");
      setEventId("");
      setAmount(1);
    }
  }, [isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const attendees = attendeesRaw
      .split(",")
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);

    if (attendees.length === 0 || eventId === null || amount === null) return;

    writeContract({
      address: courseBadge.address,
      abi: courseBadge.abi,
      functionName: "mintEventBadges",
      args: [attendees, BigInt(eventId), BigInt(amount)],
    });
  };

  return (
    <Box maw={600}>
      <Title order={2} mb="md">
        Create Event Badge
      </Title>

      <form onSubmit={handleSubmit}>
        <NumberInput
          label="Event ID"
          value={eventId}
          onChange={(value) => {
            if (typeof value === "number") setEventId(value);
            else if (value === null || value === "") setEventId("");
          }}
          placeholder="e.g., 2000"
          required
          mb="md"
        />

        <NumberInput
          label="Badge Amount Per Attendee"
          value={amount}
          onChange={(value) => {
            if (typeof value === "number") setAmount(value);
            else if (value === null || value === "") setAmount("");
          }}
          min={1}
          required
          mb="md"
        />

        <Textarea
          label="Attendees (comma-separated addresses)"
          placeholder="0xabc...,0xdef...,0xghi..."
          value={attendeesRaw}
          onChange={(e) => setAttendeesRaw(e.currentTarget.value)}
          autosize
          required
          minRows={4}
          mb="md"
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isPending || isTxPending}
            disabled={
              isPending ||
              isTxPending ||
              !attendeesRaw ||
              eventId === null ||
              amount === null
            }
          >
            {isPending || isTxPending ? "Minting..." : "Mint Badges"}
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
          title="Event Badges Minted!"
          mt="md"
        />
      )}
    </Box>
  );
};

export default CreateEventBadge;
