import React, { useState } from "react";
import { Box, Container,  Text, Group, ActionIcon } from '@mantine/core';
import { 
  IconGauge, 
  IconUser, 
  IconCookie, 
  IconLock, 
  IconMessage2,
  IconBrandInstagram, 
  IconBrandTwitter, 
  IconBrandYoutube 
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import Header from "@/components/Header";
import footerClasses from './styles/Home.module.css';
import { 
  CreditCard, 
  Send, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  ArrowDownLeft
} from 'lucide-react';
import { ComponentType } from 'react';

const MOCKDATA = [
  {
    icon: IconGauge,
    title: 'Lightning Fast',
    description: 'Process payments in under 2 seconds with our optimized infrastructure.',
    highlight: '< 2 sec'
  },
  {
    icon: IconLock,
    title: 'Bank-Level Security',
    description: 'Military-grade encryption and multi-layer security protocols protect every transaction.',
    highlight: '256-bit SSL'
  },
  {
    icon: IconUser,
    title: 'Privacy First',
    description: 'Zero data collection policy. Your financial information stays completely private.',
    highlight: '0% Data Sold'
  },
  {
    icon: IconCookie,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with no setup fees, no monthly charges, and no hidden costs.',
    highlight: '0% Setup Fee'
  },
  {
    icon: IconMessage2,
    title: 'Global Support',
    description: '24/7 multilingual customer support across 50+ countries with dedicated managers.',
    highlight: '24/7 Support'
  },
  {
    icon: IconGauge,
    title: 'Multi-Currency',
    description: 'Accept payments in 150+ currencies including major cryptocurrencies.',
    highlight: '150+ Currencies'
  },
];

// Footer data
const footerData = [
  {
    title: 'About',
    links: [
      { label: 'Features', link: '#' },
      { label: 'Pricing', link: '#' },
      { label: 'Support', link: '#' },
      { label: 'Forums', link: '#' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Contribute', link: '#' },
      { label: 'Media assets', link: '#' },
      { label: 'Changelog', link: '#' },
      { label: 'Releases', link: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Join Discord', link: '#' },
      { label: 'Follow on Twitter', link: '#' },
      { label: 'Email newsletter', link: '#' },
      { label: 'GitHub discussions', link: '#' },
    ],
  },
];

interface PaymentActionButtonProps {
  icon: ComponentType<{ className?: string }>; // Icon is a React component that accepts className
  onClick: () => void;
  ariaLabel: string;
}

interface FeatureProps {
  icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
  title: string;
  description: string;
  highlight: string;
}

// Clean Feature component
function Feature({ icon: Icon, title, description, highlight }: FeatureProps) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-black hover:shadow-lg transition-all duration-300">
      {/* Icon with simple black background */}
      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
        <Icon size={20} stroke={1.5} className="text-white" />
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-gray-900 transition-colors">
        {title}
      </h3>
      
      {/* Highlight badge - simple black */}
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-black text-xs font-medium mb-3">
        {highlight}
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// Clean Features Grid component
function FeaturesGrid() {
  const features = MOCKDATA.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <section className="py-20 bg-gray-50">
      <Container size="xl">
        {/* Section Header - simplified */}
        <div className="text-center mb-16">
          <div className="text-gray-500 text-sm mb-4 font-medium">— Features</div>
          
          <h2 className="text-5xl font-bold text-black mb-4 leading-tight">
            Why Choose Our Gateway
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Built for modern businesses with cutting-edge technology 
            and unparalleled security.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features}
        </div>

        {/* Stats Section - clean design */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-black mb-2">$2.5B+</div>
              <div className="text-sm text-gray-600">Processed Volume</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black mb-2">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black mb-2">50K+</div>
              <div className="text-sm text-gray-600">Active Merchants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-black mb-2">180+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        </div>

        {/* CTA Section - simple */}
        <div className="text-center mt-12">
          <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300">
            Start Integration
          </button>
          <p className="text-sm text-gray-500 mt-3">No setup fees • 5-minute integration • Free developer support</p>
        </div>
      </Container>
    </section>
  );
}

// Footer component
function FooterLinks() {
  const groups = footerData.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={footerClasses.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={footerClasses.wrapper} key={group.title}>
        <Text className={footerClasses.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <Container className={footerClasses.inner}>
        <div className={footerClasses.logo}>
          <MantineLogo size={30} />
          <Text size="xs" c="dimmed" className={footerClasses.description}>
            Build fully functional accessible web applications faster than ever
          </Text>
        </div>
        <div className={footerClasses.groups}>{groups}</div>
      </Container>
      <Container className={footerClasses.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2024 PaymentGateway. All rights reserved.
        </Text>

        <Group gap={0} className={footerClasses.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}

// Payment Action Button component
const PaymentActionButton = ({ icon: Icon, onClick, ariaLabel }: PaymentActionButtonProps) => (
  <button
    className="bg-gray-100 hover:bg-gray-200 rounded-xl p-3 transition-all duration-300 hover:scale-105"
    onClick={onClick}
    aria-label={ariaLabel}
  >
    <Icon className="w-5 h-5 text-gray-600 mx-auto mb-1" />
  </button>
);

// Main Landing component
const Landing = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <>
      <Box>
        <Header withBorder={false} />
        
        {/* Hero Section */}
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-pink-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gradient-to-br from-orange-200/40 via-pink-300/50 to-purple-300/40 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-300/30 via-cyan-300/40 to-teal-300/30 rounded-full blur-2xl" />
            <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-gradient-to-br from-pink-300/35 via-rose-300/45 to-orange-300/35 rounded-full blur-2xl" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-6 max-w-7xl mx-auto pt-8">
            {/* Left Side - Text Content */}
            <div className="lg:w-1/2 mb-12 lg:mb-0 pt-20 pl-4">
              <div className="text-gray-500 text-sm mb-4 font-medium">— For Freelance</div>
              <h1 className="text-black text-6xl font-bold mb-6 leading-tight">
                Payment Made<br />
                <span className="relative">
                  Easy.
                  <div className="absolute bottom-2 left-0 w-full h-1 bg-black rounded-full" />
                </span>
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 max-w-md leading-relaxed">
                Free Payment Gateway. Supports Networking,<br />
                Credit, Debit Cards, UPI etc.
              </p>
              
              <div className="flex space-x-4 mb-16">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side - Payment Interface */}
            <div className="lg:w-1/2 relative h-[600px] pt-8">
              {/* Current Balance Card */}
              <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 w-48 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-500 text-xs font-medium">Current Balance</div>
                  <button 
                    onClick={toggleBalanceVisibility}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
                  >
                    {isBalanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-black text-xl font-bold mb-3">
                  {isBalanceVisible ? '$290.5' : '••••••'}
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-xs w-full hover:bg-gray-800 transition-all duration-300">
                  Add More
                </button>
              </div>

              {/* Main Payment Card */}
              <div className="absolute top-16 right-12 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 w-80 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">AJ</span>
                    </div>
                    <div>
                      <div className="text-black font-semibold text-sm">Aily Jenifer</div>
                      <div className="text-gray-500 text-xs">Premium</div>
                    </div>
                  </div>
                  <button aria-label="More options">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mb-1">
                  <div className="text-black text-3xl font-bold mb-1">
                    {isBalanceVisible ? '$ 6421.50' : '$ ••••••'}
                  </div>
                  <div className="text-gray-500 text-sm mb-4">Balance</div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-400 text-sm">•••• •••• ••••</div>
                  <div className="text-black font-mono text-sm font-semibold">3567</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <PaymentActionButton 
                    icon={Send} 
                    onClick={() => console.log('Send clicked')} 
                    ariaLabel="Send payment"
                  />
                  <PaymentActionButton 
                    icon={ArrowDownLeft} 
                    onClick={() => console.log('Receive clicked')} 
                    ariaLabel="Receive payment"
                  />
                  <PaymentActionButton 
                    icon={CreditCard} 
                    onClick={() => console.log('Card clicked')} 
                    ariaLabel="Card options"
                  />
                </div>

                <button className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300">
                  Pay
                </button>
              </div>

              {/* Outstanding Card */}
              <div className="absolute top-64 left-8 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 w-44 shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="text-black text-sm font-semibold">Outstanding</div>
                </div>
                <div className="text-black text-xl font-bold mb-1">$89.5</div>
                <button className="bg-black text-white px-4 py-2 rounded-lg text-xs w-full hover:bg-gray-800 transition-all duration-300">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>

      {/* Features Section */}
      <FeaturesGrid />

      {/* Footer Section */}
      <FooterLinks />
    </>
  );
};

export default Landing;