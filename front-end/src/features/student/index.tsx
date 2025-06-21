/** @format */

"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { shortenAddress } from "@/utils/helpers";
import { contracts } from "@/constants/contracts";
import {
  Box,
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Badge,
  ActionIcon,
  Avatar,
  Card,
  SimpleGrid,
  Divider,
  CopyButton,
  Tooltip,
  ThemeIcon,
  Image,
  Skeleton,
  Alert,
  Button,
  Modal,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { 
  User, 
  GraduationCap, 
  IdCard, 
  MapPin, 
  Copy, 
  Check, 
  Award, 
  AlertCircle,
  Plus,
  Trash2,
  Edit
} from "lucide-react";

interface StudentDetail {
  tokenId: number;
  name: string;
  nim: string;
  major: string;
  semester: number;
  enrollmentYear: number;
  expiryDate: number;
  status: boolean;
  uri: string;
}

interface CertificateDetail {
  tokenId: string;
  name: string;
  category: string;
  uri: string;
  amount: number;
  isValid: boolean;
  earnedTimestamp: number;
  metadata?: {
    description?: string;
    image?: string;
  };
}

interface CertificateType {
  id: string;
  name: string;
  maxSupply: number;
  currentSupply: number;
  uri: string;
  isActive: boolean;
}

const courseBadgeContract = {
  address: contracts.courseBadge.address,
  abi: contracts.courseBadge.abi,
};

// Custom hook untuk mengambil certificate types yang tersedia
const useCertificateTypes = () => {
  const [certificateTypes, setCertificateTypes] = useState<CertificateType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Read contract untuk mendapatkan jumlah certificate types
  const { data: certificateTypeCount } = useReadContract({
    ...courseBadgeContract,
    functionName: "getCertificateTypeCount",
    query: { 
      enabled: true,
      staleTime: 30000,
    },
  });

  useEffect(() => {
    const fetchCertificateTypes = async () => {
      if (!certificateTypeCount || Number(certificateTypeCount) === 0) {
        setCertificateTypes([]);
        return;
      }

      setIsLoading(true);
      try {
        const types: CertificateType[] = [];
        const count = Number(certificateTypeCount);
        
        // Fetch details for each certificate type
        for (let i = 0; i < count; i++) {
          try {
            // Assuming there's a function to get certificate type details by index
            // You'll need to implement this in your smart contract
            const typeData = {
              id: i.toString(),
              name: `Certificate Type ${i + 1}`,
              maxSupply: 100,
              currentSupply: 0,
              uri: `https://example.com/metadata/${i}.json`,
              isActive: true,
            };
            types.push(typeData);
          } catch (error) {
            console.error(`Error fetching certificate type ${i}:`, error);
          }
        }
        
        setCertificateTypes(types);
      } catch (error) {
        console.error("Error fetching certificate types:", error);
        setCertificateTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificateTypes();
  }, [certificateTypeCount]);

  return { certificateTypes, isLoading };
};

// Custom hook untuk mengambil detail sertifikat
const useCertificateDetails = (address: `0x${string}` | undefined, studentBadges: bigint[] | undefined) => {
  const [certificates, setCertificates] = useState<CertificateDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificateDetails = async () => {
      if (!address || !studentBadges || studentBadges.length === 0) {
        setCertificates([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const certDetails = await Promise.all(
          studentBadges.map(async (tokenId) => {
            try {
              // Here you would fetch actual certificate data from your contract
              // For now, using placeholder data
              return {
                tokenId: tokenId.toString(),
                name: "Certificate " + tokenId.toString(),
                category: "Course",
                uri: "",
                amount: 1,
                isValid: true,
                earnedTimestamp: Date.now() / 1000,
                metadata: {
                  description: "Certificate earned through course completion",
                  image: undefined,
                },
              };
            } catch (error) {
              console.error(`Error fetching certificate ${tokenId}:`, error);
              return {
                tokenId: tokenId.toString(),
                name: "Error loading",
                category: "Error",
                uri: "",
                amount: 0,
                isValid: false,
                earnedTimestamp: 0,
                metadata: {},
              };
            }
          })
        );
        setCertificates(certDetails);
      } catch (error) {
        console.error("Error fetching certificate details:", error);
        setError("Failed to load certificate details");
        setCertificates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificateDetails();
  }, [address, studentBadges]);

  return { certificates, isLoading, error };
};

// Admin Certificate Award Modal Component
const AwardCertificateModal = ({ 
  opened, 
  onClose, 
  studentAddress, 
  certificateTypes,
  onAwardSuccess 
}: {
  opened: boolean;
  onClose: () => void;
  studentAddress: string;
  certificateTypes: CertificateType[];
  onAwardSuccess: () => void;
}) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isAwarding, setIsAwarding] = useState(false);

  const handleAward = async () => {
    if (!selectedType || !studentAddress) return;

    setIsAwarding(true);
    try {
      // Here you would call your smart contract function to award the certificate
      // Example: writeContract for awardCertificate function
      console.log("Awarding certificate type", selectedType, "to", studentAddress);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onAwardSuccess();
      onClose();
    } catch (error) {
      console.error("Error awarding certificate:", error);
    } finally {
      setIsAwarding(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Award Certificate" centered>
      <LoadingOverlay visible={isAwarding} />
      <Stack gap="md">
        <Select
          label="Certificate Type"
          placeholder="Select certificate to award"
          data={certificateTypes.map(type => ({
            value: type.id,
            label: `${type.name} (${type.currentSupply}/${type.maxSupply})`,
          }))}
          value={selectedType}
          onChange={(value) => setSelectedType(value || "")}
        />
        
        <Text size="sm" c="dimmed">
          Student Address: {shortenAddress(studentAddress)}
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose} disabled={isAwarding}>
            Cancel
          </Button>
          <Button 
            onClick={handleAward} 
            disabled={!selectedType || isAwarding}
            loading={isAwarding}
          >
            Award Certificate
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const StudentDashboard: React.FC<{ isAdminView?: boolean }> = ({ isAdminView = false }) => {
  const { address, isConnected } = useAccount();
  const { studentID } = contracts;
  const [detail, setDetail] = useState<StudentDetail>();
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [awardModalOpened, setAwardModalOpened] = useState(false);

  // Get certificate types for admin
  const { certificateTypes, isLoading: isLoadingTypes } = useCertificateTypes();

  // Read contract untuk mendapatkan detail student
  const { data: detailStudent } = useReadContract({
    address: studentID.address,
    abi: studentID.abi,
    functionName: "getStudentByAddress",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read contract untuk mendapatkan daftar certificate
  const { data: studentBadges, isLoading: isLoadingBadges, error: badgesError, refetch: refetchBadges } = useReadContract({
    ...courseBadgeContract,
    functionName: "getStudentBadges",
    args: address ? [address as `0x${string}`] : undefined,
    query: { 
      enabled: !!address,
      retry: false,
      staleTime: 30000,
    },
  });

  // Menggunakan custom hook untuk detail sertifikat
  const { certificates, isLoading: isLoadingCertificates, error: certificatesError } = useCertificateDetails(
    address,
    studentBadges as bigint[] | undefined
  );

  const isNoCertificatesError = badgesError?.message?.includes('returned no data ("0x")');
  const hasValidBadgesData = studentBadges && Array.isArray(studentBadges) && studentBadges.length > 0;

  // Set detail student
  useEffect(() => {
    setIsLoadingProfile(true);
    if (!isConnected) {
      setDetail(undefined);
    } else if (detailStudent && Array.isArray(detailStudent)) {
      const output = {
        tokenId: Number(BigInt(detailStudent[0])),
        name: detailStudent[1].name,
        nim: detailStudent[1].nim,
        major: detailStudent[1].major,
        semester: detailStudent[1].semester,
        enrollmentYear: detailStudent[1].enrollmentYear,
        expiryDate: detailStudent[1].expiryDate,
        status: detailStudent[1].isActive,
        uri: detailStudent[2],
      };
      setDetail(output);
    }
    setIsLoadingProfile(false);
  }, [detailStudent, isConnected, address]);

  const handleAwardSuccess = () => {
    // Refresh certificates data
    refetchBadges();
  };

  if (isLoadingProfile || isLoadingBadges || isLoadingCertificates) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Paper shadow="xs" radius="md" p="xl">
          <Skeleton height={200} radius="md" mb="lg" />
          <Skeleton height={100} radius="md" />
        </Paper>
      </Box>
    );
  }

  if (badgesError && !isNoCertificatesError) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          Failed to load certificates: {badgesError?.message || "Unknown error"}
        </Alert>
      </Box>
    );
  }

  if (certificatesError) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
          Failed to load certificate details: {certificatesError}
        </Alert>
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Paper shadow="xs" radius="md" p="xl">
          <Text ta="center" c="dimmed">
            Student not found
          </Text>
        </Paper>
      </Box>
    );
  }

  return (
    <Box maw={800} mx="auto" p="md">
      <Stack gap="lg">
        {/* Header Section */}
        <Group gap="md" align="center">
          <div style={{ flex: 1 }}>
            <Title order={2} c="dark.8">
              {isAdminView ? "Student Management" : "Student Profile"}
            </Title>
            <Text size="sm" c="dimmed">
              {isAdminView ? "Manage student certificates and information" : "View detailed information about the student"}
            </Text>
          </div>
          
          {/* Admin Controls */}
          {isAdminView && (
            <Group>
              <Button
                leftSection={<Plus size={16} />}
                onClick={() => setAwardModalOpened(true)}
                disabled={isLoadingTypes}
              >
                Award Certificate
              </Button>
            </Group>
          )}
        </Group>

        {/* Main Profile Card */}
        <Paper shadow="xs" radius="md" p="xl">
          <Stack gap="lg">
            {/* Student Header */}
            <Group gap="lg" align="flex-start">
              <Avatar size={80} radius="md" color="blue" variant="light">
                <Text size="xl" fw={600}>
                  {detail.name[0]}
                </Text>
              </Avatar>

              <div style={{ flex: 1 }}>
                <Group gap="md" align="center" mb="xs">
                  <Title order={3}>{detail.name}</Title>
                  <Badge
                    variant="light"
                    color={detail.status ? "green" : "gray"}
                    size="lg"
                    radius="md"
                  >
                    {detail.status ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </Group>

                <Group gap="md" mb="sm">
                  <Group gap="xs">
                    <IdCard size={16} color="var(--mantine-color-blue-6)" />
                    <Text size="sm" c="dimmed">
                      NIM: {detail.nim}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <User size={16} color="var(--mantine-color-green-6)" />
                    <Text size="sm" c="dimmed">
                      ID: #{detail.tokenId}
                    </Text>
                  </Group>
                </Group>

                <Group gap="xs" align="center">
                  <MapPin size={14} color="var(--mantine-color-gray-6)" />
                  <Text size="xs" c="dimmed">
                    {shortenAddress(address || "")}
                  </Text>
                  <CopyButton value={address || ""}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied" : "Copy address"}>
                        <ActionIcon
                          color={copied ? "teal" : "gray"}
                          variant="subtle"
                          size="sm"
                          onClick={copy}
                        >
                          {copied ? <Check size={12} /> : <Copy size={12} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              </div>
            </Group>

            <Divider />

            {/* Information Cards Grid */}
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
              {/* Academic Information */}
              <Card withBorder radius="md" p="lg">
                <Group gap="xs" mb="md">
                  <ThemeIcon variant="light" color="blue" size="sm">
                    <GraduationCap size={16} />
                  </ThemeIcon>
                  <Text fw={600} size="sm">
                    Academic Information
                  </Text>
                </Group>

                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Major
                    </Text>
                    <Text size="sm" fw={500}>
                      {detail.major}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      Current Semester
                    </Text>
                    <Text size="sm" fw={500}>
                      Semester {detail.semester}
                    </Text>
                  </Group>
                  {detail.enrollmentYear && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Academic Year
                      </Text>
                      <Text size="sm" fw={500}>
                        {detail.enrollmentYear}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Card>

              {/* Certificates Information */}
              <Card withBorder radius="md" p="lg">
                <Group gap="xs" mb="md" justify="space-between">
                  <Group gap="xs">
                    <ThemeIcon variant="light" color="yellow" size="sm">
                      <Award size={16} />
                    </ThemeIcon>
                    <Text fw={600} size="sm">
                      Certificates ({certificates.length})
                    </Text>
                  </Group>
                  
                  {isAdminView && hasValidBadgesData ? (
                    <Group gap="xs">
                      <ActionIcon
                        variant="light"
                        color="green"
                        size="sm"
                        onClick={() => setAwardModalOpened(true)}
                      >
                        <Plus size={12} />
                      </ActionIcon>
                    </Group>
                  ) : null}
                </Group>

                <Stack gap="sm">
                  {hasValidBadgesData ? (
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                      {certificates.map((cert) => (
                        <Card
                          key={cert.tokenId}
                          withBorder
                          radius="md"
                          p="md"
                          shadow="sm"
                          style={{ overflow: "hidden" }}
                        >
                          {/* Certificate Image */}
                          {cert.metadata?.image ? (
                            <Image
                              src={cert.metadata.image}
                              alt={cert.name}
                              height={100}
                              fit="cover"
                              radius="sm"
                              mb="sm"
                            />
                          ) : (
                            <Box
                              style={{
                                height: 100,
                                background: "var(--mantine-color-gray-1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "var(--mantine-radius-sm)",
                                marginBottom: "var(--mantine-spacing-sm)",
                              }}
                            >
                              <Text c="dimmed" size="xs">
                                No Image
                              </Text>
                            </Box>
                          )}

                          {/* Certificate Details */}
                          <Stack gap="xs">
                            <Group justify="space-between" align="flex-start">
                              <Text fw={600} size="sm" lineClamp={2} style={{ flex: 1 }}>
                                {cert.name}
                              </Text>
                              {isAdminView && (
                                <Group gap={4}>
                                  <ActionIcon
                                    variant="light"
                                    color="blue"
                                    size="xs"
                                  >
                                    <Edit size={10} />
                                  </ActionIcon>
                                  <ActionIcon
                                    variant="light"
                                    color="red"
                                    size="xs"
                                  >
                                    <Trash2 size={10} />
                                  </ActionIcon>
                                </Group>
                              )}
                            </Group>
                            
                            <Badge
                              variant="light"
                              color={cert.isValid ? "green" : "red"}
                              size="xs"
                            >
                              {cert.isValid ? "Valid" : "Expired"}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              Category: {cert.category}
                            </Text>
                            {cert.amount > 1 && (
                              <Text size="xs" c="dimmed">
                                Amount: {cert.amount}
                              </Text>
                            )}
                            <Text size="xs" c="dimmed">
                              Earned: {new Date(cert.earnedTimestamp * 1000).toLocaleDateString()}
                            </Text>
                            {cert.metadata?.description && (
                              <Text size="xs" c="dimmed" lineClamp={2}>
                                {cert.metadata.description}
                              </Text>
                            )}
                            <Text size="xs" c="dimmed">
                              ID: {cert.tokenId}
                            </Text>
                          </Stack>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box ta="center" py="xl">
                      <ThemeIcon size="xl" variant="light" color="gray" mx="auto" mb="md">
                        <Award size={24} />
                      </ThemeIcon>
                      <Text size="sm" c="dimmed" mb="xs">
                        No certificates found
                      </Text>
                      <Text size="xs" c="dimmed">
                        {isNoCertificatesError 
                          ? "This student hasn't earned any certificates yet." 
                          : "Complete courses to earn your first certificate!"}
                      </Text>
                      {isAdminView && (
                        <Button
                          variant="light"
                          size="xs"
                          mt="md"
                          leftSection={<Plus size={14} />}
                          onClick={() => setAwardModalOpened(true)}
                        >
                          Award First Certificate
                        </Button>
                      )}
                    </Box>
                  )}
                </Stack>
              </Card>
            </SimpleGrid>
          </Stack>
        </Paper>
      </Stack>

      {/* Award Certificate Modal */}
      <AwardCertificateModal
        opened={awardModalOpened}
        onClose={() => setAwardModalOpened(false)}
        studentAddress={address || ""}
        certificateTypes={certificateTypes}
        onAwardSuccess={handleAwardSuccess}
      />
    </Box>
  );
};

export default StudentDashboard;