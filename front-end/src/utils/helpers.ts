/** @format */

import { formatUnits, parseUnits } from "viem";

export function shortenAddress(address: string, prefixLen = 5, suffixLen = 4) {
  if (typeof address !== "string" || !address.startsWith("0x")) {
    return "";
  }

  if (address.length <= prefixLen + suffixLen) {
    return "";
  }

  const prefix = address.slice(0, prefixLen);
  const suffix = address.slice(-suffixLen);
  return `${prefix}......${suffix}`;
}

export function parseEther2Int(value: bigint, decimals = 18) {
  return value ? formatUnits(value, decimals) : "0";
}

export function parseInt2Ether(value: number, decimals = 18) {
  return value ? parseUnits(value.toString(), decimals) : "0";
}
