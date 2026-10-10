import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import "./public.css";
import "./content.css";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
}