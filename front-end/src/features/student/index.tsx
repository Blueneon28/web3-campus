/** @format */

"use client";

import React from "react";
import { useState, useEffect } from "react";
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
} from "@mantine/core";
import { User, GraduationCap, IdCard, MapPin, Copy, Check } from "lucide-react";

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

const StudentDashboard = () => {
  const { address, isConnected } = useAccount();
  const { studentID } = contracts;

  const [detail, setDetail] = useState<StudentDetail>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { data: detailStudent } = useReadContract({
    address: studentID.address,
    abi: studentID.abi,
    functionName: "getStudentByAddress",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (!isConnected) {
      setDetail(undefined);
    }
  }, [isConnected]);

  useEffect(() => {
    setLoading(true);
    if (detailStudent && Array.isArray(detailStudent)) {
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
    setLoading(false);
  }, [detailStudent, address]);

  if (isLoading) {
    return (
      <Box maw={800} mx="auto" p="md">
        <Paper shadow="xs" radius="md" p="xl">
          <Text ta="center" c="dimmed">
            Loading student profile...
          </Text>
        </Paper>
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
              Student Profile
            </Title>
            <Text size="sm" c="dimmed">
              View detailed information about the student
            </Text>
          </div>
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
                    {detail.status ? "Aktif" : "Tidak AKtif"}
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
            </SimpleGrid>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default StudentDashboard;
