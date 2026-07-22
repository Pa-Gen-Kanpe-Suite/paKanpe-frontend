import { statusLabels, statusTone } from "@/lib/status";
import type { TicketStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={"status-badge " + statusTone(status)}>{statusLabels[status]}</span>;
}

