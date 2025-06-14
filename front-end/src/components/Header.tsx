import { Box, Flex, Text } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

interface IHeaderProps {
  withBorder: boolean;
}

const Header: React.FC<IHeaderProps> = ({ withBorder }) => {
  return (
    <Box
      py="18px"
      style={withBorder ? { borderBottom: "solid 1px rgb(237, 237, 237)" } : {}}
    >
      <Flex className="layout" align="center" justify="space-between">
        <Text>Web3 Campus</Text>
        <ConnectButton />
      </Flex>
    </Box>
  );
};

export default Header;
