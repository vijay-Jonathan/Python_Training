import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Leaf } from 'lucide-react';
import { SiteShell, Card, Button, RemoteImage, Input, Badge } from '../../src/ui';
import '../../src/index.css';

// Local illustration keeps visual regression checks independent of image hosts.
const art = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#c9d8d1"/><path d="M0 380L230 130 480 450 650 240 800 390V600H0Z" fill="#6c8e7b"/><path d="M0 480L300 340 550 520 800 370V600H0Z" fill="#31594d"/><circle cx="630" cy="110" r="55" fill="#f4e7bf"/></svg>`);
const preset = new URLSearchParams(location.search).get('preset') || 'editorial';
const names = ['Coastal hideaway', 'Mountain house', 'Garden residence'];
function Fixture() {
  return <SiteShell brand="Fieldwork" icon={Leaf} preset={preset} palette="teal"
    links={[{href:'#/stays',label:'Places to stay'},{href:'#/stories',label:'Field notes'},{href:'#/about',label:'Our approach'}]}
    cta={{href:'#/book',label:'Find your stay'}} footerNote="Considered places. A slower pace."
    footerColumns={[{label:'Explore',links:[{href:'#/stays',label:'All stays'},{href:'#/about',label:'Our story'}]}]}>
    <section className="band"><div className="container split split-even">
      <div className="stack-lg"><span className="label">A little closer to nature</span>
        <h1 className="hero-title">Room to breathe.<br/>Space to belong.</h1>
        <p className="muted">Thoughtful architecture, quiet corners, and a landscape worth slowing down for.</p>
        <div className="row-wrap"><Button tone="primary" shape="pill" iconRight={ArrowUpRight}>Explore the collection</Button><Button tone="ghost">Our approach</Button></div>
      </div><RemoteImage src={art} alt="Illustrated mountain landscape" ratio="4x3" />
    </div></section>
    <section className="band band-tint"><div className="container stack-lg">
      <div className="section-head"><h2 className="section-title">Find your kind of quiet</h2><Input aria-label="Search stays" placeholder="Search by destination" /></div>
      <div className="grid">{names.map((name,i)=><Card key={name} variant={(['minimal','elevated','overlay'] as const)[i]}
        title={name} media={<RemoteImage src={art} alt={name} ratio="4x3" />} interactive
        footer={<Button tone="outline">View stay</Button>}>
        <div className="stack"><Badge>Available</Badge><p className="muted">Two guests · Private garden · Breakfast included</p><strong>From $180 / night</strong></div>
      </Card>)}</div>
      <Card variant="glass" title="A note from the studio"><p>Glass is a supporting surface, used sparingly.</p><Button loading tone="primary">Saving preferences</Button></Card>
    </div></section>
  </SiteShell>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
