import { StyleSheet } from "react-native";

const colors = {
  primary: "#4A90E2",  // Soft Blue
  secondary: "#6FCF97", // Muted Green
  accent: "#F2C94C", // Subtle Yellow
  background: "#FAFAFA", // Off-white for a breathable UI
  text: "#333333", // Dark Gray for contrast
  gray: "#BDBDBD", // Neutral Gray
  white: "#FFFFFF", // Pure White
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  taskItem: {
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: colors.gray,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "85%",
    padding: 25,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.gray,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    marginBottom: 12,
    fontSize: 16,
    letterSpacing: 0.3,
  },
});