import { DEFAULT_CONFIG } from '../config';
import { THEMES } from './themes';
import { generateHTML } from './html-template';
const SESSION_COOKIE_NAME = "todo-session";
const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days

function getTodayResetDate(): Date {
  const now = new Date();
  const resetHour = DEFAULT_CONFIG.resetHour;
  now.setHours(now.getHours() < resetHour ? resetHour - 24 : resetHour, 0, 0, 0);
  return now;
}

function getPreviousResetDate(today: Date): Date {
  const prev = new Date(today);
  prev.setDate(prev.getDate() - 1);
  return prev;
}

async function checkPassword(password: string, env: any): Promise<boolean> {
  return password === env.PASS;
}

function createSessionCookie(): string {
  const expiration = new Date(Date.now() + SESSION_DURATION * 1000);
  return `${SESSION_COOKIE_NAME}=valid; HttpOnly; Secure; Path=/; SameSite=Lax; Expires=${expiration.toUTCString()}`;
}

function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

async function verifySession(request: Request, env: any): Promise<boolean> {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return false;
  
  const cookies = cookieHeader.split(";").map(c => c.trim());
  return cookies.some(cookie => cookie.startsWith(`${SESSION_COOKIE_NAME}=valid`));
}

export default {
  async fetch(req: Request, env: any) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;
    const db = env.DB;

    // Authentication endpoints
    if (path === "/api/check-auth" && method === "GET") {
      const authenticated = await verifySession(req, env);
      return Response.json({ authenticated });
    }

    if (path === "/api/login" && method === "POST") {
      const { password } = await req.json();
      const valid = await checkPassword(password, env);
      
      if (!valid) {
        return new Response("Invalid password", { status: 401 });
      }
      
      const headers = new Headers({
        "Set-Cookie": createSessionCookie(),
        "Content-Type": "application/json"
      });
      
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    // Serve dynamic manifest
    if (path === "/assets/favicon/site.webmanifest") {
      const config = DEFAULT_CONFIG;
      const theme = THEMES[config.theme] || THEMES.sekiratte;
      
      const manifest = {
        name: config.title,
        short_name: config.title.length > 12 ? config.title.substring(0, 12) : config.title,
        start_url: "/",
        display: "standalone",
        background_color: theme.colors.base,
        theme_color: theme.colors.base,
        description: "A modern productivity app for managing todos and tracking habits",
        icons: config.logo === "default" ? [
          {
            src: "./android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ] : config.logo !== "" ? [
          {
            src: config.logo,
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: config.logo,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ] : []
      };
      
      return Response.json(manifest, {
        headers: {
          "Content-Type": "application/manifest+json",
          "Cache-Control": "no-cache"
        }
      });
    }

    // Serve index.html for root path
    if (path === "/") {
      return new Response(generateHTML(), {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-cache"
        }
      });
    }

    if (path === "/api/cron/autoadd" && method === "POST") {
      const url = new URL(req.url);
      const secret = url.searchParams.get("secret");
      const task   = url.searchParams.get("task");
      if (secret !== env.CRON_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      // helper that returns MAX(position)+10
      async function getNextPosition(db) {
        const { maxPos = 0 } = await db
          .prepare("SELECT MAX(position) as maxPos FROM todos")
          .first();
        return maxPos + 10;
      }

      const position = await getNextPosition(db);
      await db
        .prepare("INSERT INTO todos (text, position) VALUES (?, ?)")
        .bind(task, position)
        .run();

      return new Response("ok");
    }

    if (path === "/api/cron/cleanup" && method === "POST") {
      const url    = new URL(req.url);
      const secret = url.searchParams.get("secret");
      if (secret !== env.CRON_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      // nukes all completed todos
      await db
        .prepare("DELETE FROM todos WHERE completed = ?")
        .bind(true)
        .run();

      return new Response("ok");
    }

    // Protect all API routes
    if (path.startsWith("/api/") && !await verifySession(req, env)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // -------- TODOS --------

    if (path === '/api/todos' && method === 'GET') {
      // Order by position
      const { results } = await db.prepare("SELECT * FROM todos ORDER BY position ASC").all();
      return Response.json(results);
    }

    if (path === '/api/todos' && method === 'POST') {
      const { text } = await req.json();
      
      // Get max position for new items
      const maxPosResult = await db.prepare("SELECT MAX(position) as maxPos FROM todos").first();
      const maxPos = maxPosResult?.maxPos || 0;
      const newPosition = maxPos + 10; // Leave space for reordering
      
      await db.prepare("INSERT INTO todos (text, position) VALUES (?, ?)").bind(text, newPosition).run();
      return new Response("Created", { status: 201 });
    }

    // New reorder endpoint
    if (path === '/api/todos/reorder' && method === 'POST') {
      const { todos: newOrder } = await req.json();
      
      // Create batch update statements
      const statements = newOrder.map((id: number, index: number) => {
        const position = index * 10; // Use increments of 10 for flexible reordering
        return db.prepare("UPDATE todos SET position = ? WHERE id = ?").bind(position, id);
      });
      
      // Execute in a batch
      await db.batch(statements);
      
      return new Response("Reordered");
    }

    const toggleMatch = path.match(/^\/api\/todos\/(\d+)\/toggle$/);
    if (toggleMatch && method === 'PUT') {
      await db.prepare("UPDATE todos SET completed = NOT completed WHERE id = ?")
        .bind(toggleMatch[1]).run();
      return new Response("Toggled");
    }

    const deleteMatch = path.match(/^\/api\/todos\/(\d+)$/);
    if (deleteMatch && method === 'DELETE') {
      await db.prepare("DELETE FROM todos WHERE id = ?")
        .bind(deleteMatch[1]).run();
      return new Response("Deleted");
    }

    // -------- HABITS --------
    if (path === '/api/habits' && method === 'GET') {
      const todayDate = getTodayResetDate();
      const today = todayDate.toDateString();
      
      // Get all habits from DB
      const { results: dbHabits } = await db.prepare("SELECT * FROM habits").all();
      const habitsMap = new Map(dbHabits?.map((h: any) => [h.id, h]) || []);

      // Process habits with possible reset
      const habits = [];
      for (const configHabit of DEFAULT_CONFIG.habits) {
        let dbHabit = habitsMap.get(configHabit.id) || {
          id: configHabit.id,
          streak: 0,
          lastCompleted: null,
          lastChecked: null
        };

        // Reset logic - FIXED
        if (dbHabit.lastChecked !== today) {
          const prevResetDate = getPreviousResetDate(todayDate);
          const prevResetDateStr = prevResetDate.toDateString();

          // Only reset streak if not completed in previous cycle
          if (dbHabit.lastCompleted !== prevResetDateStr) {
            dbHabit.streak = 0;
          }
          
          // Update lastChecked to today
          dbHabit.lastChecked = today;
          
          // Update DB
          await db.prepare(
            "INSERT OR REPLACE INTO habits (id, streak, lastCompleted, lastChecked) VALUES (?, ?, ?, ?)"
          ).bind(dbHabit.id, dbHabit.streak, dbHabit.lastCompleted, dbHabit.lastChecked).run();
        }

        habits.push({
          ...configHabit,
          streak: dbHabit.streak,
          lastCompleted: dbHabit.lastCompleted
        });
      }

      return Response.json({ resetDate: today, habits });
    }

    const habitToggleMatch = path.match(/^\/api\/habits\/(\d+)\/toggle$/);
    if (habitToggleMatch && method === 'PUT') {
      const id = parseInt(habitToggleMatch[1]);
      const todayDate = getTodayResetDate();
      const today = todayDate.toDateString();

      // Get current habit state
      const habit = await db.prepare("SELECT * FROM habits WHERE id = ?").bind(id).first() || {
        id,
        streak: 0,
        lastCompleted: null,
        lastChecked: null
      };

      // Toggle completion
      let newStreak = habit.streak;
      let lastCompleted = habit.lastCompleted;
      
      if (habit.lastCompleted === today) {
        // Undo completion
        newStreak = Math.max(0, habit.streak - 1);
        lastCompleted = null;
      } else {
        // Mark as completed
        newStreak = habit.streak + 1;
        lastCompleted = today;
      }

      // Update DB
      await db.prepare(
        "INSERT OR REPLACE INTO habits (id, streak, lastCompleted, lastChecked) VALUES (?, ?, ?, ?)"
      ).bind(id, newStreak, lastCompleted, today).run();

      return new Response("Updated");
    }

    return new Response("Not Found", { status: 404 });
  }
};
