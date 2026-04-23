"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recentActivity = [
  {
    name: "John Smith",
    action: "Patient intake completed",
    by: "Dr. Sarah Chen",
    initials: "JS",
    time: "30 min ago",
  },
  {
    name: "Maria Garcia",
    action: "Prescription issued",
    by: "Dr. James Wilson",
    initials: "MG",
    time: "2 hours ago",
  },
  {
    name: "David Lee",
    action: "Consultation scheduled",
    by: "Staff – Emily Davis",
    initials: "DL",
    time: "4 hours ago",
  },
  {
    name: "Anna Brown",
    action: "Patient flagged for review",
    by: "Dr. Sarah Chen",
    initials: "AB",
    time: "6 hours ago",
  },
  {
    name: "Tom Wilson",
    action: "Document uploaded",
    by: "Staff – Mark Johnson",
    initials: "TW",
    time: "8 hours ago",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {recentActivity.map((item) => (
        <div key={item.name} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{item.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-wrap items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.action}</p>
            </div>
            <div className="text-sm text-muted-foreground">{item.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
