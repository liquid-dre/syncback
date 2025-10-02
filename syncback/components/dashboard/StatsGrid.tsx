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
    const diffClassName =
      stat.diff >= 0
        ? `${classes.diffBadge} ${classes.diffPositive}`
        : `${classes.diffBadge} ${classes.diffNegative}`;

    return (
      <Paper withBorder p="xl" radius="lg" key={stat.title} className={classes.card}>
        <div className={classes.header}>
          <div className={classes.iconBadge}>
            <Icon className={classes.icon} size={20} stroke={1.5} />
          </div>
          <div>
            <Text size="sm" fw={600} className={classes.title}>
              {stat.title}
            </Text>
            <Text size="xs" c="dimmed" className={classes.subtitle}>
              Daily insight updates
            </Text>
          </div>
        </div>

        <Group align="flex-end" justify="space-between" mt="lg">
          <Text className={classes.value}>{stat.value}</Text>
          <div className={diffClassName}>
            <DiffIcon size={16} stroke={1.5} />
            <span>{Math.abs(stat.diff)}%</span>
          </div>
        </Group>

        <Text fz="xs" c="dimmed" mt="lg" className={classes.footerText}>
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
