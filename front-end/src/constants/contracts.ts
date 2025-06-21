/** @format */

import CAMPUS_CONTRACT_ABI_JSON from "./abi/CampusCreditABI.json";
import STUDENT_ID_CONTRACT_ABI_JSON from "./abi/StudentIDAbi.json";

import COURSE_BADHE_CONTRACT_ABI_JSON from "./abi/CourseBadgeABI.json";


export const CampusCreditABI = CAMPUS_CONTRACT_ABI_JSON;

export const contracts = {
  campusCredit: {
    address: "0xfCac010F8A91FB38c9666a70d48bc27C10C29eBF" as const,
    abi: CampusCreditABI,
  },
  studentID: {
    address: "0xfFB82c0799F2f496DBCBbB648EC9D2682F775634" as const,
    abi: STUDENT_ID_CONTRACT_ABI_JSON,
  },
  courseBadge: {

    address: "0xc523872D592BF0ba6477Fda6c10773097eB2Aa57" as const,
    abi: COURSE_BADHE_CONTRACT_ABI_JSON,

  },
} as const;
