// import { createClient } from '@base44/sdk';
// // import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// // Create a client with authentication required
// export const base44 = createClient({
//   appId: "68dd43016d9b2b5362a063d9", 
//   requiresAuth: true // Ensure authentication is required for all operations
// });

//  THIS PART IS MOCK TO MAKE IT WORK LOCALLY, REMOVE FOR SUBMITION
import { createClient } from "@base44/sdk";

const isMockAuth = import.meta.env.VITE_MOCK_AUTH === "true";

export let base44;

if (isMockAuth) {
  console.warn("[MOCK] Using mock Base44 client (no network calls)");

let MOCK_DAILY_ENTRIES = [
  {
    id: "1",
    title: "First mock entry",
    content: "This is the first mock daily entry",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Second mock entry",
    content: "Another example of mock data",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

function wait(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const generateId = () => Math.random().toString(36).substring(2, 10);


  const MOCK_USER = {
    id: "dev-user",
    email: "dev@example.com",
    name: "Dev User",
    full_name: "John Doe",
    role: "admin",
    picture:
      "https://www.gravatar.com/avatar/00000000000000000000000000000000",
    sleep_goal: 8,
    water_goal: 8,
    steps_goal: 10000,
    exercise_goal: 30,
  };

  const mockToken = "dev.mock.token.not.real";

  base44 = {
    auth: {
      loginWithRedirect: (nextUrl) => {
      const target = nextUrl || window.location.pathname;

      console.warn("[MOCK AUTH] loginWithRedirect() redirecting to:", target);

      // simulate real redirect
      window.location.assign(target);
      },
      login: (nextUrl) => {
        console.warn("[MOCK AUTH] login() called", { nextUrl });
      },
      logout: () => {
        console.warn("[MOCK AUTH] logout()");
      },
      isAuthenticated: () => true,
      getUser: async () => ({ ...MOCK_USER }),
      me: async () => {
    console.warn("[MOCK AUTH] me() called");

    let shouldForceRedirect = false;

    try {
      const url = new URL(window.location.href);
      shouldForceRedirect = url.searchParams.get("forceRedirect") === "1";
    } catch (e) {
      console.warn("[MOCK AUTH] Could not parse URL in me()", e);
    }

    if (shouldForceRedirect) {
      console.warn(
        "[MOCK AUTH] Forcing error in me() to trigger loginWithRedirect"
      );
      throw new Error("Forced unauthenticated (mock)");
    }
    return { ...MOCK_USER };
  },
      getAccessToken: async () => mockToken,
      setToken: (token, saveToStorage = false) => {
        console.warn("[MOCK AUTH] setToken()", { token, saveToStorage });
      },
      updateMe: async (data) => {
        console.warn("[MOCK AUTH] updateMe()", data);
        Object.assign(MOCK_USER, data);
        return { ...MOCK_USER };
      },
      updateMyUserData: async (data) => {
        console.warn("[MOCK AUTH] updateMyUserData()", data);
        Object.assign(MOCK_USER, data);
        return { ...MOCK_USER };
      },
    },

    entities: {
      User: {
        me: async () => ({ ...MOCK_USER }),
      },
      DailyEntry: {
        async list(params = {}) {
          console.warn("[MOCK] DailyEntry.list() called with", params);
          await wait();

          let result = [...MOCK_DAILY_ENTRIES];

          if (params?.sort === "-date" || params?.sort === "-createdAt") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }

          if (params?.limit) {
            result = result.slice(0, Number(params.limit));
          }

          return result;
        },

        async get(id) {
          console.warn("[MOCK] DailyEntry.get()", id);
          await wait();

          const item = MOCK_DAILY_ENTRIES.find((e) => e.id === id);
          if (!item) throw new Error("DailyEntry not found");

          return { ...item };
        },

        async create(data) {
          console.warn("[MOCK] DailyEntry.create()", data);
          await wait();

          const now = new Date().toISOString();

          const newEntry = {
            id: generateId(),
            title: data.title || "Untitled entry",
            content: data.content || "",
            createdAt: now,
            updatedAt: now,
          };

          MOCK_DAILY_ENTRIES.unshift(newEntry);
          return { ...newEntry };
        },

        async update(id, data) {
          console.warn("[MOCK] DailyEntry.update()", id, data);
          await wait();

          const index = MOCK_DAILY_ENTRIES.findIndex((e) => e.id === id);
          if (index === -1) throw new Error("DailyEntry not found");

          const updated = {
            ...MOCK_DAILY_ENTRIES[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };

          MOCK_DAILY_ENTRIES[index] = updated;
          return { ...updated };
        },

        async delete(id) {
          console.warn("[MOCK] DailyEntry.delete()", id);
          await wait();

          MOCK_DAILY_ENTRIES = MOCK_DAILY_ENTRIES.filter((e) => e.id !== id);
          return true;
        },
      },
    },
  };
} else {
  // REAL BEHAVIOUR WHEN DEPLOYED
  base44 = createClient({
    appId: "68dd43016d9b2b5362a063d9",
    requiresAuth: true,
  });
}
