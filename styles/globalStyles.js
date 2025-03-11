import { StyleSheet } from "react-native";

const colors = {
  background: "#FAFAFA", // Off-white
  primary: "#4A90E2",  // Soft Blue

  // Texts
  text: "#222222", // Dark Gray
  gray: "#BDBDBD", // Neutral Gray
  white: "#FFFFFF", // Pure White
  lightGray: "#E0E0E0", // Light Gray for subtle UI elements

  // Checkbox
  checked: "#6FCF97", // Muted Green

  selected: "#D9EFFF", // Light Blue for selected items
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontWeight: "bold",
    color: colors.text,
  },

  // Task Screen
  dateButton: {
    borderRadius: 5,
    backgroundColor: colors.white,
    marginRight: 10,
    paddingLeft: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  selectedDateButton: {
    backgroundColor: colors.selected,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text,
  },
  dayText: {
    fontSize: 12,
    color: colors.gray,
  },
  selectedDateText: {
    color: colors.primary,
  },
  tasksContainer: {
    height: "88%",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  taskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: colors.lightGray,
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.checked,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: colors.gray,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.gray,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: "bold",
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
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  recurringDaysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray,
    margin: 4,
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    color: colors.text,
  },
});