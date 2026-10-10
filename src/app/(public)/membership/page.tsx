import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

const currentMembershipForm = "https://www.hindujaintemple.org/membership-donations/membership-form-and-payment/";

export const metadata: Metadata = {
  title: "Membership",
  description: "Explore Hindu-Jain Temple membership categories, benefits, and application information.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  return (
    <InfoPage
      eyebrow="Temple membership"
      title="Be part of the temple community"
      introduction="Membership supports the temple and connects members to worship, learning, and community life."
      actions={[{ label: "Current membership form", href: currentMembershipForm, external: true }]}
      blocks={[
        {
          heading: "Membership categories",
          paragraphs: ["The current temple membership information lists four categories. Amounts and eligibility details are confirmed through the membership form."],
          points: ["Membership", "Trustees", "Life Membership", "Life Trustees"],
        },
        {
          heading: "Current membership rules",
          paragraphs: [
            "The current membership rules state that applicants must be 18 or older. Annual dues are due January 1; the rules describe March 31 as the deadline for good-standing privileges.",
            "The current rules treat a member and spouse as one membership while recognizing individual voting rights. Please review the official form for the complete current rules.",
          ],
        },
        {
          heading: "Member benefits",
          points: [
            "Eligibility to hold office and vote at General Body Meetings, as described in the current rules.",
            "Vidya Mandir participation for children.",
            "Discounts on community hall and priest services, and priority for temple rentals and scheduling.",
          ],
        },
      ]}
    />
  );
}