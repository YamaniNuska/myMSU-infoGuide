import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radii, shadow } from "../theme";

type PopupSelectOption<T extends string | number> = {
  value: T;
  label: string;
  description?: string;
};

type PopupSelectProps<T extends string | number> = {
  label: string;
  value: T;
  options: readonly PopupSelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  compact?: boolean;
};

export default function PopupSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
  compact = false,
}: PopupSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => Object.is(option.value, value));

  const chooseOption = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {compact ? null : <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={[styles.trigger, compact && styles.triggerCompact]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[styles.triggerText, !selected && styles.placeholderText]}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down-outline" size={17} color={colors.maroon} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setOpen(false)}
              >
                <Ionicons name="close" size={18} color={colors.maroonDark} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.optionScroll}
              contentContainerStyle={styles.optionList}
              showsVerticalScrollIndicator
            >
              {options.map((option) => {
                const selectedOption = Object.is(option.value, value);

                return (
                  <Pressable
                    key={String(option.value)}
                    style={[
                      styles.option,
                      selectedOption && styles.optionSelected,
                    ]}
                    onPress={() => chooseOption(option.value)}
                  >
                    <View style={styles.optionCopy}>
                      <Text
                        style={[
                          styles.optionLabel,
                          selectedOption && styles.optionLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {option.description ? (
                        <Text
                          style={[
                            styles.optionDescription,
                            selectedOption && styles.optionDescriptionSelected,
                          ]}
                        >
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {selectedOption ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color={colors.surface}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexGrow: 1,
    minWidth: 180,
  },
  wrapCompact: {
    minWidth: 140,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
  },
  trigger: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  triggerCompact: {
    minHeight: 38,
    paddingHorizontal: 10,
  },
  triggerText: {
    flex: 1,
    minWidth: 0,
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
  },
  placeholderText: {
    color: colors.muted,
  },
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(34, 26, 28, 0.38)",
  },
  sheet: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "78%",
    overflow: "hidden",
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  sheetHeader: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sheetTitle: {
    flex: 1,
    color: colors.maroonDark,
    fontSize: 15,
    fontWeight: "900",
  },
  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.maroonSoft,
  },
  optionScroll: {
    maxHeight: 360,
  },
  optionList: {
    padding: 10,
    gap: 7,
  },
  option: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  optionSelected: {
    backgroundColor: colors.maroon,
    borderColor: colors.maroon,
  },
  optionCopy: {
    flex: 1,
    minWidth: 0,
  },
  optionLabel: {
    color: colors.maroonDark,
    fontSize: 13,
    fontWeight: "900",
  },
  optionLabelSelected: {
    color: colors.surface,
  },
  optionDescription: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  optionDescriptionSelected: {
    color: colors.surface,
  },
});
