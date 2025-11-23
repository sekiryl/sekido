/**
 * WebTodo Configuration
 * 
 * Customize your productivity app by editing the values below.
 * Changes will be applied automatically when you restart the development server.
 */

export interface AppConfig {
  title: string;
  theme: string;
  accent: string;
  logo: string;
  quote: string;
  font: string;
  resetHour: number;
  daySchedule: {
    dayStart: number;
    dayEnd: number;
  };
  modules: Array<"dayProgress" | "todos" | "habits">;
  habits: Array<{
    id: number;
    name: string;
    icon: string;
    color: string;
  }>;
}

export const DEFAULT_CONFIG: AppConfig = {
  // App title (appears in header, browser tab, and PWA name)
  title: "Sekido",
  
  // Theme name - Available themes in ./src/themes.ts:
  // sekiratte, catppuccin_mocha, nord, gruvbox_dark, gruvbox_light, tokyo_night,
  // dracula, one_dark, solarized_dark, solarized_light, catppuccin_latte,
  // catppuccin_frappe, catppuccin_macchiato, vaporwave, cyberpunk, hacker
  theme: "sekiratte",
  
  // Accent color from your theme's color palette
  // Available colors: red, green, blue, yellow, purple, pink, teal, orange, 
  // peach, mauve, lavender, sky, flamingo, rosewater, maroon
  accent: "peach",
  
  // Logo configuration:
  // "default" = use built-in logo, "" = no logo, "path/to/image.png" = custom logo
  // Used for header logo, favicon, and PWA icon
  logo: "default",
  
  // Quote under the title:
  // "default" = built-in quote, "" = no quote, "Your custom quote" = custom text
  quote: "default",
  
  // Font family from Google Fonts:
  // "default" = use Rubik, "Font Name" = Google Font (e.g., "Inter", "Poppins")
  // Browse fonts at https://fonts.google.com
  font: "default",
  
  // Hour when daily habits reset (0-23, 24-hour format)
  // Example: 3 = habits reset at 3:00 AM
  resetHour: 3,
  
  // Define your active day schedule (affects day progress bar)
  daySchedule: {
    dayStart: 7,  // Day starts at 7:00 AM
    dayEnd: 23,   // Day ends at 11:00 PM (night period: 11 PM - 7 AM)
  },
  
  // App modules - reorder or remove items to customize layout:
  // Available: "dayProgress", "todos", "habits"
  modules: ["dayProgress", "todos", "habits"],
  
  // Your daily habits to track
  // Icons: Browse https://fonts.google.com/icons (use the icon name)
  // Colors: Use any color from your theme's palette (see accent colors above)
  habits: [
    { id: 1, name: "Exercise", icon: "fitness_center", color: "red" },
    { id: 2, name: "Read", icon: "book", color: "blue" },
    { id: 3, name: "Meditate", icon: "self_improvement", color: "green" },
  ]
};
