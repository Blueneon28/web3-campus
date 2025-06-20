"use client";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React from "react";
import Header from "@/components/Header";
import { BanknoteArrowDown, Send, Wallet, Zap } from "lucide-react";
import { Colors } from "@/constants/colors";

const primaryBlue = "#0F56E6";
const lighterBlue = "#3B82F6";
const darkerBlue = "#0C47BC";

const Landing = () => {
  return (
    <Box>
      <Header withBorder={false} />
      <Box className="layout" py="120px">
        {/* Hero */}
        <Box
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(15,86,230,0.05), rgba(59,130,246,0.15))",
            borderRadius: "9999px",
            filter: "blur(120px)",
            transform: "translateY(-50%) scale(1.5)",
            zIndex: -1,
          }}
        />

        <Container size="lg" px="md" pos="relative" style={{ zIndex: 2 }}>
          <Stack align="center" gap="xl" ta="center">
            <Stack gap="sm" maw={800}>
              <Group
                px="md"
                py="xs"
                style={{
                  alignSelf: "center",
                  borderRadius: 9999,
                  background: "#E0ECFF",
                  border: "1px solid rgba(15, 86, 230, 0.3)",
                }}
              >
                <Zap size={16} color={primaryBlue} />
                <Text size="sm" fw={500} color={primaryBlue}>
                  Revolutionary Campus Payment System
                </Text>
              </Group>

              {/* Title */}
              <Title
                order={1}
                style={{
                  background: `linear-gradient(to right, ${primaryBlue}, ${lighterBlue}, ${darkerBlue})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 700,
                  fontSize: "clamp(2.5rem, 5vw, 5rem)",
                  lineHeight: 1.1,
                }}
              >
                The Future of Campus Payments is Here
              </Title>

              {/* Description */}
              <Text size="lg" c="dimmed">
                Seamlessly manage your campus finances with blockchain
                technology. Students and merchants unite in a decentralized
                ecosystem built for the modern university.
              </Text>
            </Stack>

            {/* CTA Buttons */}
            <Group align="center" gap="md">
              <Button
                size="lg"
                radius="md"
                style={{
                  background: `linear-gradient(to right, ${primaryBlue}, ${lighterBlue})`,
                  fontSize: "1.125rem",
                  color: "white",
                  border: "none",
                }}
              >
                Launch App
              </Button>

              <Button
                size="lg"
                variant="outline"
                radius="md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderColor: "#D1D5DB",
                  color: "#1E293B",
                  fontSize: "1.125rem",
                }}
              >
                Watch Demo
              </Button>
            </Group>

            {/* Stats */}
            <Group align="center" gap="xl" pt="lg">
              {[
                { label: "Active Students", value: "10K+" },
                { label: "Campus Merchants", value: "500+" },
                { label: "Transactions", value: "$2M+" },
              ].map((stat) => (
                <Stack key={stat.label} align="center" gap={4}>
                  <Text size="xl" fw={700} color="dark">
                    {stat.value}
                  </Text>
                  <Text size="sm" color="gray">
                    {stat.label}
                  </Text>
                </Stack>
              ))}
            </Group>
          </Stack>
        </Container>
        {/* Features */}
        <Box pt="200px">
          <Title ta="center" size="32px">
            Simple. Seamless. Secure
          </Title>
          <Text mt="10px" size="md" c="dimmed" ta="center">
            Everything you need for campus payments in one platform
          </Text>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
            <Card radius="md" withBorder>
              <Flex
                w="40px"
                h="40px"
                style={{
                  borderRadius: "10px",
                  background: `linear-gradient(to right, ${primaryBlue}, ${lighterBlue})`,
                  fontSize: "1.125rem",
                  border: "none",
                }}
                align="center"
                justify="center"
              >
                <Wallet color="white" />
              </Flex>
              <Text mt="20px" fw="bold" size="18px" lts="-0.5px">
                Easy Topup
              </Text>
              <Text mt="10px" size="sm" c="dimmed">
                Instantly add funds to your campus wallet using various payment
                methods including crypto and fiat
              </Text>
            </Card>
            <Card radius="md" withBorder>
              <Flex
                w="40px"
                h="40px"
                style={{
                  borderRadius: "10px",
                  background: `linear-gradient(to right, ${primaryBlue}, ${lighterBlue})`,
                  fontSize: "1.125rem",
                  border: "none",
                }}
                align="center"
                justify="center"
              >
                <Send color="white" />
              </Flex>
              <Text mt="20px" fw="bold" size="18px" lts="-0.5px">
                Quick Transfer
              </Text>
              <Text mt="10px" size="sm" c="dimmed">
                Send campus tokens to friends instantly with zero fees and
                lightning-fast blockchain transactions
              </Text>
            </Card>
            <Card radius="md" withBorder>
              <Flex
                w="40px"
                h="40px"
                style={{
                  borderRadius: "10px",
                  background: `linear-gradient(to right, ${primaryBlue}, ${lighterBlue})`,
                  fontSize: "1.125rem",
                  border: "none",
                }}
                align="center"
                justify="center"
              >
                <BanknoteArrowDown color="white" />
              </Flex>
              <Text mt="20px" fw="bold" size="18px" lts="-0.5px">
                Secure Withdrawal
              </Text>
              <Text mt="10px" size="sm" c="dimmed">
                Convert your campus tokens back to fiat or crypto with
                bank-grade security and compliance
              </Text>
            </Card>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
