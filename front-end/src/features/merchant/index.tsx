"use client";
import { Box, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { contracts } from "@/constants/contracts";
import { useAccount, useReadContract } from "wagmi";
import { shortenAddress } from "@/utils/helpers";

const MerchantDashboard = () => {
  const { address, isConnected } = useAccount();
  const { campusCredit } = contracts;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [merchantName, setMerchantName] = useState<string>("");

  const { data: detailMerchant } = useReadContract({
    address: campusCredit.address,
    abi: campusCredit.abi,
    functionName: "merchantName",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (!isConnected) {
      setMerchantName("");
    }
  }, [isConnected]);

  useEffect(() => {
    setLoading(true);

    setMerchantName(detailMerchant as string);

    setLoading(false);
  }, [detailMerchant, address]);

  return (
    <Box>
      {isConnected ? (
        <Text>{isLoading ? "Loading..." : `Hello, ${merchantName}`}</Text>
      ) : (
        <Text>No data</Text>
      )}
    </Box>
  );
};

export default MerchantDashboard;
