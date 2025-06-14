import { Box, Flex, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

interface ISidebarItemProps {
  isActive?: boolean;
  icon: any;
  title: string;
  route: any;
}

const SidebarItem: React.FC<ISidebarItemProps> = ({
  isActive,
  icon,
  title,
  route,
}) => {
  const router = useRouter();

  return (
    <Box style={{ cursor: "pointer" }} onClick={() => router.push(route)}>
      <Flex align="center" gap="10px">
        {icon}
        <Text
          fw={isActive ? "600" : "normal"}
          color={isActive ? "black" : "gray"}
        >
          {title}
        </Text>
      </Flex>
    </Box>
  );
};

export default SidebarItem;
