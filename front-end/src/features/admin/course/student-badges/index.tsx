"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  Image,
  Text,
  Title,
  SimpleGrid,
  Loader,
  Notification,
  Group,
} from "@mantine/core";
import { useAccount } from "wagmi";
import { readContract } from "wagmi/actions";
import { contracts } from "@/constants/contracts";
import { X } from "lucide-react";
import { config } from "@/providers/Web3Provider";

const StudentBadgesPage = () => {
  const { address } = useAccount();
  const { courseBadge } = contracts;

  const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([]);
  const [tokenURIs, setTokenURIs] = useState<{ [tokenId: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTokenIds = useMemo(() => [1, 2, 3, 4, 5, 6], []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;

      setLoading(true);
      setError(null);

      try {
        const balances = await Promise.all(
          availableTokenIds.map(async (id) => {
            const balance = await readContract(config, {
              address: courseBadge.address,
              abi: courseBadge.abi,
              functionName: "balanceOf",
              args: [address, BigInt(id)],
            });
            return [id, balance as bigint];
          })
        );

        const owned = balances
          .filter(([_, bal]) => bal > 0n)
          .map(([id]) => Number(id));

        setOwnedTokenIds(owned);

        // fetch URIs for owned tokens
        const uriEntries = await Promise.all(
          owned.map(async (id) => {
            const uri = await readContract(config, {
              address: courseBadge.address,
              abi: courseBadge.abi,
              functionName: "uri",
              args: [BigInt(id)],
            });
            return [id, parseURI(uri as string)];
          })
        );
        setTokenURIs(Object.fromEntries(uriEntries));
      } catch (err) {
        setError((err as Error).message || "Failed to load badges");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [address, availableTokenIds, courseBadge.address, courseBadge.abi]);

  return (
    <Box>
      <Title order={2} mb="md">
        Your Badges
      </Title>

      {loading ? (
        <Loader />
      ) : error ? (
        <Notification color="red" icon={<X />} title="Error" mt="md">
          {error}
        </Notification>
      ) : ownedTokenIds.length === 0 ? (
        <Text>No badges found.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {ownedTokenIds.map((tokenId) => (
            <Card key={tokenId} shadow="sm" padding="lg" radius="md" withBorder>
              {tokenURIs[tokenId] && (
                <Image
                  src={tokenURIs[tokenId]}
                  alt={`Badge ${tokenId}`}
                  height={160}
                  fit="contain"
                  mb="sm"
                />
              )}
              <Group justify="space-between">
                <Text fw={500}>Token #{tokenId}</Text>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default StudentBadgesPage;

// Decode ERC-1155 URI
function parseURI(uri: string): string {
  if (uri.startsWith("data:application/json;base64,")) {
    try {
      const decoded = atob(uri.split(",")[1]);
      const json = JSON.parse(decoded);
      return json.image || "";
    } catch {
      return "";
    }
  }
  return uri;
}
