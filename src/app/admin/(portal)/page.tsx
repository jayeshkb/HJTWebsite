import Link from "next/link";
import { ArrowRight, CalendarDays, HandCoins, Megaphone, UsersRound } from "lucide-react";
import { requireAdminPermission } from "@/lib/auth/permissions";

const workAreas = [
  { title: "Events", description: "Create and publish temple events.", href: "/admin/events", icon: CalendarDays },
  { title: "Announcements", description: "Manage current public notices.", href: "/admin/announcements", icon: Megaphone },
  { title: "Gallery", description: "Prepare albums and temple photographs.", href: "/admin/gallery", icon: UsersRound },
  { title: "Payments", description: "Review payment records and history.", href: "/admin/payments", icon: HandCoins, permission: "finance:manage" as const },
];

export default async function AdminDashboardPage() {
  const { adminUser } = await requireAdminPermission("dashboard:read");
  const permissions = new Set(adminUser.roles.flatMap(({ role }) => {
    if (role.code === "SUPER_ADMIN") return ["finance:manage"];
    if (role.code === "FINANCE") return ["finance:manage"];
    return [];
  }));

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Temple administration</p>
          <h1>Overview</h1>
        </div>
        <p>Manage published information and community requests.</p>
      </div>
      <div className="admin-work-list">
        {workAreas.filter((area) => !area.permission || permissions.has(area.permission)).map(({ title, description, href, icon: Icon }) => (
          <Link className="admin-work-link" href={href} key={href}>
            <span className="admin-work-icon"><Icon size={22} aria-hidden="true" /></span>
            <span><strong>{title}</strong><small>{description}</small></span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </>
  );
}