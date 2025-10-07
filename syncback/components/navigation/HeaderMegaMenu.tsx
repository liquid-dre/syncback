"use client";

import clsx from "clsx";

import { IconRefresh } from "@tabler/icons-react";
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMegaMenu.module.css";
import { DarkModeToggle } from "./DarkModeToggle";
import { useTheme } from "@/lib/theme-context";

export function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const { isDark, themeClassName } = useTheme();

  const accentColor = isDark ? theme.white : theme.colors.blue[6];
  const brandIconVariant = isDark ? "filled" : "light";

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
