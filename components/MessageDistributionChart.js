import { useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import { MONTHS } from '../constants';
import theme from '../styles/theme';

const customTheme = {
  ...VictoryTheme.material,
  axis: {
    ...VictoryTheme.material.axis,
    style: {
      ...VictoryTheme.material.axis.style,
      tickLabels: {
        ...VictoryTheme.material.axis.style.tickLabels,
        ...theme.fontSize.xs,
        fontFamily: theme.fontFamily.body,
      },
    },
  },
};

export default function MessageDistributionChart({
  fadeAnim,
  messageAggregation,
}) {
  const data = useMemo(() => {
    const messageData = Array(MONTHS.length).fill(0);
    messageAggregation.forEach((item) => {
      messageData[item._id - 1] = item.count;
    });
    return messageData.map((count, index) => ({
      month: MONTHS[index],
      count,
    }));
  }, [messageAggregation]);

  return (
    <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
      <Text style={styles.chartTitle}>Distribuție mesaje pe luni</Text>
      <View style={styles.chartWrapper}>
        <VictoryChart
          domainPadding={{ x: theme.spacing[4] }}
          theme={customTheme}
        >
          <VictoryAxis
            style={{
              axis: { stroke: theme.colors.textSecondary },
              ticks: { stroke: theme.colors.textSecondary },
              tickLabels: {
                angle: -45,
                textAnchor: 'end',
                fill: theme.colors.textPrimary,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: theme.colors.textSecondary },
              grid: {
                stroke: theme.colors.textSecondary,
                strokeDasharray: '4,8',
              },
              ticks: { stroke: theme.colors.textSecondary },
              tickLabels: { fill: theme.colors.textPrimary },
            }}
          />
          <VictoryBar
            data={data}
            x="month"
            y="count"
            style={{
              data: {
                fill: theme.colors.primary,
                stroke: theme.colors.primary,
                strokeWidth: 1,
                width: theme.spacing[4],
              },
            }}
          />
        </VictoryChart>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: theme.spacing[4],
  },
  chartTitle: {
    ...theme.fontSize.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.heading,
    marginBottom: theme.spacing[2],
  },
  chartWrapper: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[2],
  },
});
