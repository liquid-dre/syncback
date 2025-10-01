"use client";

import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconMessage2,
  IconMoodSmile,
  IconStars,
  IconTrendingUp,
  type TablerIconsProps,
} from "@tabler/icons-react";
import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import classes from "./StatsGrid.module.css";

const icons = {
  rating: IconStars,
  volume: IconMessage2,
  promoters: IconMoodSmile,
  trends: IconTrendingUp,
} satisfies Record<string, (props: TablerIconsProps) => JSX.Element>;

type MetricIconKey = keyof typeof icons;

type Metric = {
  title: string;
  icon: MetricIconKey;
  value: string;
  diff: number;
};

type StatsGridProps = {
  metrics: Metric[];
};

export function StatsGrid({ metrics }: StatsGridProps) {
  if (metrics.length === 0) {
    return (
      <div className={classes.root}>
        <Paper withBorder p="xl" radius="md" className={classes.card}>
          <Text size="sm" c="dimmed">
            Start collecting feedback to unlock live metrics.
          </Text>
        </Paper>
      </div>
    );
  }

  const stats = metrics.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff >= 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title} className={classes.card}>
        <Group justify="space-between">
          <Text size="xs" c="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text c={stat.diff >= 0 ? "teal" : "red"} fz="sm" fw={500} className={classes.diff}>
            <span>{stat.diff}%</span>
            <DiffIcon size={16} stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to last month
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{stats}</SimpleGrid>
    </div>
  );
}
