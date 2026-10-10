import type { Metadata } from "next";
import { formatInTimeZone } from "date-fns-tz";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment records",
  robots: { index: false, follow: false },
};

function formatAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.trim() }).format(amountMinor / 100);
}

export default async function AdminPaymentsPage() {
  await requireAdminPermission("finance:manage");
  const [payments, totals] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        donation: { include: { fund: true, donor: true } },
        membership: { include: { membershipType: true } },
        hallReservation: { include: { hall: true } },
        priestRequest: true,
      },
    }),
    prisma.payment.groupBy({
      by: ["status", "currency"],
      _count: { _all: true },
      _sum: { amountMinor: true },
    }),
  ]);

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Finance</p><h1>Payments</h1></div>
        <p>Review recorded payment activity. Payment entries are read-only here.</p>
      </div>

      <section className="admin-module" aria-labelledby="payment-totals-title">
        <div className="admin-module-heading">
          <h2 id="payment-totals-title">Recorded totals by status</h2>
          <span>{payments.length === 100 ? "Latest 100 records" : `${payments.length} records`}</span>
        </div>
        {totals.length === 0 ? (
          <p className="admin-empty">No payment records yet. Test or real payments will appear here when created by payment workflows.</p>
        ) : (
          <div className="admin-record-list">
            {totals.map((total) => (
              <article className="admin-record" key={`${total.status}-${total.currency}`}>
                <div>
                  <h3>{total.status}</h3>
                  <p>{total._count._all} records · {formatAmount(total._sum.amountMinor ?? 0, total.currency)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-module" aria-labelledby="payment-records-title">
        <div className="admin-module-heading">
          <h2 id="payment-records-title">Recent activity</h2>
          <span>Latest {payments.length}</span>
        </div>
        {payments.length === 0 ? (
          <p className="admin-empty">No transactions to review.</p>
        ) : (
          <div className="admin-record-list">
            {payments.map((payment) => {
              const purpose = payment.donation
                ? `Donation · ${payment.donation.fund.name}${payment.donation.anonymous ? " · Anonymous" : ""}`
                : payment.membership
                  ? `Membership · ${payment.membership.membershipType.name} · ${payment.membership.membershipYear}`
                  : payment.hallReservation
                    ? `Hall reservation · ${payment.hallReservation.hall.name}`
                    : payment.priestRequest
                      ? `Priest service · ${payment.priestRequest.serviceRequested}`
                      : "Unlinked payment";

              return (
                <article className="admin-record" key={payment.id}>
                  <div>
                    <h3>{formatAmount(payment.amountMinor, payment.currency)} · {payment.status}</h3>
                    <p>{purpose} · {payment.method} · {payment.provider}</p>
                    <p>{payment.providerReference ? `Reference ${payment.providerReference} · ` : ""}{formatInTimeZone(payment.paymentDate ?? payment.createdAt, "America/New_York", "yyyy-MM-dd HH:mm")} Eastern</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}