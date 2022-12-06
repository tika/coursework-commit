import { Timestamp } from "firebase/firestore";

export function daysUntil(date: Date) {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(date: Timestamp) {
  if (!date) {
    return "not too long";
  }

  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (60 * 1000));
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return seconds + "s";
  }
  if (minutes < 60) {
    return minutes + "m";
  }
  if (hours < 24) {
    return hours + "h";
  }
  return days + "d";
}
