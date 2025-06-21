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
} from "@mantine/core";
import { useTransaction, useWriteContract } from "wagmi";
import { contracts } from "@/constants/contracts";
import { Check, X } from "lucide-react";

const IssueCertificate = () => {
  const { courseBadge } = contracts;
  const [toAddress, setToAddress] = useState("");
  const [certificateTypeId, setCertificateTypeId] = useState("");
  const [additionalData, setAdditionalData] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContract, isPending, error } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setTxHash(hash);
      },
    },
  });

  const transaction = useTransaction({ hash: txHash ?? undefined });
  const isTxPending = transaction.status === "pending";
  const isSuccess = transaction.status === "success";

  const handleReset = () => {
    setTxHash(null);
  };

  // Reset form when transaction is successful
  if (isSuccess && (toAddress || certificateTypeId || additionalData)) {
    setToAddress("");
    setCertificateTypeId("");
    setAdditionalData("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toAddress.trim() || certificateTypeId === "") return;

    writeContract({
      address: courseBadge.address,
      abi: courseBadge.abi,
      functionName: "issueCertificate",
      args: [
        toAddress.trim(),
        BigInt(certificateTypeId),
        additionalData.trim(),
      ],
    });
  };

  return (
    <Box maw={500}>
      <Title order={2} mb="md">
        Issue Certificate
      </Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Student Address (Wallet)"
          placeholder="0x..."
          value={toAddress}
          onChange={(e) => setToAddress(e.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          label="Certificate Type ID"
          placeholder="e.g., 1"
          value={certificateTypeId}
          onChange={(e) => setCertificateTypeId(e.currentTarget.value)}
          required
          mb="md"
        />
        <Textarea
          label="Additional Data"
          placeholder="e.g., Passed with Distinction, or https://metadata.link"
          value={additionalData}
          onChange={(e) => setAdditionalData(e.currentTarget.value)}
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
              isPending ||
              isTxPending ||
              !toAddress ||
              !certificateTypeId ||
              !additionalData
            }
          >
            {isPending || isTxPending ? "Issuing..." : "Issue Certificate"}
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
          title="Certificate Issued!"
          mt="md"
        ></Notification>
      )}
    </Box>
  );
};

export default IssueCertificate;
