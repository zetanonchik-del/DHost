/* DHost live resource wave overlay */
(() => {
  const STYLE_ID = "dhost-resource-waves-style";
  const SVG_NS = "http://www.w3.org/2000/svg";

  function injectStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement("style"); s.id=STYLE_ID; s.textContent=`
      .meter-track{position:relative;overflow:hidden!important}
      .meter-track .meter-fill{position:relative;z-index:1;opacity:.72}
      .resource-wave{position:absolute;inset:50% 0 auto 0;width:100%;height:16px;transform:translateY(-50%);pointer-events:none;z-index:2;overflow:visible;opacity:.92}
      .resource-wave-track{position:absolute;left:0;top:0;height:100%;width:200%;display:block;animation:resourceWaveMove var(--wave-speed,3.8s) linear infinite;will-change:transform}
      .resource-wave-path{fill:none;stroke:var(--wave-color,var(--cyan));stroke-width:1.7;stroke-linecap:round;filter:drop-shadow(0 0 3px var(--wave-color,var(--cyan)))}
      @keyframes resourceWaveMove{to{transform:translateX(-50%)}}
      .summary-stat{position:relative}
      .summary-wave{position:absolute;left:10px;right:10px;bottom:8px;height:20px;overflow:hidden;opacity:.9;pointer-events:none}
      .summary-wave-track{width:200%;height:100%;animation:resourceWaveMove var(--wave-speed,4.5s) linear infinite}
      .summary-wave path{fill:none;stroke:currentColor;stroke-width:1.35;stroke-linecap:round;filter:drop-shadow(0 0 4px currentColor)}
      .status-wave,.status-dot{isolation:isolate}
      .status-wave:after,.status-dot:after{animation-delay:1s!important}
      .status-wave:before,.status-wave:after,.status-dot:before,.status-dot:after{border-width:1px!important}
      .status-wave{box-shadow:0 0 10px currentColor!important}
      .status-dot{box-shadow:0 0 8px currentColor!important}
      .bot-card .meter:first-child .meter-track{--wave-color:var(--wave-cpu,var(--cyan))}
      .bot-card .meter:nth-child(2) .meter-track{--wave-color:var(--wave-ram,var(--cyan))}
      @media (prefers-reduced-motion:reduce){.resource-wave-track,.summary-wave-track{animation:none}}
    `; document.head.appendChild(s);
  }

  function pctFromFill(fill){
    const w=fill?.style?.width || "0";
    const n=parseFloat(w); return Number.isFinite(n)?Math.max(0,Math.min(100,n)):0;
  }
  function colorFor(pct, type){
    if(type === "cpu") return pct >= 85 ? "var(--err)" : pct >= 65 ? "var(--warn)" : "var(--cyan)";
    return pct >= 90 ? "var(--err)" : pct >= 75 ? "var(--warn)" : "var(--cyan)";
  }
  function makePath(amplitude, phase=0){
    const pts=[];
    for(let x=0;x<=100;x+=2){
      const y=10 + Math.sin((x/100)*Math.PI*4 + phase)*amplitude + Math.sin((x/100)*Math.PI*8 + phase*.7)*(amplitude*.28);
      pts.push((x===0?"M":"L")+x.toFixed(1)+" "+y.toFixed(2));
    }
    return pts.join(" ");
  }
  function waveSVG(pct,type){
    const amp=1.2 + Math.min(pct,100)*0.055;
    const speed=(4.6 - Math.min(pct,100)*0.022).toFixed(2)+"s";
    const color=colorFor(pct,type);
    const svg=document.createElementNS(SVG_NS,"svg"); svg.setAttribute("class","resource-wave"); svg.setAttribute("viewBox","0 0 100 20"); svg.setAttribute("preserveAspectRatio","none");
    const track=document.createElementNS(SVG_NS,"g"); track.setAttribute("class","resource-wave-track"); track.style.setProperty("--wave-speed",speed);
    for(const offset of [0,100]){
      const p=document.createElementNS(SVG_NS,"path"); p.setAttribute("class","resource-wave-path"); p.setAttribute("d",makePath(amp,offset?Math.PI/2:0)); p.setAttribute("transform",`translate(${offset} 0)`); p.style.setProperty("--wave-color",color); track.appendChild(p);
    }
    svg.appendChild(track); return svg;
  }
  function addMeterWave(meter){
    const track=meter.querySelector(".meter-track"), fill=meter.querySelector(".meter-fill");
    if(!track || !fill) return;
    const pct=pctFromFill(fill); const type=meter.querySelector(".meter-label span")?.textContent?.toLowerCase().includes("cpu")?"cpu":"ram";
    track.style.setProperty("--wave-color",colorFor(pct,type));
    const old=track.querySelector(".resource-wave"); if(old) old.remove();
    track.appendChild(waveSVG(pct,type));
  }
  function addSummaryWave(card){
    if(card.querySelector(".summary-wave")) return;
    const wave=document.createElement("div"); wave.className="summary-wave"; wave.style.color=getComputedStyle(card).color;
    const svg=document.createElementNS(SVG_NS,"svg"); svg.setAttribute("class","summary-wave"); svg.setAttribute("viewBox","0 0 100 20"); svg.setAttribute("preserveAspectRatio","none");
    const track=document.createElementNS(SVG_NS,"g"); track.setAttribute("class","summary-wave-track");
    const count=parseFloat(card.querySelector(".summary-stat-value")?.textContent)||0; const amp=Math.min(5,1.5+count*.8); track.style.setProperty("--wave-speed",(4.8-Math.min(count,10)*.15).toFixed(2)+"s");
    for(const offset of [0,100]){const p=document.createElementNS(SVG_NS,"path");p.setAttribute("d",makePath(amp,offset?Math.PI/2:0));p.setAttribute("transform",`translate(${offset} 0)`);track.appendChild(p)}
    svg.appendChild(track); wave.appendChild(svg); card.appendChild(wave);
  }
  function apply(){
    document.querySelectorAll(".bot-card .meter").forEach(addMeterWave);
    document.querySelectorAll(".summary-stat").forEach(addSummaryWave);
  }
  let timer=0;
  const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,40)});
  function start(){injectStyle();apply();observer.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true}); else start();
})();
