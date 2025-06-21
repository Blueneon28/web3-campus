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

const GrantAchievement = () => {
  const { courseBadge } = contracts;
  const [student, setStudent] = useState<string>("");
  const [achievementName, setAchievementName] = useState<string>("");
  const [rarity, setRarity] = useState<number | "">("");
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

  if (isSuccess && (student || achievementName || rarity)) {
    setStudent("");
    setAchievementName("");
    setRarity("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.trim() || !achievementName.trim() || rarity === null) return;

    writeContract({
      address: courseBadge.address,
      abi: courseBadge.abi,
      functionName: "grantAchievement",
      args: [student.trim(), achievementName.trim(), BigInt(rarity)],
    });
  };

  return (
    <Box maw={500}>
      <Title order={2} mb="md">
        Grant Achievement
      </Title>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Student Address"
          placeholder="0xabc..."
          value={student}
          onChange={(e) => setStudent(e.currentTarget.value)}
          required
          mb="md"
        />

        <TextInput
          label="Achievement Name"
          placeholder="e.g., Top Performer"
          value={achievementName}
          onChange={(e) => setAchievementName(e.currentTarget.value)}
          required
          mb="md"
        />

        <NumberInput
          label="Rarity (Number)"
          placeholder="e.g., 1"
          value={rarity}
          onChange={(value) => {
            if (typeof value === "number") setRarity(value);
            else if (value === null || value === "") setRarity("");
          }}
          min={0}
          required
          mb="md"
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isPending || isTxPending}
            disabled={
              isPending ||
              isTxPending ||
              !student ||
              !achievementName ||
              rarity === null
            }
          >
            {isPending || isTxPending ? "Granting..." : "Grant Achievement"}
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
          title="Achievement Granted!"
          mt="md"
        ></Notification>
      )}
    </Box>
  );
};

export default GrantAchievement;
