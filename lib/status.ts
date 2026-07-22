import type { TicketStatus } from "./types";

export const statusLabels: Record<TicketStatus, string> = {
  WAITING: "En attente",
  CALLED: "Appelé",
  IN_PROGRESS: "En service",
  CLOSED: "Terminé",
  ABSENT: "Absent",
  CANCELLED: "Annulé",
};

export function statusTone(status: TicketStatus): string {
  if (status === "CLOSED" || status === "IN_PROGRESS") return "success";
  if (status === "WAITING" || status === "CALLED") return "warning";
  return "danger";
}

