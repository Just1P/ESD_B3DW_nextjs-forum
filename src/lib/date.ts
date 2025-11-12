import { formatDistanceToNow as formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

export function getRelativeTime(date: Date): string {
  return formatDistance(date, {
    addSuffix: true,
    locale: fr,
  });
}

export function formatDistanceToNow(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistance(dateObj, {
    addSuffix: true,
    locale: fr,
  });
}
