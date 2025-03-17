import { StyleSheet } from "react-native";

export const colors = {
  background: "rgba(250, 250, 250, 1)", // Off-white
  primary: "rgba(74, 144, 226, 1)",     // Soft Blue

  // Texts
  text: "rgba(34, 34, 34, 1)",          // Dark Gray main text
  gray: "rgba(142, 142, 142, 1)",       // Gray for sub text
  lightGray: "rgba(224, 224, 224, 1)",  // Light Gray for subtle UI elements
  white: "rgba(255, 255, 255, 1)",      // White

  // Checkbox
  checked: "rgba(111, 207, 151, 1)",    // Muted Green

  selected: "rgba(217, 239, 255, 1)",   // Light Blue for selected items
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

  /** 
   * Task Screen --------------------------------------------------------------------------------------------
  */

  // Horizontal scroling dates
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

  // Tasks list
  tasksContainer: {
    height: "88%",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  assignmentsBackground: {
    backgroundColor: "rgba(232, 47, 62, 1)",
    width: 35,
    height: 35,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  revisionBackground: {
    backgroundColor: "rgba(167, 103, 231, 1)",
    width: 35,
    height: 35,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  practiceBackground: {
    backgroundColor: "rgba(94, 138, 237, 1)",
    width: 35,
    height: 35,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  taskText: {
    fontSize: 14,
    color: colors.text,
  },
  taskCategoryText: {
    fontSize: 12,
    color: colors.gray,
  },
  taskCheckbox: {
    width: 25,
    height: 25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    backgroundColor: colors.lightGray,
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.checked,
  },

  // Add task button
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

  // Add task modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(29, 29, 29, 0.4)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 15,
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
  categorySelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#6200ea',
  },
  categoryButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  /**
   * Task Screen --------------------------------------------------------------------------------------------
  */
});