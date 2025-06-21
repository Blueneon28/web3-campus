"use client";
import {
  Box,
  Button,
  Input,
  Title,
  Text,
  Notification,
  Loader,
  Stack,
} from "@mantine/core";
import { useState } from "react";
import { readContract } from "wagmi/actions";
import { useAccount } from "wagmi";
import { contracts } from "@/constants/contracts"; // pastikan ini tersedia
import { Check, X } from "lucide-react";
import { config } from "@/providers/Web3Provider";

const VerifyBadge = () => {
  const { address } = useAccount();
  const { courseBadge } = contracts;

  const [tokenIdInput, setTokenIdInput] = useState("");
  const [badgeInfo, setBadgeInfo] = useState<{ uri: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setBadgeInfo(null);

    try {
      const tokenId = BigInt(tokenIdInput);

      // Cek kepemilikan
      const balance = await readContract(config, {
        address: courseBadge.address,
        abi: courseBadge.abi,
        functionName: "balanceOf",
        args: [address, tokenId],
      });

      if (balance === 0n) {
        setError("You don't own this badge.");
        return;
      }

      // Ambil token URI
      const uri = await readContract(config, {
        address: courseBadge.address,
        abi: courseBadge.abi,
        functionName: "uri", // asumsi standar ERC-1155
        args: [tokenId],
      });

      setBadgeInfo({ uri: uri as string });
    } catch (err) {
      setError((err as Error).message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Title order={2} mb="md">
        Verify Badge Ownership
      </Title>

      <Stack gap="sm" mb="md" maw={400}>
        <Input
          placeholder="Enter Token ID"
          value={tokenIdInput}
          onChange={(e) => setTokenIdInput(e.currentTarget.value)}
          type="number"
        />
        <Button onClick={handleVerify} disabled={!tokenIdInput || loading}>
          {loading ? <Loader size="xs" color="white" /> : "Verify"}
        </Button>
      </Stack>

      {error && (
        <Notification title="Not Found" color="red" icon={<X />} mb="md">
          {error}
        </Notification>
      )}

      {badgeInfo && (
        <Notification
          title="Badge Found"
          color="green"
          icon={<Check />}
          mb="md"
        >
          <Text>Metadata URI:</Text>
          <Text>{badgeInfo.uri}</Text>
        </Notification>
      )}
    </Box>
  );
};

export default VerifyBadge;
