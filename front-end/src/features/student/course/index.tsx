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
  Notification,
  Modal,
  NumberInput,
} from "@mantine/core";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/providers/Web3Provider";
import { contracts } from "@/constants/contracts";
import { Colors } from "@/constants/colors";
import { Check, Users, Calendar, Award } from "lucide-react";
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

  const courseBadgeContract = {
    address: contracts.courseBadge.address as `0x${string}`,
    abi: contracts.courseBadge.abi,
  };

  // Read workshop count
  const { data: workshopCount } = useReadContract({
    ...courseBadgeContract,
    functionName: "getWorkshopCount",
  });

  // Read user's enrolled workshops
  const { data: userWorkshops } = useReadContract({
    ...courseBadgeContract,
    functionName: "getUserWorkshops",
    args: [address],
    account: address,
  });

  // Fetch workshop details
  useEffect(() => {
    const fetchWorkshops = async () => {
      if (!workshopCount || !isConnected) return;

      const workshopList: WorkshopSeries[] = [];
      const count = Number(workshopCount);

      for (let i = 0; i < count; i++) {
        try {
          // Fetch workshop details (you'll need to implement these functions in your contract)
          const workshop = await config.readContract({
            ...courseBadgeContract,
            functionName: "getWorkshopDetails",
            args: [i],
          });

          workshopList.push({
            id: i,
            name: workshop[0] as string,
            totalSessions: Number(workshop[1]),
            isActive: workshop[2] as boolean,
            participantCount: Number(workshop[3]),
          });
        } catch (error) {
          console.error(`Error fetching workshop ${i}:`, error);
        }
      }

      setWorkshops(workshopList);
    };

    fetchWorkshops();
  }, [workshopCount, isConnected]);

  // Handle workshop enrollment
  const handleEnrollWorkshop = async (workshopId: number) => {
    if (!isConnected) return;

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
        ...courseBadgeContract,
        functionName: "enrollInWorkshop",
        args: [workshopId],
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
    } catch (error) {
      console.error("Enrollment failed:", error);
      toast.dismiss();
      toast.error("Enrollment failed. Please try again.", {
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
        ...courseBadgeContract,
        functionName: "completeSession",
        args: [selectedWorkshop.id, sessionToComplete],
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
    } catch (error) {
      console.error("Session completion failed:", error);
      toast.dismiss();
      toast.error("Failed to complete session. Please try again.", {
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
    if (!userWorkshops) return false;
    return (userWorkshops as number[]).includes(workshopId);
  };

  return (
    <Box>
      <Title order={2} mb="xl" color={Colors.primary}>
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
                transition: "transform 0.2s ease",
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                  },
                },
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Text fw={600} size="lg" lineClamp={2}>
                    {workshop.name}
                  </Text>
                  <Badge
                    color={workshop.isActive ? "green" : "gray"}
                    variant="light"
                  >
                    {workshop.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Group>

                <Group gap="sm">
                  <Calendar size={16} />
                  <Text size="sm" c="dimmed">
                    {workshop.totalSessions} Sessions
                  </Text>
                </Group>

                <Group gap="sm">
                  <Users size={16} />
                  <Text size="sm" c="dimmed">
                    {workshop.participantCount} Participants
                  </Text>
                </Group>

                <Group mt="auto" gap="xs">
                  {isEnrolled(workshop.id) ? (
                    <>
                      <Badge color="blue" variant="light" leftSection={<Check size={12} />}>
                        Enrolled
                      </Badge>
                      <Button
                        variant="light"
                        size="xs"
                        leftSection={<Award size={16} />}
                        onClick={() => {
                          setSelectedWorkshop(workshop);
                          setModalOpened(true);
                        }}
                      >
                        Complete Session
                      </Button>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      variant="filled"
                      color={Colors.primary}
                      disabled={!workshop.isActive || isLoading}
                      loading={isLoading}
                      onClick={() => handleEnrollWorkshop(workshop.id)}
                    >
                      Enroll Now
                    </Button>
                  )}
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {workshops.length === 0 && (
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
        onClose={() => setModalOpened(false)}
        title={
          <Text fw={600} size="lg">
            Complete Session
          </Text>
        }
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Mark a session as completed for:{" "}
            <Text span fw={600}>
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
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="subtle"
              onClick={() => setModalOpened(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteSession}
              loading={isLoading}
              disabled={sessionToComplete === "" || isLoading}
            >
              Complete Session
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default StudentWorkshop;