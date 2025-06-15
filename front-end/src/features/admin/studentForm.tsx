/** @format */

"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";

import { ERC721_ADR, ERC721_ABI } from "@/constants";

import { config } from "@/providers/Web3Provider";

import {
  Box,
  Button,
  TextInput,
  Paper,
  Stack,
  Group,
  Title,
  Text,
  ActionIcon,
  Divider,
  Select,
} from "@mantine/core";
import {
  ArrowLeft,
  User,
  GraduationCap,
  IdCard,
  Link,
  MapPin,
} from "lucide-react";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const majorOptions = [
  { value: "Computer Science", label: "Computer Science" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Data Science", label: "Data Science" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
];

interface StudentDetail {
  tokenId: number;
  name: string;
  nim: string;
  major: string;
  uri: string;
}

export default function StudentForm() {
  const { id }: { id: string | undefined } = useParams();
  const router = useRouter();
  const { address: walletAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [detail, setDetail] = useState<StudentDetail>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { data: detailStudent } = useReadContract({
    address: ERC721_ADR,
    abi: ERC721_ABI,
    functionName: "getStudentByAddress",
    args: id ? [id] : undefined,
    query: {
      enabled: !!id,
    },
  });

  const form = useForm({
    initialValues: {
      to: "",
      nim: "",
      name: "",
      major: "",
      uri: "",
    },

    validate: {
      to: (value: string) => (value.length < 3 ? "Address is too short" : null),
      nim: (value: string) => (/^\d{8,}$/.test(value) ? null : "Invalid NIM"),
      name: (value: string) => (value.length < 2 ? "Name is too short" : null),
      major: (value: string) => (value.length < 2 ? "Major is required" : null),
      uri: (value: string) =>
        !value || value.startsWith("http") ? null : "URI must be a valid URL",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const payload = id
      ? [
          detail?.tokenId ? BigInt(detail?.tokenId) : BigInt(0),
          values.name,
          values.major,
          values.uri,
        ]
      : Object.values(values).map((each) => each);

    try {
      setLoading(true);
      const result = await writeContractAsync({
        address: ERC721_ADR,
        abi: ERC721_ABI,
        functionName: id ? "updateStudentInfo" : "issueStudentID",
        args: payload,
        account: walletAddress as `0x${string}`,
      });

      await waitForTransactionReceipt(config, {
        hash: result as `0x${string}`,
      });
      setLoading(false);
      router.back();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useWatchContractEvent({
    address: ERC721_ADR,
    abi: ERC721_ABI,
    eventName: "StudentIDIssued",
    onLogs(log) {
      console.log("log", log);
      router.back();
    },
  });

  useWatchContractEvent({
    address: ERC721_ADR,
    abi: ERC721_ABI,
    eventName: "StudentIDUpdated",
    onLogs(log) {
      console.log("log", log);
      router.back();
    },
  });

  useEffect(() => {
    if (detailStudent && Array.isArray(detailStudent)) {
      const output = {
        tokenId: Number(BigInt(detailStudent[0])),
        name: detailStudent[1].name,
        nim: detailStudent[1].nim,
        major: detailStudent[1].major,
        uri: detailStudent[2],
      };

      setDetail(output);
      form.setValues({ to: id, ...output });
    }
  }, [detailStudent]);

  return (
    <Box>
      <Paper shadow="xs" radius="md" p="xl">
        <Stack gap="lg">
          {/* Header Section */}
          <Group gap="md" align="center">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </ActionIcon>
            <div style={{ flex: 1 }}>
              <Title order={2} c="dark.8">
                {id ? "Edit Student" : "Add New Student"}
              </Title>
              <Text size="sm" c="dimmed">
                {id
                  ? "Update student information"
                  : "Enter student details to create a new record"}
              </Text>
            </div>
          </Group>

          <Divider />

          {/* Form Section */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {/* Basic Information Section */}
              <div>
                <Group gap="xs" mb="sm">
                  <User size={18} color="var(--mantine-color-blue-6)" />
                  <Text fw={600} size="sm">
                    Basic Information
                  </Text>
                </Group>

                <Stack gap="md">
                  {!id && (
                    <TextInput
                      label="Wallet Address"
                      description="Student's blockchain wallet address"
                      placeholder="0x1234567890abcdef..."
                      leftSection={<MapPin size={16} />}
                      {...form.getInputProps("to")}
                      radius="md"
                      required
                    />
                  )}

                  <Group grow>
                    <TextInput
                      label="Student ID (NIM)"
                      description="Unique student identification number"
                      placeholder="e.g., 12345678"
                      leftSection={<IdCard size={16} />}
                      disabled={id ? true : false}
                      {...form.getInputProps("nim")}
                      radius="md"
                      required
                    />
                    <TextInput
                      label="Full Name"
                      description="Student's complete name"
                      placeholder="Enter full name"
                      leftSection={<User size={16} />}
                      {...form.getInputProps("name")}
                      radius="md"
                      required
                    />
                  </Group>
                </Stack>
              </div>

              <Divider variant="dashed" />

              {/* Academic Information Section */}
              <div>
                <Group gap="xs" mb="sm">
                  <GraduationCap
                    size={18}
                    color="var(--mantine-color-green-6)"
                  />
                  <Text fw={600} size="sm">
                    Academic Information
                  </Text>
                </Group>

                <Stack gap="md">
                  <Group grow>
                    <Select
                      label="Major"
                      description="Student's field of study"
                      placeholder="Select major"
                      leftSection={<GraduationCap size={16} />}
                      data={majorOptions}
                      {...form.getInputProps("major")}
                      radius="md"
                      searchable
                      required
                      clearable
                    />
                  </Group>
                </Stack>
              </div>

              <Divider variant="dashed" />

              {/* Additional Information Section */}
              <div>
                <Group gap="xs" mb="sm">
                  <Link size={18} color="var(--mantine-color-orange-6)" />
                  <Text fw={600} size="sm">
                    Additional Information
                  </Text>
                </Group>

                <Stack gap="md">
                  <TextInput
                    label="Profile URI"
                    description="Link to student's profile or additional information"
                    placeholder="https://example.com/profile"
                    leftSection={<Link size={16} />}
                    {...form.getInputProps("uri")}
                    radius="md"
                  />
                </Stack>
              </div>

              {/* Action Buttons */}
              <Group justify="flex-end" mt="xl">
                <Button
                  variant="subtle"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading} radius="md" size="md">
                  {id ? "Update Student" : "Add Student"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );

  // return (
  //   <Box maw={400} mx="auto">
  //     <Button onClick={() => router.back()}>Back</Button>
  //     <h1>{id ? "Edit Student" : "Add Student"}</h1>
  //     <form onSubmit={form.onSubmit(handleSubmit)}>
  //       {!id && (
  //         <TextInput
  //           label="Address"
  //           placeholder="0x123..."
  //           {...form.getInputProps("to")}
  //         />
  //       )}
  //       <TextInput
  //         label="NIM"
  //         placeholder="Student ID"
  //         mt="sm"
  //         disabled={id ? true : false}
  //         {...form.getInputProps("nim")}
  //       />
  //       <TextInput
  //         label="Name"
  //         placeholder="Full name"
  //         mt="sm"
  //         {...form.getInputProps("name")}
  //       />
  //       <TextInput
  //         label="Major"
  //         placeholder="Computer Science"
  //         mt="sm"
  //         {...form.getInputProps("major")}
  //       />
  //       <TextInput
  //         label="URI"
  //         placeholder="https://..."
  //         mt="sm"
  //         {...form.getInputProps("uri")}
  //       />

  //       <Button type="submit" mt="md" fullWidth>
  //         Submit
  //       </Button>
  //     </form>
  //   </Box>
  // );
}
