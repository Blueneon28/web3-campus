import { Colors } from "@/constants/colors";
import { Alert, Box, Flex, Select, Text } from "@mantine/core";
import React from "react";

const StudentDashboardHistory = () => {
  return (
    <Box w="100%">
      <Alert variant="light" color="blue" title="Important Notes" radius="10px">
        If you find suspicious any activities, please contact our team support
        immediately.
      </Alert>
      <Flex mt="20px" align="center" justify="space-between">
        <Text size="24px" fw="700" lts="-0.25px" color={Colors.primary}>
          Activity History
        </Text>
        <Select
          w="35%"
          placeholder="Activity Type"
          styles={{
            input: {
              height: "45px",
              borderRadius: "8px",
            },
          }}
          data={[
            { label: "Topup", value: "TOPUP" },
            { label: "Withdraw", value: "WITHDRAW" },
            { label: "Achievement", value: "ACHIEVEMENT" },
          ]}
        />
      </Flex>
    </Box>
  );
};

export default StudentDashboardHistory;
