// src/util/time.js

export const getTimeAgo = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return "Invalid Date";

  const now = new Date();
  const diffMs = now - parsedDate;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) {
    return "now";
  } else if (diffMinutes < 5) {
    return "5 min";
  } else if (diffMinutes < 15) {
    return "15 min";
  } else if (diffMinutes < 30) {
    return "30 min";
  } else if (diffMinutes < 60) {
    return "1 hour";
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""}`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  } else {
    return `${diffYears} year${diffYears !== 1 ? "s" : ""}`;
  }
};
