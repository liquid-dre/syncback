"use client";

import clsx from "clsx";

import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
  IconRefresh,
  TablerIconsProps,
} from "@tabler/icons-react";
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMegaMenu.module.css";
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "@/lib/theme-context";

type MockDataItem = {
  icon: (props: TablerIconsProps) => JSX.Element;
  title: string;
  description: string;
};

const mockdata: MockDataItem[] = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { isDark, themeClassName } = useTheme();

  const accentColor = isDark ? theme.white : theme.colors.blue[6];
  const subtleAccentColor = isDark ? theme.colors.blue[2] : theme.colors.blue[6];
  const brandIconVariant = isDark ? "filled" : "light";
  const featureIconVariant = isDark ? "filled" : "default";

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant={featureIconVariant} radius="md" color="blue">
          <item.icon size={22} color={accentColor} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box pb={24} className={clsx(themeClassName)}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group gap="xs">
            <ThemeIcon size={36} radius="xl" variant={brandIconVariant} color="blue">
              <IconRefresh size={22} color={accentColor} />
            </ThemeIcon>
            <Text fw={700} size="xl">
              syncback
            </Text>
          </Group>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link href="/" className={classes.link}>
              Home
            </Link>
            <SignedIn>
              <Link href="/dashboard" className={classes.link}>
                Dashboard
              </Link>
              <Link href="/settings" className={classes.link}>
                Settings
              </Link>
            </SignedIn>
          </Group>

          <Group visibleFrom="sm" gap="sm" align="center">
            <DarkModeToggle />
            <SignedOut>
              <Button component={Link} href="/sign-in" variant="default">
                Log in
              </Button>
              <Button component={Link} href="/sign-up">
                Sign up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 36, height: 36 } } }} />
            </SignedIn>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />

          <Link href="/" className={classes.link}>
            Home
          </Link>
          <SignedIn>
            <Link href="/dashboard" className={classes.link}>
              Dashboard
            </Link>
            <Link href="/settings" className={classes.link}>
              Settings
            </Link>
          </SignedIn>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={subtleAccentColor} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

          <Divider my="sm" />

          <Group justify="flex-start" px="md" pb="md">
            <DarkModeToggle />
          </Group>

          <SignedOut>
            <Group justify="center" grow pb="xl" px="md">
              <Button component={Link} href="/sign-in" variant="default">
                Log in
              </Button>
              <Button component={Link} href="/sign-up">
                Sign up
              </Button>
            </Group>
          </SignedOut>
          <SignedIn>
            <Group justify="center" pb="xl" px="md">
              <UserButton afterSignOutUrl="/" />
            </Group>
          </SignedIn>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
