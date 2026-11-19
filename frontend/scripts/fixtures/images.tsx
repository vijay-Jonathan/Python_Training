import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";
import { Button, Card, Landing, RemoteImage, SiteShell, photo } from "../../src/ui";

function Images() {
  const [src, setSrc] = useState("data:image/png;base64,broken");
  return <SiteShell brand="Image checks"><div className="content container stack">
    <h1>Collection imagery</h1><div className="grid">
      <Card title="Local abstract fallback"><RemoteImage src={photo("sample")} alt="Illustrative artwork" /></Card>
      <Card title="Unavailable item"><RemoteImage src={null} alt="Hand-thrown stoneware bowl" /></Card>
      <Card title="Updated source"><RemoteImage id="recovery" src={src} alt="Replaced image" /><Button id="recover" onClick={() => setSrc(photo("replacement"))}>Replace image</Button></Card>
    </div><div id="clipped-note-container" style={{height: 80, overflow: "hidden"}}>
      <div style={{height: 80}} />
      <p id="clipped-note">Representative vehicle image — not actual inventory vehicle</p>
    </div><p id="visible-note">Representative image — not the actual item</p>
    <Landing title="No subject supplied" layout="split" /></div></SiteShell>;
}
createRoot(document.getElementById("root")!).render(<Images />);
