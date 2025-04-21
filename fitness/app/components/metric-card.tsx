import { View, Text, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface MetricCardProps {
  title: string
  value: string
  unit?: string
  color: string
  icon: keyof typeof Ionicons.glyphMap
  chartType: "line" | "bar"
  lineStyle?: "normal" | "heartbeat"
}

const cardWidth = (Dimensions.get("window").width - 48) / 2

// Custom chart components using View instead of react-native-chart-kit
const SimpleLineChart = ({ color, data, style, lineStyle }: any) => {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue

  return (
    <View style={[styles.chartWrapper, style]}>
      <View style={styles.chartContent}>
        {data.map((value: number, index: number) => {
          const height = range === 0 ? 50 : ((value - minValue) / range) * 50
          return (
            <View key={index} style={styles.chartColumn}>
              {lineStyle === "heartbeat" ? (
                <View
                  style={[
                    styles.heartbeatLine,
                    {
                      height: 2,
                      backgroundColor: color,
                      transform: [{ translateY: 25 - height / 2 }, { scaleY: index % 2 === 0 ? 1 : -1 }],
                    },
                  ]}
                />
              ) : (
                <View
                  style={[
                    styles.linePoint,
                    {
                      height: 2,
                      backgroundColor: color,
                      transform: [{ translateY: 50 - height }],
                    },
                  ]}
                />
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

const SimpleBarChart = ({ color, data, style }: any) => {
  const maxValue = Math.max(...data)

  return (
    <View style={[styles.chartWrapper, style]}>
      <View style={styles.chartContent}>
        {data.map((value: number, index: number) => {
          const height = maxValue === 0 ? 0 : (value / maxValue) * 50
          return (
            <View key={index} style={styles.chartColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default function MetricCard({
  title,
  value,
  unit,
  color,
  icon,
  chartType,
  lineStyle = "normal",
}: MetricCardProps) {
  // Generate random data for charts
  const chartData =
    lineStyle === "heartbeat"
      ? [50, 80, 40, 95, 30, 70]
      : [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ]

  const getColorRgb = () => {
    switch (color) {
      case "#1DB954":
        return "29, 185, 84"
      case "#4A9DFF":
        return "74, 157, 255"
      case "#FF4A55":
        return "255, 74, 85"
      default:
        return "255, 169, 74"
    }
  }

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>

      <View style={styles.chartContainer}>
        {chartType === "line" ? (
          <SimpleLineChart color={color} data={chartData} lineStyle={lineStyle} />
        ) : (
          <SimpleBarChart color={color} data={chartData} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    color: "#888",
    fontSize: 14,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  value: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 4,
  },
  unit: {
    color: "#888",
    fontSize: 12,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    overflow: "hidden",
  },
  chartWrapper: {
    width: "100%",
    height: 60,
    justifyContent: "flex-end",
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 50,
    width: "100%",
  },
  chartColumn: {
    flex: 1,
    height: 50,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  linePoint: {
    width: "80%",
    borderRadius: 1,
  },
  heartbeatLine: {
    width: "80%",
    borderRadius: 1,
  },
  bar: {
    width: "60%",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
})
