import type { ToastPosition } from "goey-native-toast";
import { Toaster, toast } from "goey-native-toast";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  const [solidColors, setSolidColors] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const colors = {
    background: theme === "light" ? "#F9FAFB" : "#131313",
    card: theme === "light" ? "#FFF" : "#000000",
    text: theme === "light" ? "#111827" : "#F9FAFB",
    subtext: theme === "light" ? "#6B7280" : "#9CA3AF",
    border: theme === "light" ? "#E5E7EB" : "#374151",
    inputBg: theme === "light" ? "#FFF" : "#374151",
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <Toaster
        position={position}
        solidColors={solidColors}
        theme={theme}
        closeButton
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Goey Native Toast
        </Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Lightweight, animated, and customizable
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Position
          </Text>
          <View style={styles.grid}>
            {POSITIONS.map((pos) => (
              <Button
                theme={theme}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Toast Types
          </Text>
          <View style={styles.grid}>
            <Button
              theme={theme}
              label="Success"
              color="#10B981"
              onPress={() => toast.success("Profile updated successfully")}
            />
            <Button
              theme={theme}
              label="Error"
              color="#EF4444"
              onPress={() => toast.error("Payment failed. Please try again.")}
            />
            <Button
              theme={theme}
              label="Info"
              color="#3B82F6"
              onPress={() => toast.info("New version 2.0 is available")}
            />
            <Button
              theme={theme}
              label="Warning"
              color="#F59E0B"
              onPress={() => toast.warning("Your session will expire soon")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Advanced
          </Text>
          <View style={styles.grid}>
            <Button
              theme={theme}
              label="With Description"
              color="#6366F1"
              onPress={() =>
                toast.success("File Uploaded", {
                  description:
                    "report_final.pdf has been successfully uploaded to your drive.",
                  duration: 4000,
                  expandWithSpring: true,
                })
              }
            />
            <Button
              theme={theme}
              label="With Action"
              color="#8B5CF6"
              onPress={() =>
                toast.info("Scheduled Maintenance", {
                  description:
                    "System will be down for 1 hour tonight starting at 2 AM.",
                  expandWithSpring: false,
                  action: {
                    label: "Details",
                    onClick: () => console.log("Details clicked"),
                  },
                })
              }
            />
            <Button
              theme={theme}
              label="Promise (Success)"
              color="#EC4899"
              onPress={() => {
                const promise = new Promise<string>((resolve) =>
                  setTimeout(() => resolve("Image uploaded!"), 2000)
                );
                toast.promise(
                  promise,
                  {
                    loading: "Uploading image...",
                    success: (data) => data,
                    error: "Upload failed",
                  },
                  {
                    expandWithSpring: true,
                  }
                );
              }}
            />
            <Button
              theme={theme}
              label="Promise (Error)"
              color="#EF4444"
              onPress={() => {
                const promise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("Network timeout")), 2000)
                );
                toast.promise(
                  promise,
                  {
                    loading: "Syncing database...",
                    success: "Synced!",
                    error: (err) => `Sync failed: ${err.message}`,
                  },
                  {
                    expandWithSpring: true,
                  }
                );
              }}
            />
            <Button
              theme={theme}
              label="Loading (Manual)"
              color="#6B7280"
              onPress={() => {
                const id = toast.loading("Compressing video...");
                setTimeout(() => {
                  toast.update(id, {
                    type: "success",
                    title: "Compression complete!",
                    duration: 3000,
                  });
                }, 3000);
              }}
            />
            <Button
              theme={theme}
              label="Music Player"
              color="#8B5CF6"
              onPress={() =>
                toast.custom("Now Playing", {
                  style: { width: "full" },
                  icon: <Text style={{ fontSize: 18 }}>🎵</Text>,
                  customBody: (
                    <View style={{ width: "100%", paddingTop: 8 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: colors.text,
                        }}
                      >
                        Neon Nights, Synthwave Collective.
                      </Text>
                      <View style={{ flexDirection: "row", marginBottom: 16 }}>
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 8,
                            backgroundColor: "#1F2937",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text style={{ fontSize: 24 }}>💿</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "700",
                              color: colors.text,
                              marginBottom: 2,
                            }}
                          >
                            Neon Nights
                          </Text>
                          <Text style={{ fontSize: 14, color: colors.subtext }}>
                            Synthwave Collective
                          </Text>
                        </View>
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <View
                          style={{
                            height: 4,
                            backgroundColor:
                              theme === "light" ? "#E5E7EB" : "#374151",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              width: "45%",
                              height: "100%",
                              backgroundColor: "#8B5CF6",
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 4,
                          }}
                        >
                          <Text style={{ fontSize: 10, color: colors.subtext }}>
                            1:24
                          </Text>
                          <Text style={{ fontSize: 10, color: colors.subtext }}>
                            3:45
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <TouchableOpacity>
                          <Text style={{ fontSize: 24, color: colors.text }}>
                            ⏮️
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor:
                              theme === "light" ? "#111827" : "#F3F4F6",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              color: theme === "light" ? "#FFF" : "#000",
                            }}
                          >
                            ⏸️
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Text style={{ fontSize: 24, color: colors.text }}>
                            ⏭️
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ),
                })
              }
            />
            <Button
              theme={theme}
              label="Meeting Invite"
              color="#3B82F6"
              onPress={() =>
                toast.custom("Meeting Invite", {
                  style: { width: "full" },
                  icon: <Text>📅</Text>,
                  customBody: (
                    <View style={{ paddingTop: 4 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "#DBEAFE",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text
                            style={{ color: "#1E40AF", fontWeight: "bold" }}
                          >
                            JD
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{ fontWeight: "600", color: colors.text }}
                          >
                            John Doe
                          </Text>
                          <Text style={{ color: colors.subtext, fontSize: 12 }}>
                            invited you to "Q4 Planning"
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          backgroundColor:
                            theme === "light" ? "#F3F4F6" : "#374151",
                          padding: 12,
                          borderRadius: 8,
                          marginBottom: 12,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <Text style={{ width: 24 }}>🕒</Text>
                          <Text style={{ fontSize: 13, color: colors.text }}>
                            Today, 2:00 PM - 3:00 PM
                          </Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Text style={{ width: 24 }}>📍</Text>
                          <Text style={{ fontSize: 13, color: colors.text }}>
                            Conference Room A
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor:
                              theme === "light" ? "#111827" : "#F3F4F6",
                            padding: 10,
                            borderRadius: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: theme === "light" ? "white" : "black",
                              fontWeight: "600",
                              fontSize: 13,
                            }}
                          >
                            Accept
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor: "transparent",
                            borderWidth: 1,
                            borderColor:
                              theme === "light" ? "#D1D5DB" : "#4B5563",
                            padding: 10,
                            borderRadius: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: colors.text,
                              fontWeight: "600",
                              fontSize: 13,
                            }}
                          >
                            Decline
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ),
                  dismissible: true,
                })
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Customization
          </Text>
          <View style={styles.grid}>
            <Button
              theme={theme}
              label="Custom Icon Color"
              color="#059669"
              onPress={() =>
                toast.success("Order Placed", {
                  iconColor: "#7C3AED",
                })
              }
            />
            <Button
              theme={theme}
              label="Dark Theme Toast"
              color="#1F2937"
              onPress={() =>
                toast.success("Incognito Mode", {
                  backgroundColor: "#1F2937",
                  textStyle: { color: "#F9FAFB" },
                  iconColor: "#10B981",
                })
              }
            />
            <Button
              theme={theme}
              label="Custom Background"
              color="#DC2626"
              onPress={() =>
                toast.error("Subscription Cancelled", {
                  backgroundColor: "#FEF2F2",
                  textStyle: { color: "#991B1B" },
                  iconColor: "#991B1B",
                })
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Multiple Stacks (New!)
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.subtext, marginBottom: 12 },
            ]}
          >
            Trigger toasts in different positions simultaneously
          </Text>
          <View style={styles.grid}>
            <Button
              theme={theme}
              label="Top Left"
              color="#10B981"
              onPress={() =>
                toast.success("I'm at the Top Left!", { position: "top-left" })
              }
            />
            <Button
              theme={theme}
              label="Top Right"
              color="#3B82F6"
              onPress={() =>
                toast.info("I'm at the Top Right!", { position: "top-right" })
              }
            />
            <Button
              theme={theme}
              label="Bottom Left"
              color="#F59E0B"
              onPress={() =>
                toast.warning("I'm at the Bottom Left!", {
                  position: "bottom-left",
                })
              }
            />
            <Button
              theme={theme}
              label="Bottom Right"
              color="#EF4444"
              onPress={() =>
                toast.error("I'm at the Bottom Right!", {
                  position: "bottom-right",
                })
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Options
          </Text>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Solid Colors
            </Text>
            <Switch value={solidColors} onValueChange={setSolidColors} />
          </View>
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>
              Dark Mode
            </Text>
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
  theme,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  variant?: "filled" | "outlined";
  small?: boolean;
  theme?: "light" | "dark";
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      variant === "outlined" && styles.buttonOutlined,
      small && styles.buttonSmall,
      variant === "filled" && { backgroundColor: color },
      variant === "outlined" && styles.buttonBorder,
      variant === "outlined" && {
        borderColor: theme === "dark" ? "#374151" : "#ccc",
      },
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.buttonText,
        small && styles.buttonTextSmall,
        variant === "outlined" && styles.textBlack,
        variant === "outlined" &&
          theme === "dark" && {
            color: "#E5E7EB",
          },
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
