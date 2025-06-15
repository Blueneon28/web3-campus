import CAMPUS_CONTRACT_ABI_JSON from "./abi/CampusCreditABI.json";

export const CampusCreditABI = CAMPUS_CONTRACT_ABI_JSON;

export const contracts = {
  campusCredit: {
    address: "0xEb87243B2c4b8553e001ff7645b2E07A5578c969" as const,
    abi: CampusCreditABI,
  },
  // studentID: {
  //   address: '0x...' as const,
  //   abi: StudentIDABI,
  // },
  // courseBadge: {
  //   address: '0x...' as const,
  //   abi: CourseBadgeABI,
  // },
} as const;
