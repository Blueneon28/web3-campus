"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Group,
  TextInput,
  Textarea,
  Title,
  Notification,
  NumberInput,
} from "@mantine/core";
import { useTransaction, useWriteContract } from "wagmi";
import { contracts } from "@/constants/contracts";
import { Check, X } from "lucide-react";

const CreateCertificateType = () => {
  const { courseBadge } = contracts;
  const [name, setName] = useState("");
  const [maxSupply, setMaxSupply] = useState<number | "">("");
  const [uri, setUri] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContract, isPending, error } = useWriteContract({
    mutation: {
      onSuccess: (hash: `0x${string}`) => {
        setTxHash(hash);
      },
    },
  });

  const transaction = useTransaction({ hash: txHash ?? undefined });
  const isTxPending = transaction.status === "pending";
  const isSuccess = transaction.status === "success";

  if (isSuccess && (name || uri || maxSupply)) {
    setName("");
    setMaxSupply("");
    setUri("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || maxSupply === "" || !uri.trim()) return;

    writeContract({
      address: courseBadge.address,
      abi: courseBadge.abi,
      functionName: "createCertificateType",
      args: [name.trim(), BigInt(maxSupply), uri.trim()],
    });
  };

  return (
    <Box maw={500}>
      <Title order={2} mb="md">
        Create Certificate Type
      </Title>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Certificate Name"
          placeholder="Example: Blockchain Basics Certificate"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
          mb="md"
        />
        <NumberInput
          label="Max Supply"
          placeholder="Example: 100"
          value={maxSupply}
          onChange={(value) => {
            if (typeof value === "number") setMaxSupply(value);
            else if (value === null || value === "") setMaxSupply("");
          }}
          required
          mb="md"
          min={1}
        />
        <Textarea
          label="Metadata URI / Description"
          placeholder="Example: https://example.com/metadata/{id}.json"
          value={uri}
          onChange={(e) => setUri(e.currentTarget.value)}
          required
          mb="md"
          autosize
          minRows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={isPending || isTxPending}
            disabled={
              isPending || isTxPending || !name || !uri || maxSupply === ""
            }
          >
            {isPending || isTxPending ? "Creating..." : "Create"}
          </Button>
        </Group>
      </form>

      {error && (
        <Notification
          color="red"
          icon={<X />}
          title="Transaction Error"
          onClose={() => setTxHash(null)}
          mt="md"
        >
          {error.message || "Transaction failed"}
        </Notification>
      )}

      {isSuccess && (
        <Notification
          color="green"
          icon={<Check />}
          title="Certificate Type Created!"
          mt="md"
        />
      )}
    </Box>
  );
};

export default CreateCertificateType;
