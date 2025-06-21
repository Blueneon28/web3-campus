"use client";

import {
  Box,
  Container,
  Stack,
  Text,
  Title,
  Group,
  Paper,
  ThemeIcon,
  rem,
  Divider,
} from "@mantine/core";
import { Users, Wallet } from "lucide-react";

const stepsStudents = [
  {
    title: "Create Your Wallet",
    description:
      "Sign up with your student email and create your secure Web3 wallet in seconds",
  },
  {
    title: "Top-up Your Balance",
    description:
      "Add funds using credit card, bank transfer, or existing cryptocurrency",
  },
  {
    title: "Start Spending",
    description:
      "Use campus tokens at participating merchants or transfer to friends instantly",
  },
];

const stepsMerchants = [
  {
    title: "Register Your Business",
    description:
      "Complete merchant verification and set up your business profile",
  },
  {
    title: "Accept Payments",
    description:
      "Start receiving campus tokens from students with our integrated POS system",
  },
  {
    title: "Withdraw Earnings",
    description:
      "Convert tokens to fiat currency and withdraw to your business bank account",
  },
];

export default function HowItWorks() {
  return (
    <Box id="how-it-works" pt="50px">
      <Container size="lg">
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: rem(48),
            maxWidth: rem(1200),
            marginInline: "auto",
          }}
        >
          {/* Students Box */}
          <Box pos="relative">
            <Box
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(15, 86, 230, 0.08), rgba(3, 169, 244, 0.08))",
                borderRadius: rem(24),
                filter: "blur(48px)",
                zIndex: 0,
              }}
            />
            <Paper
              p="xl"
              radius="xl"
              withBorder
              style={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Stack align="center" mb="md">
                <ThemeIcon
                  size={64}
                  radius="xl"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(15, 86, 230, 0.2), rgba(15, 86, 230, 0.3))",
                    border: "1px solid rgba(147, 197, 253, 0.4)",
                  }}
                >
                  <Users size={32} color="#0F56E6" />
                </ThemeIcon>
                <Title order={3} c="#0F56E6">
                  For Students
                </Title>
              </Stack>
              <Stack gap="xl" mt="50px">
                {stepsStudents.map((step, idx) => (
                  <Box key={step.title}>
                    <Group align="flex-start" gap="md" wrap="nowrap">
                      <ThemeIcon
                        size={48}
                        radius="xl"
                        style={{
                          background:
                            "linear-gradient(to right, #0F56E6, #3B82F6)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: rem(16),
                        }}
                      >
                        {idx + 1}
                      </ThemeIcon>
                      <Box>
                        <Text fw={600} size="lg">
                          {step.title}
                        </Text>
                        <Text c="dimmed" size="sm" mt="6px">
                          {step.description}
                        </Text>
                      </Box>
                    </Group>
                    {idx < stepsStudents.length - 1 && (
                      <Box
                        ml={rem(24)}
                        style={{
                          width: rem(2),
                          height: rem(24),
                          background:
                            "linear-gradient(to bottom, #0F56E6, transparent)",
                          borderRadius: rem(1),
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* Merchants Box */}
          <Box pos="relative">
            <Box
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(111, 66, 193, 0.08), rgba(221, 42, 123, 0.08))",
                borderRadius: rem(24),
                filter: "blur(48px)",
                zIndex: 0,
              }}
            />
            <Paper
              p="xl"
              radius="xl"
              withBorder
              style={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255, 255, 255, 0.35)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Stack align="center" mb="md">
                <ThemeIcon
                  size={64}
                  radius="xl"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(147, 112, 219, 0.2), rgba(147, 112, 219, 0.3))",
                    border: "1px solid rgba(216, 180, 254, 0.4)",
                  }}
                >
                  <Wallet size={32} color="#7C3AED" />
                </ThemeIcon>
                <Title order={3} c="#7C3AED">
                  For Merchants
                </Title>
              </Stack>
              <Stack gap="xl" mt="50px">
                {stepsMerchants.map((step, idx) => (
                  <Box key={step.title}>
                    <Group align="flex-start" gap="md" wrap="nowrap">
                      <ThemeIcon
                        size={48}
                        radius="xl"
                        style={{
                          background:
                            "linear-gradient(to right, #7C3AED, #9333EA)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: rem(16),
                        }}
                      >
                        {idx + 1}
                      </ThemeIcon>
                      <Box>
                        <Text fw={600} size="lg">
                          {step.title}
                        </Text>
                        <Text c="dimmed" size="sm" mt="6px">
                          {step.description}
                        </Text>
                      </Box>
                    </Group>
                    {idx < stepsMerchants.length - 1 && (
                      <Box
                        ml={rem(24)}
                        style={{
                          width: rem(2),
                          height: rem(24),
                          background:
                            "linear-gradient(to bottom, #9333EA, transparent)",
                          borderRadius: rem(1),
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
