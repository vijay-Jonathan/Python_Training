import React from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";
import { AppShell, SiteShell, Landing, PageHeader, Card, Stat, Button, Input, Select, DataTable } from "../../src/ui";
import type { Preset } from "../../src/ui/design";
import { setTheme } from "../../src/ui/useTheme";

const params = new URLSearchParams(location.search);
const preset = (params.get("preset") || "default") as Preset;
const view = params.get("view") || "workspace";
setTheme(params.get("theme") === "dark" ? "dark" : "light");
const links = ["Overview", "Collections", "Reservations", "Settings"].map(label => ({ href: `#/${label}`, label }));
const rows = [{ id: 1, name: "Editorial consultation", status: "Confirmed", total: "$1,280.00" }, { id: 2, name: "Studio session", status: "Pending", total: "$240.00" }];
const cards = ["A thoughtful starting point", "A shorter title", "Details that stay aligned"].map((title, i) => (
  <Card key={title} title={title} interactive tabIndex={0} footer={<Button tone="outline">View details</Button>}>
    <p>{i === 0 ? "Explore a carefully composed collection with enough context to make your next decision. Content can vary in length without pushing actions out of alignment." : "A concise description of this collection."}</p>
  </Card>
));
const content = <div className="container stack-lg">
  <PageHeader eyebrow="Studio workspace" title="Good work starts with a clear overview" subtitle="Plan your next project, review recent activity, and keep the details in focus." actions={<Button>New reservation</Button>} />
  <div className="stat-grid"><Stat label="Revenue this month" value="$12,480" delta="From 24 reservations" /><Stat label="Upcoming sessions" value="24" /><Stat label="Available spaces" value="08" /></div>
  <section className="stack"><h2 className="section-title">Featured collections</h2><div className="grid grid-featured" data-test="featured">{cards}</div></section>
  <div className="split split-even" data-test="split">
    <Card title="Recent reservations"><DataTable rows={rows} rowKey="id" columns={[{ key: "name", header: "Service" }, { key: "status", header: "Status" }, { key: "total", header: "Total" }]} /></Card>
    <form className="form-card" onSubmit={event => event.preventDefault()}><div className="form-section"><h2 className="section-title">Reserve a session</h2><div className="grid-2" data-test="form-grid"><Input label="Full name" placeholder="Alex Morgan" /><Input label="Email address" placeholder="alex@example.com" /></div><Select label="Session type"><option>Editorial consultation</option></Select></div><div className="form-section"><Button type="submit">Confirm reservation</Button></div></form>
  </div>
</div>;
const image = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#91aaa6"/><circle cx="550" cy="260" r="180" fill="#c5d4bd"/><path d="M0 600V400L400 100L700 600" fill="#395958"/></svg>');
createRoot(document.getElementById("root")!).render(
  view === "landing" ? <Landing brand="Fieldwork Studio" preset={preset} layout={params.get("layout") || "split"} image={image} title="Space for your next great idea" subtitle="Thoughtful spaces and focused sessions for creative work." actions={<><Button>Explore spaces</Button><Button tone="outline">Our approach</Button></>}><div className="band">{content}</div></Landing> :
  view === "site" ? <SiteShell brand="Fieldwork Studio" preset={preset} layout={params.get("layout") || "classic"} links={links} cta={{href: "#/book", label: "Book a session"}}><div className="band">{content}</div></SiteShell> :
  <AppShell brand="Fieldwork Studio" preset={preset} layout={params.get("layout") || "topnav"} palette="teal" nav={links.map((link, i) => ({id: String(i), label: link.label}))} active="0" title="Overview">{content}</AppShell>
);
