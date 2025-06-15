import CAMPUS_CONTRACT_ABI_JSON from "./abi/CampusCreditABI.json";

export const CampusCreditABI = CAMPUS_CONTRACT_ABI_JSON;

export const contracts = {
  campusCredit: {
    address: "0xfCac010F8A91FB38c9666a70d48bc27C10C29eBF" as const,
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
