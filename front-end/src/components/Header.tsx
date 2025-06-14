import { Flex, Text } from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const Header = () => {
  return (
    <Flex py="20px" className="layout" align="center" justify="space-between">
      <Text>Web3 Campus</Text>
      <ConnectButton />
    </Flex>
  );
};

export default Header;
