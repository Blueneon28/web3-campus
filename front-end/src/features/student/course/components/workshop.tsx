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
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt, readContract } from "@wagmi/core";
import { config } from "@/providers/Web3Provider";
import { contracts } from "@/constants/contracts";
import { Colors } from "@/constants/colors";
import { Check, Users, Calendar, Award, BookOpen, RefreshCw } from "lucide-react";
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
  const [sessionToComplete, setSessionToComplete] = useState<number | "">(1);
  const [enrolledWorkshops, setEnrolledWorkshops] = useState<number[]>([]);

  const { courseBadge } = contracts;
  const courseBadgeContract = {
    address: courseBadge.address as `0x${string}`,
    abi: courseBadge.abi,
  };

  // Read workshop count from contract
  const { 
    data: workshopCount, 
    isLoading: isLoadingCount,
    refetch: refetchCount 
  } = useReadContract({
    address: courseBadgeContract.address,
    abi: courseBadgeContract.abi,
    functionName: "getWorkshopCount",
  });

  // Read user's enrolled workshops
  const { 
    data: userWorkshops,
    isLoading: isLoadingUserWorkshops,
    refetch: refetchUserWorkshops 
  } = useReadContract({
    address: courseBadgeContract.address,
    abi: courseBadgeContract.abi,
    functionName: "getUserWorkshops",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Watch for new workshop creation events
  useWatchContractEvent({
    address: courseBadgeContract.address,
    abi: courseBadgeContract.abi,
    eventName: "WorkshopSeriesCreated",
    onLogs: (logs) => {
      console.log("New workshop created:", logs);
      // Refetch workshop data when new workshop is created
      refetchCount();
      fetchWorkshopDetails();
      toast.success("New workshop series available!", {
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      });
    },
  });

  // Watch for enrollment events
  useWatchContractEvent({
    address: courseBadgeContract.address,
    abi: courseBadgeContract.abi,
    eventName: "StudentEnrolled",
    onLogs: (logs) => {
      console.log("Student enrolled:", logs);
      // Refetch user workshops and workshop details
      refetchUserWorkshops();
      fetchWorkshopDetails();
    },
  });

  // Update enrolled workshops when userWorkshops changes
  useEffect(() => {
    if (userWorkshops && Array.isArray(userWorkshops)) {
      setEnrolledWorkshops(userWorkshops.map(id => Number(id)));
    }
  }, [userWorkshops]);

  // Fetch individual workshop details
  const fetchWorkshopDetails = async () => {
    if (!workshopCount || !isConnected) return;

    const workshopList: WorkshopSeries[] = [];
    const count = Number(workshopCount);

    for (let i = 0; i < count; i++) {
      try {
        // Read workshop details from contract using readContract from @wagmi/core
        const workshopData = await readContract(config, {
          address: courseBadgeContract.address,
          abi: courseBadgeContract.abi,
          functionName: "getWorkshopDetails",
          args: [i],
        }) as readonly [string, bigint, boolean, bigint];

        workshopList.push({
          id: i,
          name: workshopData[0],
          totalSessions: Number(workshopData[1]),
          isActive: workshopData[2],
          participantCount: Number(workshopData[3]),
        });
      } catch (error) {
        console.error(`Error fetching workshop ${i}:`, error);
        // If getWorkshopDetails doesn't exist, try alternative approach
        try {
          const workshopSeries = await readContract(config, {
            address: courseBadgeContract.address,
            abi: courseBadgeContract.abi,
            functionName: "workshopSeries",
            args: [i],
          }) as readonly [string, bigint, boolean];

          workshopList.push({
            id: i,
            name: workshopSeries[0],
            totalSessions: Number(workshopSeries[1]),
            isActive: workshopSeries[2],
            participantCount: 0, // Default if not available
          });
        } catch (fallbackError) {
          console.error(`Fallback error for workshop ${i}:`, fallbackError);
        }
      }
    }

    setWorkshops(workshopList);
  };

  // Fetch workshop details when count changes
  useEffect(() => {
    fetchWorkshopDetails();
  }, [workshopCount, isConnected]);

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

      // Refetch data after successful enrollment
      refetchUserWorkshops();
      fetchWorkshopDetails();
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

  // Check if user is enrolled in a workshop
  const isEnrolled = (workshopId: number) => {
    return enrolledWorkshops.includes(workshopId);
  };

  // Manual refresh function
  const handleRefresh = () => {
    refetchCount();
    refetchUserWorkshops();
    fetchWorkshopDetails();
    toast.success("Data refreshed!", {
      style: {
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      },
    });
  };

  const isLoadingData = isLoadingCount || isLoadingUserWorkshops;

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
      
      <Group justify="space-between" mb="xl">
        <Title order={2} style={{ color: Colors.primary }}>
          Workshop Series
        </Title>
        <Button
          variant="light"
          leftSection={<RefreshCw size={16} />}
          onClick={handleRefresh}
          size="sm"
        >
          Refresh
        </Button>
      </Group>

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
              Ask your admin to create workshop series first
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