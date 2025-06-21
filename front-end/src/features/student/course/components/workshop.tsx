"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Group,
  Text,
  Title,
  Badge,
  Stack,
  Grid,
  Modal,
  NumberInput,
  LoadingOverlay,
} from "@mantine/core";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/providers/Web3Provider";
import { contracts } from "@/constants/contracts";
import { Colors } from "@/constants/colors";
import { Check, Users, Calendar, Award, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface WorkshopSeries {
  id: number;
  name: string;
  totalSessions: number;
  isActive: boolean;
  participantCount: number;
}

const StudentWorkshop = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [workshops, setWorkshops] = useState<WorkshopSeries[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopSeries | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sessionToComplete, setSessionToComplete] = useState<number | "">(1);

  const courseBadgeContract = {
    address: contracts.courseBadge.address as `0x${string}`,
    abi: contracts.courseBadge.abi,
  };

  // Mock data untuk testing - ganti dengan real contract calls
  useEffect(() => {
    const loadMockData = () => {
      setIsLoadingData(true);
      // Simulate API call delay
      setTimeout(() => {
        const mockWorkshops: WorkshopSeries[] = [
          {
            id: 0,
            name: "Solidity Fundamentals Series",
            totalSessions: 5,
            isActive: true,
            participantCount: 23,
          },
          {
            id: 1,
            name: "Smart Contract Security",
            totalSessions: 8,
            isActive: true,
            participantCount: 15,
          },
          {
            id: 2,
            name: "DeFi Development Bootcamp",
            totalSessions: 12,
            isActive: false,
            participantCount: 7,
          },
          {
            id: 3,
            name: "NFT Marketplace Development",
            totalSessions: 6,
            isActive: true,
            participantCount: 31,
          },
        ];
        setWorkshops(mockWorkshops);
        setIsLoadingData(false);
      }, 1000);
    };

    if (isConnected) {
      loadMockData();
    }
  }, [isConnected]);

  // Handle workshop enrollment
  const handleEnrollWorkshop = async (workshopId: number) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first", {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });
      return;
    }

    setIsLoading(true);
    toast.loading("Enrolling in workshop...", {
      style: {
        background: Colors.primary,
        color: "white",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    });

    try {
      const result = await writeContractAsync({
        address: courseBadgeContract.address,
        abi: courseBadgeContract.abi,
        functionName: "enrollInWorkshop",
        args: [BigInt(workshopId)],
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Confirming enrollment...", {
        style: {
          background: Colors.primary,
          color: "white",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });

      toast.dismiss();
      toast.success("Successfully enrolled in workshop!", {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });

      // Update local state to reflect enrollment
      setWorkshops(prev => 
        prev.map(w => 
          w.id === workshopId 
            ? { ...w, participantCount: w.participantCount + 1 }
            : w
        )
      );
    } catch (error: unknown) {
      console.error("Enrollment failed:", error);
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : "Enrollment failed. Please try again.";
      toast.error(errorMessage, {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle session completion
  const handleCompleteSession = async () => {
    if (!selectedWorkshop || sessionToComplete === "" || !isConnected) return;

    setIsLoading(true);
    toast.loading("Marking session as complete...", {
      style: {
        background: Colors.primary,
        color: "white",
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    });

    try {
      const result = await writeContractAsync({
        address: courseBadgeContract.address,
        abi: courseBadgeContract.abi,
        functionName: "completeSession",
        args: [BigInt(selectedWorkshop.id), BigInt(sessionToComplete)],
        account: address as `0x${string}`,
      });

      toast.dismiss();
      toast.loading("Confirming session completion...", {
        style: {
          background: Colors.primary,
          color: "white",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });

      toast.dismiss();
      toast.success("Session completed successfully!", {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });

      setModalOpened(false);
      setSessionToComplete(1);
    } catch (error: unknown) {
      console.error("Session completion failed:", error);
      toast.dismiss();
      const errorMessage = error instanceof Error ? error.message : "Failed to complete session. Please try again.";
      toast.error(errorMessage, {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to check enrollment status
  const isEnrolled = (workshopId: number) => {
    // For demo purposes, assume user is enrolled in workshop with id 0
    return workshopId === 0;
  };

  if (!isConnected) {
    return (
      <Box>
        <Title order={2} mb="xl" style={{ color: Colors.primary }}>
          Workshop Series
        </Title>
        <Card padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <BookOpen size={48} color="#ced4da" />
            <Text size="lg" c="dimmed" ta="center">
              Please connect your wallet
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Connect your wallet to view and enroll in workshops
            </Text>
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoadingData} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      <Title order={2} mb="xl" style={{ color: Colors.primary }}>
        Workshop Series
      </Title>

      <Grid>
        {workshops.map((workshop) => (
          <Grid.Col key={workshop.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                  },
                },
              }}
            >
              <Stack gap="md" style={{ height: "100%" }}>
                <Group justify="space-between" align="flex-start">
                  <Text fw={600} size="lg" lineClamp={2} style={{ flex: 1 }}>
                    {workshop.name}
                  </Text>
                  <Badge
                    color={workshop.isActive ? "green" : "gray"}
                    variant="light"
                    size="sm"
                  >
                    {workshop.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Group>

                <Stack gap="xs">
                  <Group gap="sm">
                    <Calendar size={16} color={Colors.primary} />
                    <Text size="sm" c="dimmed">
                      {workshop.totalSessions} Sessions
                    </Text>
                  </Group>

                  <Group gap="sm">
                    <Users size={16} color={Colors.primary} />
                    <Text size="sm" c="dimmed">
                      {workshop.participantCount} Participants
                    </Text>
                  </Group>
                </Stack>

                <Group mt="auto" gap="xs">
                  {isEnrolled(workshop.id) ? (
                    <Stack gap="xs" style={{ width: "100%" }}>
                      <Badge 
                        color="blue" 
                        variant="light" 
                        leftSection={<Check size={12} />}
                        style={{ alignSelf: "flex-start" }}
                      >
                        Enrolled
                      </Badge>
                      <Button
                        variant="light"
                        size="sm"
                        leftSection={<Award size={16} />}
                        onClick={() => {
                          setSelectedWorkshop(workshop);
                          setModalOpened(true);
                        }}
                        fullWidth
                      >
                        Complete Session
                      </Button>
                    </Stack>
                  ) : (
                    <Button
                      fullWidth
                      variant="filled"
                      style={{ backgroundColor: Colors.primary }}
                      disabled={!workshop.isActive || isLoading}
                      loading={isLoading}
                      onClick={() => handleEnrollWorkshop(workshop.id)}
                    >
                      {workshop.isActive ? "Enroll Now" : "Workshop Inactive"}
                    </Button>
                  )}
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {workshops.length === 0 && !isLoadingData && (
        <Card padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Calendar size={48} color="#ced4da" />
            <Text size="lg" c="dimmed" ta="center">
              No workshop series available yet
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Check back later for upcoming workshops
            </Text>
          </Stack>
        </Card>
      )}

      {/* Session Completion Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setSessionToComplete(1);
        }}
        title={
          <Group gap="sm">
            <Award size={20} color={Colors.primary} />
            <Text fw={600} size="lg">
              Complete Session
            </Text>
          </Group>
        }
        centered
        size="md"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Mark a session as completed for:{" "}
            <Text span fw={600} style={{ color: Colors.primary }}>
              {selectedWorkshop?.name}
            </Text>
          </Text>

          <NumberInput
            label="Session Number"
            placeholder="Enter session number"
            value={sessionToComplete}
            onChange={(value) => {
              if (typeof value === "number") setSessionToComplete(value);
              else if (value === null || value === "") setSessionToComplete("");
            }}
            min={1}
            max={selectedWorkshop?.totalSessions || 1}
            required
            styles={{
              input: {
                height: "45px",
                borderColor: "#ced4da",
                borderRadius: "8px",
              },
            }}
          />

          <Text size="xs" c="dimmed">
            Total sessions: {selectedWorkshop?.totalSessions}
          </Text>

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => {
                setModalOpened(false);
                setSessionToComplete(1);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteSession}
              loading={isLoading}
              disabled={sessionToComplete === "" || isLoading}
              style={{ backgroundColor: Colors.primary }}
            >
              {isLoading ? "Processing..." : "Complete Session"}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default StudentWorkshop;