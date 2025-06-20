// /** @format */

// "use client";

// import React, { useState, useEffect } from "react";
// import { useAccount, useReadContract } from "wagmi";
// import { shortenAddress } from "@/utils/helpers";
// import { contracts } from "@/constants/contracts";
// import {
//   Box,
//   Paper,
//   Stack,
//   Group,
//   Title,
//   Text,
//   Badge,
//   ActionIcon,
//   Avatar,
//   Card,
//   SimpleGrid,
//   Divider,
//   CopyButton,
//   Tooltip,
//   ThemeIcon,
//   Skeleton,
//   Alert,
// } from "@mantine/core";
// import {
//   User,
//   GraduationCap,
//   IdCard,
//   MapPin,
//   Copy,
//   Check,
//   Award,
//   AlertCircle,
//   Hash,
//   Calendar,
//   ExternalLink,
// } from "lucide-react";

// interface StudentDetail {
//   tokenId: number;
//   name: string;
//   nim: string;
//   major: string;
//   semester: number;
//   enrollmentYear: number;
//   expiryDate: number;
//   status: boolean;
//   uri: string;
// }

// interface CertificateNFT {
//   tokenId: string;
//   name: string;
//   category: string;
//   uri: string;
//   amount: number;
//   isValid: boolean;
//   earnedTimestamp: number;
//   contractAddress?: string;
//   blockchain?: string;
//   rarity?: string;
//   metadata?: {
//     description?: string;
//     attributes?: Array<{
//       trait_type: string;
//       value: string | number;
//     }>;
//   };
// }

// const courseBadgeContract = {
//   address: contracts.courseBadge.address,
//   abi: contracts.courseBadge.abi,
// };

// // Custom hook untuk mengambil detail NFT certificates
// const useNFTCertificates = (address: `0x${string}` | undefined, studentBadges: bigint[] | undefined) => {
//   const [certificates, setCertificates] = useState<CertificateNFT[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchNFTCertificates = async () => {
//       if (!address || !studentBadges || studentBadges.length === 0) {
//         setCertificates([]);
//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         const nftCertificates = await Promise.all(
//           studentBadges.map(async (tokenId, index) => {
//             try {
//               // Simulate different certificate types and rarities
//               const categories = ["Course", "Achievement", "Certification", "Event", "Project"];
//               const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
//               const courseNames = [
//                 "Blockchain Fundamentals",
//                 "Smart Contract Development",
//                 "Web3 Security",
//                 "DeFi Protocols",
//                 "NFT Creation & Trading",
//                 "Cryptocurrency Trading",
//                 "Solidity Programming",
//                 "Ethereum Development",
//               ];

//               const category = categories[index % categories.length];
//               const rarity = rarities[Math.floor(Math.random() * rarities.length)];
//               const courseName = courseNames[index % courseNames.length];

//               return {
//                 tokenId: tokenId.toString(),
//                 name: `${courseName} Certificate`,
//                 category: category,
//                 uri: `ipfs://QmHash${tokenId.toString()}`,
//                 amount: 1,
//                 isValid: true,
//                 earnedTimestamp: Date.now() / 1000 - index * 86400 * 7, // Staggered dates
//                 contractAddress: contracts.courseBadge.address,
//                 blockchain: "Ethereum",
//                 rarity: rarity,
//                 metadata: {
//                   description: `This NFT certificate represents completion of ${courseName} course with ${rarity.toLowerCase()} achievement level.`,
//                   attributes: [
//                     { trait_type: "Course Type", value: category },
//                     { trait_type: "Rarity", value: rarity },
//                     {
//                       trait_type: "Completion Date",
//                       value: new Date(Date.now() - index * 86400 * 7 * 1000)
//                         .toISOString()
//                         .split("T")[0],
//                     },
//                     { trait_type: "Score", value: Math.floor(Math.random() * 40) + 60 },
//                     { trait_type: "Blockchain", value: "Ethereum" },
//                   ],
//                 },
//               };
//             } catch (error) {
//               console.error(`Error processing NFT ${tokenId}:`, error);
//               return {
//                 tokenId: tokenId.toString(),
//                 name: "Error Loading NFT",
//                 category: "Error",
//                 uri: "",
//                 amount: 0,
//                 isValid: false,
//                 earnedTimestamp: 0,
//                 rarity: "Common",
//                 metadata: {},
//               };
//             }
//           })
//         );
//         setCertificates(nftCertificates);
//       } catch (error) {
//         console.error("Error fetching NFT certificates:", error);
//         setError("Failed to load NFT certificates");
//         setCertificates([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchNFTCertificates();
//   }, [address, studentBadges]);

//   return { certificates, isLoading, error };
// };

// const StudentDashboard = () => {
//   const { address, isConnected } = useAccount();
//   const { studentID } = contracts;
//   const [detail, setDetail] = useState<StudentDetail>();
//   const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

//   // Read contract untuk mendapatkan detail student
//   const { data: detailStudent } = useReadContract({
//     address: studentID.address,
//     abi: studentID.abi,
//     functionName: "getStudentByAddress",
//     args: address ? [address] : undefined,
//     query: { enabled: !!address },
//   });

//   // Read contract untuk mendapatkan daftar NFT certificates
//   const { data: studentBadges, isLoading: isLoadingBadges, error: badgesError } = useReadContract<bigint[]>({
//     ...courseBadgeContract,
//     functionName: "getStudentBadges",
//     args: address ? [address as `0x${string}`] : undefined,
//     query: {
//       enabled: !!address,
//       retry: false,
//       staleTime: 30000,
//     },
//   });

//   // Menggunakan custom hook untuk detail NFT certificates
//   const { certificates, isLoading: isLoadingCertificates, error: certificatesError } = useNFTCertificates(
//     address,
//     studentBadges as bigint[] | undefined
//   );

//   const isNoCertificatesError = badgesError?.message?.includes('returned no data ("0x")');
//   const hasValidBadgesData: boolean = !!studentBadges && Array.isArray(studentBadges) && studentBadges.length > 0;

//   // Set detail student
//   useEffect(() => {
//     setIsLoadingProfile(true);
//     if (!isConnected) {
//       setDetail(undefined);
//     } else if (detailStudent && Array.isArray(detailStudent)) {
//       const output = {
//         tokenId: Number(BigInt(detailStudent[0])),
//         name: detailStudent[1].name,
//         nim: detailStudent[1].nim,
//         major: detailStudent[1].major,
//         semester: detailStudent[1].semester,
//         enrollmentYear: detailStudent[1].enrollmentYear,
//         expiryDate: detailStudent[1].expiryDate,
//         status: detailStudent[1].isActive,
//         uri: detailStudent[2],
//       };
//       setDetail(output);
//     }
//     setIsLoadingProfile(false);
//   }, [detailStudent, isConnected, address]);

//   if (isLoadingProfile || isLoadingBadges || isLoadingCertificates) {
//     return (
//       <Box maw={800} mx="auto" p="md">
//         <Paper shadow="xs" radius="md" p="xl">
//           <Skeleton height={200} radius="md" mb="lg" />
//           <Skeleton height={100} radius="md" />
//         </Paper>
//       </Box>
//     );
//   }

//   if (badgesError && !isNoCertificatesError) {
//     return (
//       <Box maw={800} mx="auto" p="md">
//         <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
//           Failed to load NFT certificates: {badgesError?.message || "Unknown error"}
//         </Alert>
//       </Box>
//     );
//   }

//   if (certificatesError) {
//     return (
//       <Box maw={800} mx="auto" p="md">
//         <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
//           Failed to load NFT certificate details: {certificatesError}
//         </Alert>
//       </Box>
//     );
//   }

//   if (!detail) {
//     return (
//       <Box maw={800} mx="auto" p="md">
//         <Paper shadow="xs" radius="md" p="xl">
//           <Text ta="center" c="dimmed">
//             Student not found
//           </Text>
//         </Paper>
//       </Box>
//     );
//   }

//   const getRarityColor = (rarity: string) => {
//     const colors: Record<string, string> = {
//       Common: "gray",
//       Uncommon: "blue",
//       Rare: "green",
//       Epic: "purple",
//       Legendary: "orange",
//     };
//     return colors[rarity] || "gray";
//   };

//   const getCategoryColor = (category: string) => {
//     const colors: Record<string, string> = {
//       Course: "blue",
//       Achievement: "green",
//       Certification: "purple",
//       Event: "orange",
//       Project: "red",
//     };
//     return colors[category] || "blue";
//   };

//   return (
//     <Box maw={800} mx="auto" p="md">
//       <Stack gap="lg">
//         {/* Header Section */}
//         <Group gap="md" align="center">
//           <div style={{ flex: 1 }}>
//             <Title order={2} c="dark.8">
//               Student Profile
//             </Title>
//             <Text size="sm" c="dimmed">
//               View detailed information about the student and their NFT certificates
//             </Text>
//           </div>
//         </Group>

//         {/* Main Profile Card */}
//         <Paper shadow="xs" radius="md" p="xl">
//           <Stack gap="lg">
//             {/* Student Header */}
//             <Group gap="lg" align="flex-start">
//               <Avatar size={80} radius="md" color="blue" variant="light">
//                 <Text size="xl" fw={600}>
//                   {detail.name[0]}
//                 </Text>
//               </Avatar>

//               <div style={{ flex: 1 }}>
//                 <Group gap="md" align="center" mb="xs">
//                   <Title order={3}>{detail.name}</Title>
//                   <Badge
//                     variant="light"
//                     color={detail.status ? "green" : "gray"}
//                     size="lg"
//                     radius="md"
//                   >
//                     {detail.status ? "Active" : "Inactive"}
//                   </Badge>
//                 </Group>

//                 <Group gap="md" mb="sm">
//                   <Group gap="xs">
//                     <IdCard size={16} color="var(--mantine-color-blue-6)" />
//                     <Text size="sm" c="dimmed">
//                       NIM: {detail.nim}
//                     </Text>
//                   </Group>
//                   <Group gap="xs">
//                     <User size={16} color="var(--mantine-color-green-6)" />
//                     <Text size="sm" c="dimmed">
//                       ID: #{detail.tokenId}
//                     </Text>
//                   </Group>
//                 </Group>

//                 <Group gap="xs" align="center">
//                   <MapPin size={14} color="var(--mantine-color-gray-6)" />
//                   <Text size="xs" c="dimmed">
//                     {shortenAddress(address || "")}
//                   </Text>
//                   <CopyButton value={address || ""}>
//                     {({ copied, copy }) => (
//                       <Tooltip label={copied ? "Copied" : "Copy address"}>
//                         <ActionIcon
//                           color={copied ? "teal" : "gray"}
//                           variant="subtle"
//                           size="sm"
//                           onClick={copy}
//                         >
//                           {copied ? <Check size={12} /> : <Copy size={12} />}
//                         </ActionIcon>
//                       </Tooltip>
//                     )}
//                   </CopyButton>
//                 </Group>
//               </div>
//             </Group>

//             <Divider />

//             {/* Information Cards Grid */}
//             <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
//               {/* Academic Information */}
//               <Card withBorder radius="md" p="lg">
//                 <Group gap="xs" mb="md">
//                   <ThemeIcon variant="light" color="blue" size="sm">
//                     <GraduationCap size={16} />
//                   </ThemeIcon>
//                   <Text fw={600} size="sm">
//                     Academic Information
//                   </Text>
//                 </Group>

//                 <Stack gap="sm">
//                   <Group justify="space-between">
//                     <Text size="sm" c="dimmed">
//                       Major
//                     </Text>
//                     <Text size="sm" fw={500}>
//                       {detail.major}
//                     </Text>
//                   </Group>
//                   <Group justify="space-between">
//                     <Text size="sm" c="dimmed">
//                       Current Semester
//                     </Text>
//                     <Text size="sm" fw={500}>
//                       Semester {detail.semester}
//                     </Text>
//                   </Group>
//                   {detail.enrollmentYear && (
//                     <Group justify="space-between">
//                       <Text size="sm" c="dimmed">
//                         Academic Year
//                       </Text>
//                       <Text size="sm" fw={500}>
//                         {detail.enrollmentYear}
//                       </Text>
//                     </Group>
//                   )}
//                 </Stack>
//               </Card>

//               {/* Certificates Information */}
//               <Card withBorder radius="md" p="lg">
//                 <Group gap="xs" mb="md">
//                   <ThemeIcon variant="light" color="yellow" size="sm">
//                     <Award size={16} />
//                   </ThemeIcon>
//                   <Text fw={600} size="sm">
//                     Certificates
//                   </Text>
//                 </Group>

//                 <Stack gap="sm">
//                   <Group justify="space-between">
//                     <Text size="sm" c="dimmed">
//                       Total Certificates
//                     </Text>
//                     <Text size="sm" fw={500}>
//                       {certificates.length}
//                     </Text>
//                   </Group>
//                   <Group justify="space-between">
//                     <Text size="sm" c="dimmed">
//                       Status
//                     </Text>
//                     <Text size="sm" fw={500}>
//                       {certificates.filter((cert) => cert.isValid).length} Active
//                     </Text>
//                   </Group>
//                 </Stack>
//               </Card>
//             </SimpleGrid>

//             <Divider />

//             {/* NFT Certificates Collection */}
//             <div>
//               <Group gap="xs" mb="md">
//                 <ThemeIcon variant="light" color="yellow" size="sm">
//                   <Award size={16} />
//                 </ThemeIcon>
//                 <Text fw={600} size="lg">
//                   Certificates Collection
//                 </Text>
//                 {hasValidBadgesData ? (
//                   <Badge variant="light" color="blue" size="sm">
//                     {certificates.length} Certificates
//                   </Badge>
//                 ) : null}
//               </Group>

//               {hasValidBadgesData ? (
//                 <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
//                   {certificates.map((nft) => (
//                     <Card
//                       key={nft.tokenId}
//                       withBorder
//                       radius="md"
//                       p="lg"
//                       shadow="sm"
//                       style={{
//                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         color: "white",
//                         border: `2px solid var(--mantine-color-${getRarityColor(
//                           nft.rarity || "Common"
//                         )}-5)`,
//                         position: "relative",
//                         overflow: "hidden",
//                       }}
//                     >
//                       {/* NFT Header */}
//                       <Group justify="space-between" mb="md">
//                         <Badge
//                           variant="white"
//                           color={getRarityColor(nft.rarity || "Common")}
//                           size="sm"
//                           radius="md"
//                         >
//                           {nft.rarity || "Common"}
//                         </Badge>
//                         <Group gap="xs">
//                           <Hash size={12} />
//                           <Text size="xs" c="white">
//                             #{nft.tokenId}
//                           </Text>
//                         </Group>
//                       </Group>

//                       {/* NFT Title */}
//                       <Text fw={700} size="lg" mb="sm" lineClamp={2} c="white">
//                         {nft.name}
//                       </Text>

//                       {/* NFT Details */}
//                       <Stack gap="xs" mb="md">
//                         <Group gap="xs">
//                           <Badge
//                             variant="white"
//                             color={getCategoryColor(nft.category)}
//                             size="xs"
//                           >
//                             {nft.category}
//                           </Badge>
//                           <Badge
//                             variant="white"
//                             color={nft.isValid ? "green" : "red"}
//                             size="xs"
//                           >
//                             {nft.isValid ? "Valid" : "Expired"}
//                           </Badge>
//                         </Group>

//                         {nft.metadata?.description && (
//                           <Text size="sm" c="white" opacity={0.9} lineClamp={2}>
//                             {nft.metadata.description}
//                           </Text>
//                         )}

//                         <Group gap="xs" align="center">
//                           <Calendar size={12} />
//                           <Text size="xs" c="white" opacity={0.8}>
//                             {new Date(nft.earnedTimestamp * 1000).toLocaleDateString()}
//                           </Text>
//                         </Group>
//                       </Stack>

//                       {/* NFT Attributes */}
//                       {nft.metadata?.attributes && (
//                         <Stack gap="xs" mb="md">
//                           <Text size="xs" fw={600} c="white" opacity={0.9}>
//                             Attributes:
//                           </Text>
//                           <SimpleGrid cols={2} spacing="xs">
//                             {nft.metadata.attributes.slice(0, 4).map((attr, index) => (
//                               <Box key={index}>
//                                 <Text size="xs" c="white" opacity={0.7}>
//                                   {attr.trait_type}
//                                 </Text>
//                                 <Text size="xs" fw={500} c="white">
//                                   {attr.value}
//                                 </Text>
//                               </Box>
//                             ))}
//                           </SimpleGrid>
//                         </Stack>
//                       )}

//                       {/* NFT Footer */}
//                       <Group justify="space-between" align="center">
//                         <Group gap="xs">
//                           <Text size="xs" c="white" opacity={0.8}>
//                             {nft.blockchain}
//                           </Text>
//                         </Group>
//                         <Group gap="xs">
//                           <CopyButton value={nft.contractAddress || ""}>
//                             {({ copied, copy }) => (
//                               <Tooltip label={copied ? "Copied" : "Copy contract"}>
//                                 <ActionIcon
//                                   variant="subtle"
//                                   color="white"
//                                   size="sm"
//                                   onClick={copy}
//                                 >
//                                   {copied ? <Check size={12} /> : <Copy size={12} />}
//                                 </ActionIcon>
//                               </Tooltip>
//                             )}
//                           </CopyButton>
//                           {nft.uri && (
//                             <Tooltip label="View on IPFS">
//                               <ActionIcon
//                                 variant="subtle"
//                                 color="white"
//                                 size="sm"
//                                 component="a"
//                                 href={nft.uri.replace("ipfs://", "https://ipfs.io/ipfs/")}
//                                 target="_blank"
//                               >
//                                 <ExternalLink size={12} />
//                               </ActionIcon>
//                             </Tooltip>
//                           )}
//                         </Group>
//                       </Group>

//                       {/* Decorative Elements */}
//                       <Box
//                         style={{
//                           position: "absolute",
//                           top: -10,
//                           right: -10,
//                           width: 40,
//                           height: 40,
//                           background: `var(--mantine-color-${getRarityColor(
//                             nft.rarity || "Common"
//                           )}-4)`,
//                           borderRadius: "50%",
//                           opacity: 0.3,
//                         }}
//                       />
//                     </Card>
//                   ))}
//                 </SimpleGrid>
//               ) : (
//                 <Box ta="center" py="xl">
//                   <ThemeIcon size="xl" variant="light" color="gray" mx="auto" mb="md">
//                     <Award size={24} />
//                   </ThemeIcon>
//                   <Text size="sm" c="dimmed" mb="xs">
//                     No NFT certificates found
//                   </Text>
//                   <Text size="xs" c="dimmed">
//                     {isNoCertificatesError
//                       ? "This student hasn't earned any certificates yet."
//                       : "Complete courses to earn your first certificate!"}
//                   </Text>
//                 </Box>
//               )}
//             </div>
//           </Stack>
//         </Paper>
//       </Stack>
//     </Box>
//   );
// };

// export default StudentDashboard;