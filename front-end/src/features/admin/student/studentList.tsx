/** @format */

"use client";

import { useReadContract } from "wagmi";

import { contracts } from "@/constants/contracts";
import { Button, Table, Group, Text, Paper, Stack, Badge } from "@mantine/core";
import { Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StudentData {
  name: string;
  nim: string;
  major: string;
  isActive: boolean;
  semester: number;
}

interface StudentListItem {
  tokenID: number;
  address: string;
  name: string;
  nim: string;
  status: boolean;
  major: string;
  uri: string;
  semester: number;
}

export default function StudentList() {
  const router = useRouter();
  const [list, setList] = useState<StudentListItem[]>([]);
  const { studentID } = contracts;

  //   const { data, isLoading, error, refetch } = useReadContract({
  const { data: listStudent, refetch: refetchListStudent } = useReadContract({
    address: studentID.address,
    abi: studentID.abi,
    functionName: "getAllStudents",
  });

  useEffect(() => {
    if (listStudent && Array.isArray(listStudent) && listStudent.length >= 4) {
      const [tokenIds, addresses, studentData, uris] = listStudent as [
        bigint[],
        string[],
        StudentData[],
        string[]
      ];

      const totalData = Array.isArray(listStudent) ? listStudent[0].length : 0;
      const output = [];

      for (let i = 0; i < totalData; i++) {
        output.push({
          tokenID: Number(tokenIds[i]),
          address: addresses[i],
          name: studentData[i].name,
          nim: studentData[i].nim,
          status: studentData[i].isActive,
          major: studentData[i].major,
          semester: studentData[i].semester,
          uri: uris[i],
        });
      }

      setList(output);
    }

    refetchListStudent();
  }, [listStudent]);

  return (
    <Paper shadow="xs" p="xl" radius="md">
      <Stack gap="lg">
        {/* Header Section */}
        <Group justify="space-between" align="center">
          <div>
            <Text size="xl" fw={600} c="dark.8">
              Student Management
            </Text>
            <Text size="sm" c="dimmed">
              Manage and view all student records
            </Text>
          </div>
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => router.push("/dashboard/admin/student/add")}
            radius="md"
            size="sm"
          >
            Add Student
          </Button>
        </Group>

        {/* Table Section */}
        <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
          <Table.ScrollContainer minWidth={800}>
            <Table
              verticalSpacing="sm"
              horizontalSpacing="md"
              striped
              highlightOnHover
            >
              <Table.Thead bg="gray.1">
                <Table.Tr>
                  <Table.Th>
                    <Text fw={600} size="sm">
                      ID
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm">
                      Student Info
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm">
                      Status
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm">
                      Academic Info
                    </Text>
                  </Table.Th>
                  <Table.Th>
                    <Text fw={600} size="sm">
                      Actions
                    </Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {list.map((student) => (
                  <Table.Tr key={student.address}>
                    <Table.Td>
                      <Text size="sm" fw={500} c="dark.6">
                        {student.tokenID} .)
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm" fw={500}>
                          {student.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          NIM: {student.nim}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      {student.status ? (
                        <Badge color="blue">Aktif</Badge>
                      ) : (
                        <Badge color="blue">Tidak Aktif</Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm">{student.major}</Text>
                        <Text size="xs" c="dimmed">
                          Semester {student.semester}
                        </Text>
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Button
                          variant="light"
                          size="xs"
                          leftSection={<Pencil size={14} />}
                          onClick={() =>
                            router.push(
                              `/dashboard/admin/student/edit/${student.address}`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      </Stack>
    </Paper>
  );
}
