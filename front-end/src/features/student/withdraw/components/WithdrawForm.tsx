"use client";
import { Colors } from "@/constants/colors";
import {
  Box,
  Button,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import React, { useState } from "react";

const WithdrawForm = () => {
  const [amount, setAmount] = useState<string | number>(0);

  return (
    <Paper
      radius="lg"
      p="xl"
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Text size="24px" fw="700" lts="-0.25px" color={Colors.primary}>
        Withdraw Credit
      </Text>
      <Stack mt="35px" gap="20px">
        <Stack gap="6px">
          <Text fw="500">You will withdraw</Text>
          <NumberInput
            placeholder="Amount"
            styles={{
              input: {
                height: "60px",
                borderColor: "#ced4da",
                borderRadius: "10px",
              },
            }}
            thousandSeparator=","
            hideControls
            onChange={setAmount}
          />
        </Stack>
        <Stack gap="6px">
          <Text fw="500">You will receive</Text>
          <NumberInput
            disabled
            value={amount}
            styles={{
              input: {
                height: "60px",
                backgroundColor: "white",
                color: "#A0A0A0",
                cursor: "not-allowed",
                opacity: 1,
                borderRadius: "10px",
              },
            }}
            thousandSeparator=","
            hideControls
            prefix="IDR "
          />
        </Stack>
        <Box>
          <Text size="12px" fw="500">
            Exchange Rate
          </Text>
          <Text size="14px" mt="8px" fw="600" color="gray">
            1 Campus Credit = 1 IDR
          </Text>
        </Box>
        <Select
          mt="20px"
          placeholder="Destination Bank"
          styles={{
            input: {
              height: "60px",
              borderRadius: "10px",
            },
            dropdown: {
              borderRadius: "10px",
            },
            option: {
              height: "40px",
            },
          }}
          data={[{ label: "BCA 7880123400", value: "BCA" }]}
        />
        <Button mt="20px" h="50px" radius="50px" color={Colors.primary}>
          Withdraw
        </Button>
      </Stack>
    </Paper>
  );
};

export default WithdrawForm;
