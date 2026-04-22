export const formatChatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Human-friendly "time since" for chat rows.
 * Today → "14:32", yesterday → "Yesterday", this week → "Tue",
 * older → "3 Apr".
 */
export const formatChatRelative = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysAgo = Math.floor((startOfToday - date) / msPerDay);

  if (daysAgo < 0) return formatChatTime(value);
  if (daysAgo === 0) return formatChatTime(value);
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) {
    return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(date);
};

export const filterChatsBySearch = (chats, search) => {
  const needle = search.trim().toLowerCase();
  if (!needle) return chats;

  return chats.filter((chat) => {
    const haystack = [chat.peer?.name, chat.peer?.city, chat.lastMessage?.body]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
};
