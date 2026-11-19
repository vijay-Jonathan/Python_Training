import { Card, PageHeader, SiteShell } from "../ui";

/**
 * The worked example of a marketing page — the shape About / Services /
 * Pricing / Contact pages all take:
 *
 * - framed by <SiteShell>, which carries the shared header and footer the
 *   whole public site wears,
 * - opened by a <PageHeader>, composed below from the same kit the
 *   application uses — a page that reads as the same product, not a
 *   different website,
 * - content in .container, bands where the page is long enough to earn them.
 *
 * Keep this page as one of the marketing pages; replace its content.
 */
export function AboutPage() {
  return (
    <SiteShell
      brand="Generated Application"
      links={[
        { href: "#/about", label: "About" },
        { href: "#/app", label: "Open app" },
      ]}
      cta={{ href: "#/app", label: "Get started" }}
      footerColumns={[
        {
          label: "Product",
          links: [
            { href: "#/about", label: "About" },
            { href: "#/app", label: "Application" },
          ],
        },
      ]}
    >
      <div className="container stack-lg">
        <PageHeader title="About" subtitle="What this application is for." />
        <Card>
          <p className="muted">
            The public pages tell the story; the product itself lives under
            #/app behind its own shell.
          </p>
        </Card>
      </div>
    </SiteShell>
  );
}
