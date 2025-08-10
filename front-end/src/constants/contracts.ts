/** @format */

import CAMPUS_CONTRACT_ABI_JSON from "./abi/CampusCreditABI.json";
import STUDENT_ID_CONTRACT_ABI_JSON from "./abi/StudentIDABI.json";

import COURSE_BADHE_CONTRACT_ABI_JSON from "./abi/CourseBadgeABI.json";

export const CampusCreditABI = CAMPUS_CONTRACT_ABI_JSON;

export const contracts = {
  campusCredit: {
    address: "0x7d04A78146c401d249FFddf734bC1506029B6ee9" as const,
    abi: CampusCreditABI,
  },
  studentID: {
    address: "0xfFB82c0799F2f496DBCBbB648EC9D2682F775634" as const,
    abi: STUDENT_ID_CONTRACT_ABI_JSON,
  },
  courseBadge: {
    address: "0x186813C91fE45d7044131e30072E4a5CF4bd4770" as const,
    abi: COURSE_BADHE_CONTRACT_ABI_JSON,
  },
} as const;
