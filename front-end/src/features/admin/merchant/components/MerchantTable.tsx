"use client";
import React from "react";
import { Table, Text, Flex, Tooltip } from "@mantine/core";
import { Eye, SquarePen, Trash } from "lucide-react";
import { Colors } from "@/constants/colors";

interface IMerchantTableProps {
  merchants: any;
}

const MerchantTable: React.FC<IMerchantTableProps> = ({ merchants }) => {
  const rows = merchants?.map((item: any) => {
    return (
      <Table.Tr key={item.id}>
        <Table.Td>
          <Text size="14px" fw="700">
            {item.address}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="14px" fw="500">
            {item.name}
          </Text>
        </Table.Td>
        <Table.Td>
          <Flex gap="20px">
            <Tooltip label="Details">
              <Eye color={Colors.primary} style={{ cursor: "pointer" }} />
            </Tooltip>
            <Tooltip label="Delete">
              <Trash color="#DC2626" style={{ cursor: "pointer" }} />
            </Tooltip>
          </Flex>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={800} type="native">
      <Table
        miw={800}
        verticalSpacing="25px"
        striped
        withTableBorder={false}
        withRowBorders={false}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text fw="700" size="12px">
                ADDRESS
              </Text>
            </Table.Th>
            <Table.Th>
              <Text fw="700" size="12px">
                MERCHANT NAME
              </Text>
            </Table.Th>
            <Table.Th>
              <Text fw="700" size="12px">
                ACTION
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default MerchantTable;
