import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster, toast } from "goey-native-toast";
import type { ToastPosition } from "goey-native-toast";

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const ExampleContent = () => {
  const insets = useSafeAreaInsets();
  const [position, setPosition] = useState<ToastPosition>("top-center");
  const [richColors, setRichColors] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Toaster
        position={position}
        richColors={richColors}
        theme={theme}
        closeButton
      />

      <View style={styles.header}>
        <Text style={styles.title}>Goey Native Toast</Text>
        <Text style={styles.subtitle}>
          Lightweight, animated, and customizable
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toast Types</Text>
          <View style={styles.grid}>
            <Button
              label="Success"
              color="#10B981"
              onPress={() => toast.success("Event has been created")}
            />
            <Button
              label="Error"
              color="#EF4444"
              onPress={() => toast.error("Something went wrong")}
            />
            <Button
              label="Info"
              color="#3B82F6"
              onPress={() => toast.info("New updates available")}
            />
            <Button
              label="Warning"
              color="#F59E0B"
              onPress={() => toast.warning("Network connection lost")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          <View style={styles.grid}>
            <Button
              label="With Description"
              color="#6366F1"
              onPress={() =>
                toast.success("Event created", {
                  description: "Monday, January 3rd at 6:00pm",
                })
              }
            />
            <Button
              label="With Action"
              color="#8B5CF6"
              onPress={() =>
                toast.info("Update available", {
                  action: {
                    label: "Update",
                    onClick: () => console.log("Update clicked"),
                  },
                })
              }
            />
            <Button
              label="Promise / Loading"
              color="#EC4899"
              onPress={() => {
                // Since we don't have promise support yet in the minimal implementation,
                // we'll simulate loading with a custom toast or just a standard one for now.
                // Assuming 'loading' type isn't fully implemented in the store public API yet based on my memory,
                // but let's try toast.custom or just show a persistent toast.
                const id = toast.success("Loading...", { duration: 10000 });
                setTimeout(() => {
                  toast.dismiss(id);
                  toast.success("Loaded successfully!");
                }, 2000);
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Position</Text>
          <View style={styles.grid}>
            {POSITIONS.map((pos) => (
              <Button
                key={pos}
                label={pos}
                variant={position === pos ? "filled" : "outlined"}
                onPress={() => setPosition(pos)}
                small
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Rich Colors</Text>
            <Switch value={richColors} onValueChange={setRichColors} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
              value={theme === "dark"}
              onValueChange={(v) => setTheme(v ? "dark" : "light")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Button = ({
  label,
  onPress,
  color = "#000",
  variant = "filled",
  small = false,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: "filled" | "outlined";
  small?: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === "outlined" && styles.buttonOutlined,
      small && styles.buttonSmall,
      variant === "filled" && { backgroundColor: color },
      variant === "outlined" && styles.buttonBorder,
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.buttonText,
        small && styles.buttonTextSmall,
        variant === "outlined" && styles.textBlack,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ExampleContent />
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  buttonBorder: {
    borderColor: "#ccc",
  },
  textBlack: {
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  label: {
    fontSize: 16,
    color: "#374151",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: "45%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonOutlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: "30%",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonTextSmall: {
    fontSize: 12,
  },
});
