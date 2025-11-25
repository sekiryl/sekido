const DEFAULT_CONFIG = {
  title: "Sekido Demo",
  theme: "sekiratte",
  accent: "peach",
  logo: "default",
  quote: "default",
  font: "default",
  resetHour: 3,
  daySchedule: {
    dayStart: 7,
    dayEnd: 23,
  },
  modules: ["dayProgress", "todos", "habits"],
  habits: [
    { id: 1, name: "Exercise", icon: "fitness_center", color: "red" },
    { id: 2, name: "Read", icon: "book", color: "blue" },
    { id: 3, name: "Meditate", icon: "self_improvement", color: "green" },
  ]
};
