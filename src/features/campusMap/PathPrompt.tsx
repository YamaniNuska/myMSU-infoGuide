import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { CampusLocation } from "../../data/mymsuDatabase";
import { colors, radii, shadow } from "../../theme";

type PathPromptProps = {
  location: CampusLocation;
  needsTracking: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function PathPrompt({
  location,
  needsTracking,
  onConfirm,
  onCancel,
}: PathPromptProps) {
  return (
    <View style={styles.promptCard}>
      <View style={styles.promptIcon}>
        <Ionicons name="navigate" size={18} color={colors.surface} />
      </View>
      <View style={styles.promptCopy}>
        <Text style={styles.promptTitle}>Find path?</Text>
        <Text style={styles.promptText}>
          {needsTracking
            ? `Start live tracking and I will tell you which way to go to ${location.name}.`
            : `I will tell you which way to go to ${location.name}.`}
        </Text>
      </View>
      <View style={styles.promptActions}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Not now</Text>
        </Pressable>
        <Pressable style={styles.confirmButton} onPress={onConfirm}>
          <Ionicons
            name={needsTracking ? "locate" : "trail-sign"}
            size={15}
            color={colors.surface}
          />
          <Text style={styles.confirmText}>
            {needsTracking ? "Track" : "Find"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promptCard: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  promptIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.maroon,
  },
  promptCopy: {
    flex: 1,
    minWidth: 0,
  },
  promptTitle: {
    color: colors.maroonDark,
    fontSize: 15,
    fontWeight: "900",
  },
  promptText: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  promptActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  cancelText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  confirmText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "900",
  },
});
