import Ionicons from "@expo/vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import {
  signOut,
  updateProfileDetails,
  uploadProfileAvatar,
  useAuthSession,
} from "../src/auth/localAuth";
import type { UserRecord, UserRole } from "../src/data/mymsuDatabase";
import { bottomTabClearance, colors, maxContentWidth, radii, shadow } from "../src/theme";

const defaultStudentAvatar = require("../assets/images/default-student-avatar.webp");
const defaultFacultyAvatar = require("../assets/images/default-faculty-avatar.webp");

type ProfileForm = {
  name: string;
  idNumber: string;
  avatarUrl: string;
  college: string;
  program: string;
  yearLevel: string;
  section: string;
  phone: string;
  address: string;
  bio: string;
};

type ProfileFieldConfig = {
  key: keyof ProfileForm;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "phone-pad";
};

const defaultProfileForm: ProfileForm = {
  name: "",
  idNumber: "",
  avatarUrl: "",
  college: "",
  program: "",
  yearLevel: "",
  section: "",
  phone: "",
  address: "",
  bio: "",
};

const profileFormFromUser = (user: UserRecord): ProfileForm => ({
  name: user.name,
  idNumber: user.idNumber ?? "",
  avatarUrl: user.avatarUrl ?? "",
  college: user.college ?? "",
  program: user.program ?? "",
  yearLevel: user.yearLevel ?? "",
  section: user.section ?? "",
  phone: user.phone ?? "",
  address: user.address ?? "",
  bio: user.bio ?? "",
});

const getEditableProfileFields = (role: UserRole): ProfileFieldConfig[] => {
  const baseFields: ProfileFieldConfig[] = [
    { key: "name", label: "Name / username", placeholder: "Your name" },
  ];

  if (role === "student") {
    return [
      ...baseFields,
      { key: "idNumber", label: "ID Number", placeholder: "e.g. 2024-00001" },
      { key: "college", label: "College", placeholder: "College / department" },
      { key: "program", label: "Program", placeholder: "Program or course" },
      { key: "yearLevel", label: "Year level", placeholder: "e.g. 3rd Year" },
      {
        key: "phone",
        label: "Phone",
        placeholder: "Contact number",
        keyboardType: "phone-pad",
      },
      { key: "address", label: "Address", placeholder: "Home or campus address" },
      {
        key: "bio",
        label: "Bio",
        placeholder: "Short note about you",
        multiline: true,
      },
    ];
  }

  if (role === "faculty" || role === "employee") {
    return [
      ...baseFields,
      {
        key: "college",
        label: "Office / Department",
        placeholder: "Office or department",
      },
      {
        key: "phone",
        label: "Phone",
        placeholder: "Contact number",
        keyboardType: "phone-pad",
      },
      { key: "address", label: "Address", placeholder: "Office or campus address" },
      {
        key: "bio",
        label: "Bio",
        placeholder: "Short note about you",
        multiline: true,
      },
    ];
  }

  return [
    ...baseFields,
    {
      key: "phone",
      label: "Phone",
      placeholder: "Contact number",
      keyboardType: "phone-pad",
    },
    {
      key: "bio",
      label: "Bio",
      placeholder: role === "admin" ? "Admin profile note" : "Short note about you",
      multiline: true,
    },
  ];
};

const getProfileDetailItems = (user: UserRecord) => {
  if (user.role === "student") {
    return [
      ["Name / username", user.name],
      ["ID Number", user.idNumber],
      ["College", user.college],
      ["Program", user.program],
      ["Year level", user.yearLevel],
      ["Phone", user.phone],
      ["Address", user.address],
      ["Bio", user.bio],
    ];
  }

  if (user.role === "faculty" || user.role === "employee") {
    return [
      ["Name / username", user.name],
      ["Office / Department", user.college],
      ["Phone", user.phone],
      ["Address", user.address],
      ["Bio", user.bio],
    ];
  }

  return [
    ["Name / username", user.name],
    ["Phone", user.phone],
    ["Bio", user.bio],
  ];
};

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const user = useAuthSession();
  const entry = React.useRef(new Animated.Value(0)).current;
  const [profileForm, setProfileForm] =
    React.useState<ProfileForm>(defaultProfileForm);
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [profileMessage, setProfileMessage] = React.useState("");
  const editableProfileFields = React.useMemo(
    () => (user ? getEditableProfileFields(user.role) : []),
    [user],
  );
  const profileDetailItems = React.useMemo(
    () => (user ? getProfileDetailItems(user) : []),
    [user],
  );

  React.useEffect(() => {
    Animated.timing(entry, {
      toValue: 1,
      duration: 460,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entry]);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  React.useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm(profileFormFromUser(user));
    setEditingProfile(false);
    setProfileMessage("");
  }, [user]);

  const updateProfileField = (key: keyof ProfileForm, value: string) => {
    setProfileForm((current) => ({ ...current, [key]: value }));
    setProfileMessage("");
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage("");

    const result = await updateProfileDetails(profileForm);

    setSavingProfile(false);
    setProfileMessage(
      result.ok ? "Profile details saved to Supabase." : result.message,
    );

    if (result.ok) {
      setEditingProfile(false);
    }
  };

  const resetProfileForm = () => {
    if (!user) {
      return;
    }

    setProfileForm(profileFormFromUser(user));
    setProfileMessage("");
    setEditingProfile(false);
  };

  const handlePickAvatar = async () => {
    setUploadingAvatar(true);
    setProfileMessage("");

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const upload = await uploadProfileAvatar({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      });

      if (upload.ok && "user" in upload) {
        setProfileForm((current) => ({
          ...current,
          avatarUrl: upload.user.avatarUrl ?? "",
        }));
      }

      setProfileMessage(
        upload.ok ? "Profile picture saved to Supabase." : upload.message,
      );
    } catch (error) {
      setProfileMessage(
        error instanceof Error
          ? error.message
          : "Unable to choose that profile picture.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isWide && styles.contentWide,
          { paddingBottom: bottomTabClearance },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentMotion,
            {
              opacity: entry,
              transform: [
                {
                  translateY: entry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
        {!user ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No Account Signed In</Text>
            <Text style={styles.cardText}>
              Sign in to view visitor, MSU, or admin account access.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.primaryButtonText}>Go to Login</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={[colors.maroonDark, colors.maroon]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCard}
            >
              <View style={styles.avatar}>
                {user.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.avatarImage}
                  />
                ) : user.role === "student" ? (
                  <Image source={defaultStudentAvatar} style={styles.avatarImage} />
                ) : user.role === "faculty" ? (
                  <Image source={defaultFacultyAvatar} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={32} color={colors.surface} />
                )}
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.meta}>
                  {user.role.toUpperCase()} | {user.email}
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Account Access</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{user.role}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Access</Text>
                <Text style={styles.value}>
                  {user.role === "visitor"
                    ? "Visitor guide, map, offices, and announcements"
                    : user.role === "faculty"
                      ? "Handbook, map, schedules, guide, and Faculty Console"
                      : user.role === "student"
                        ? "Handbook, map, schedules, and guide"
                      : "Handbook, map, offices, announcements, and guide"}
                </Text>
              </View>
              {user.role === "faculty" ? (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Faculty Tools</Text>
                  <Text style={styles.value}>Course and prospectus editing</Text>
                </View>
              ) : null}
              {user.role === "admin" ? (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Admin Tools</Text>
                  <Text style={styles.value}>Full CRUD content access</Text>
                </View>
              ) : null}
              <View style={styles.buttonRow}>
                {user.role === "admin" ? (
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => router.push("/screens/AdminPanel")}
                  >
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={colors.surface}
                    />
                    <Text style={styles.primaryButtonText}>Admin Console</Text>
                  </Pressable>
                ) : null}
                {user.role === "faculty" ? (
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() => router.push("/screens/AdminPanel")}
                  >
                    <Ionicons
                      name="school-outline"
                      size={18}
                      color={colors.surface}
                    />
                    <Text style={styles.primaryButtonText}>Faculty Console</Text>
                  </Pressable>
                ) : null}
                <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={colors.surface}
                  />
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.cardTitle}>Profile Details</Text>
                </View>
                {editingProfile ? (
                  <Pressable style={styles.secondaryButton} onPress={resetProfileForm}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.editProfileButton}
                    onPress={() => {
                      setEditingProfile(true);
                      setProfileMessage("");
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={17}
                      color={colors.maroon}
                    />
                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                  </Pressable>
                )}
              </View>

              {editingProfile ? (
                <View style={styles.formGrid}>
                  {editableProfileFields.map((field) => (
                    <View key={field.key} style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{field.label}</Text>
                      <TextInput
                        style={[styles.input, field.multiline && styles.textArea]}
                        value={profileForm[field.key]}
                        onChangeText={(value) =>
                          updateProfileField(field.key, value)
                        }
                        placeholder={field.placeholder}
                        placeholderTextColor="#8B7D7D"
                        keyboardType={field.keyboardType ?? "default"}
                        multiline={field.multiline}
                        textAlignVertical={field.multiline ? "top" : "center"}
                      />
                    </View>
                  ))}

                  <View style={styles.avatarEditor}>
                    <View style={styles.profilePhoto}>
                      {user.avatarUrl ? (
                        <Image
                          source={{ uri: user.avatarUrl }}
                          style={styles.profilePhotoImage}
                        />
                      ) : user.role === "student" ? (
                        <Image
                          source={defaultStudentAvatar}
                          style={styles.profilePhotoImage}
                        />
                      ) : user.role === "faculty" ? (
                        <Image
                          source={defaultFacultyAvatar}
                          style={styles.profilePhotoImage}
                        />
                      ) : (
                        <Ionicons
                          name="person"
                          size={34}
                          color={colors.maroon}
                        />
                      )}
                    </View>
                    <Pressable
                      style={[
                        styles.avatarButton,
                        uploadingAvatar && styles.saveProfileButtonDisabled,
                      ]}
                      onPress={handlePickAvatar}
                      disabled={uploadingAvatar}
                    >
                      <Ionicons
                        name="camera-outline"
                        size={17}
                        color={colors.maroon}
                      />
                      <Text style={styles.avatarButtonText}>
                        {uploadingAvatar ? "Uploading..." : "Set Profile Pic"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.profileDetailGrid}>
                  {profileDetailItems.map(([label, value], index) => (
                    <View
                      key={label}
                      style={[
                        styles.profileDetailItem,
                        label === "Bio" && styles.profileDetailItemLong,
                        index === profileDetailItems.length - 1 &&
                          styles.profileDetailItemLast,
                      ]}
                    >
                      <Text style={styles.profileDetailLabel}>{label}</Text>
                      <Text
                        style={[
                          styles.profileDetailValue,
                          label === "Bio" && styles.profileDetailValueLong,
                        ]}
                      >
                        {value?.trim() || "Not set"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {profileMessage ? (
                <Text
                  style={[
                    styles.profileMessage,
                    profileMessage.includes("saved") && styles.profileSuccess,
                  ]}
                >
                  {profileMessage}
                </Text>
              ) : null}

              {editingProfile ? (
                <Pressable
                  style={[
                    styles.saveProfileButton,
                    savingProfile && styles.saveProfileButtonDisabled,
                  ]}
                  onPress={handleSaveProfile}
                  disabled={savingProfile}
                >
                  <Ionicons
                    name="save-outline"
                    size={18}
                    color={colors.surface}
                  />
                  <Text style={styles.primaryButtonText}>
                    {savingProfile ? "Saving..." : "Save Profile Details"}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </>
        )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    width: "100%",
    alignSelf: "center",
    padding: 18,
  },
  contentMotion: {
    width: "100%",
    gap: 14,
  },
  contentWide: {
    maxWidth: maxContentWidth,
    paddingVertical: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 18,
    padding: 18,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: "900",
  },
  meta: {
    marginTop: 6,
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
  },
  card: {
    padding: 16,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  cardTitle: {
    color: colors.maroonDark,
    fontSize: 18,
    fontWeight: "900",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  editProfileButton: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    backgroundColor: colors.maroonSoft,
    borderWidth: 1,
    borderColor: "#E5C5C8",
  },
  editProfileButtonText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryButtonText: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
  },
  cardText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },
  value: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 13,
    textAlign: "right",
    fontWeight: "800",
  },
  formGrid: {
    gap: 12,
    marginTop: 16,
  },
  profileDetailGrid: {
    marginTop: 16,
    overflow: "hidden",
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  profileDetailItem: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  profileDetailItemLast: {
    borderBottomWidth: 0,
  },
  profileDetailItemLong: {
    minHeight: 92,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    paddingVertical: 13,
  },
  profileDetailLabel: {
    width: 116,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  profileDetailValue: {
    flex: 1,
    minWidth: 0,
    color: colors.ink,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800",
    textAlign: "right",
  },
  profileDetailValueLong: {
    textAlign: "left",
    lineHeight: 20,
  },
  inputGroup: {
    gap: 7,
  },
  inputLabel: {
    color: colors.maroonDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  input: {
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  textArea: {
    minHeight: 92,
    lineHeight: 19,
  },
  avatarEditor: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
  },
  profilePhoto: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.maroonSoft,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profilePhotoImage: {
    width: "100%",
    height: "100%",
  },
  avatarButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatarButtonText: {
    color: colors.maroon,
    fontSize: 12,
    fontWeight: "900",
  },
  profileMessage: {
    marginTop: 12,
    color: colors.warning,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800",
  },
  profileSuccess: {
    color: colors.success,
  },
  saveProfileButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  saveProfileButtonDisabled: {
    opacity: 0.66,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.maroon,
  },
  signOutButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
});
