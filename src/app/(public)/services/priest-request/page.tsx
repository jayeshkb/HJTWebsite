import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Priest Service Request",
  description: "Contact the Hindu-Jain Temple to coordinate a priest service request.",
  alternates: { canonical: "/services/priest-request" },
};

export default function PriestRequestPage() {
  return (
    <InfoPage
      eyebrow="Priest services"
      title="Request a priest service"
      introduction="The temple coordinates priest services for worship and family occasions. Please contact the temple office to discuss your request."
      actions={[
        { label: "Call the temple office", href: "tel:+17243252073" },
        { label: "Email the temple office", href: "mailto:office@hindujaintemple.org", secondary: true },
      ]}
      blocks={[
        {
          heading: "Availability is coordinated by the temple",
          paragraphs: [
            "Submitting a request does not confirm priest availability. The temple will contact you to coordinate and confirm the service.",
            "Please include the service requested, preferred date and time, and whether the service is at the temple or another location when contacting the office.",
          ],
        },
        {
          heading: "Service details",
          paragraphs: ["Service options, travel arrangements, and applicable charges can change. The temple office will confirm current details with you."],
        },
      ]}
    />
  );
}