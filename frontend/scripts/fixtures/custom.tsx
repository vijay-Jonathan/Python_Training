// Browser-only regression fixture: original composition without preset shells.
import React from "react";
import { createRoot } from "react-dom/client";
import "../../src/styles/foundation.css";
import "./custom.css";

const dashboard = new URLSearchParams(location.search).get("view") === "dashboard";
function App() {
  const [selected, setSelected] = React.useState("All");
  return dashboard ? <main className="operations">
    <aside><strong>FIELD / OPERATIONS</strong><nav><a href="#overview">Overview</a><a href="#work">Work queue</a><a href="#team">Team</a></nav></aside>
    <section id="overview"><header><p>MONDAY, NOVEMBER 9</p><h1>A clear view of today.</h1><button onClick={() => setSelected("Created")}>New task</button></header>
      <div className="metrics"><article><span>Open requests</span><strong>24</strong></article><article><span>Completed today</span><strong>18</strong></article><article><span>Response time</span><strong>2.4h</strong></article></div>
      <h2 id="work">Work queue</h2><div className="queue">{["Prepare weekly dispatch", "Review new enquiries", "Confirm delivery routes"].map((title, i) => <article key={title}><span>0{i + 1}</span><strong>{title}</strong><span>{selected === "Created" ? "Updated" : "In progress"}</span></article>)}</div>
    </section>
  </main> : <main className="storefront">
    <nav><strong>FIELD & TABLE</strong><div><a href="#harvest">This week's harvest</a><a href="#story">Our story</a></div><button onClick={() => setSelected("Basket")}>Basket · 0</button></nav>
    <section className="harvest-hero"><div><p>GOOD FOOD. CLOSER TO HOME.</p><h1>A little closer<br />to the source.</h1><p>Seasonal goods from independent growers.<br />Picked with care, ready for your table.</p><a className="harvest-cta" href="#harvest">Explore the harvest ↗</a></div><div className="harvest-art" role="img" aria-label="Abstract study of an egg in warm natural tones"><div className="egg" /><span>FRESH / LOCAL / SEASONAL</span></div></section>
    <section id="harvest"><header><p>THE WEEKLY SELECTION</p><h2>Simple things, done well.</h2></header><div className="filter">{["All", "Pantry", "Fresh"].map(label => <button key={label} aria-pressed={selected === label} onClick={() => setSelected(label)}>{label}</button>)}</div><div className="products">{["Pasture-raised eggs", "The seasonal box", "Small-batch pantry"].map((name, i) => <article key={name}><span>0{i + 1} / THIS WEEK</span><h3>{name}</h3><p>Good ingredients, thoughtfully sourced.</p><a href="#story">Discover more ↗</a></article>)}</div></section>
    <footer id="story">From our growers to your table. A browser regression fixture.</footer>
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
