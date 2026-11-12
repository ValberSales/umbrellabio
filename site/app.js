/**
 * UMBRELLA CORPORATION // BIO-ENERGY PRODUCTION 4Ps TELEMETRY ENGINE
 * Renders 9 animated SVG charts, scroll-driven reveals, interactive P6 simulator,
 * and ambient bio-hexagonal background canvas.
 */

document.addEventListener("DOMContentLoaded", () => {
  initBioCanvas();
  initScrollProgressAndSpy();
  renderAllCharts();
  initScrollRevealObservers();
  initP6Simulator();
  initFinancialTabs();
});

/* =========================================================================
   1. AMBIENT BIO-HEXAGONAL & PARTICLE CANVAS (Umbrella Red Queen Theme)
   ========================================================================= */
function initBioCanvas() {
  const canvas = document.getElementById("bioCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const nodes = Array.from({ length: 42 }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 2.2 + 1,
    type: i % 5 === 0 ? "emerald" : i % 3 === 0 ? "cyan" : "crimson",
  }));

  function drawHexagon(cx, cy, radius, strokeStyle) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle floating molecular hexagons
    const scrollOffset = window.scrollY * 0.12;
    drawHexagon(width * 0.15, ((height * 0.25 - scrollOffset) % height + height) % height, 48, "rgba(225, 17, 44, 0.08)");
    drawHexagon(width * 0.85, ((height * 0.65 - scrollOffset * 0.7) % height + height) % height, 64, "rgba(0, 229, 255, 0.06)");
    drawHexagon(width * 0.52, ((height * 0.82 - scrollOffset * 1.1) % height + height) % height, 38, "rgba(16, 185, 129, 0.07)");

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 155) {
          const alpha = (1 - dist / 155) * 0.14;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle =
            n.type === "crimson"
              ? `rgba(225, 17, 44, ${alpha})`
              : n.type === "emerald"
              ? `rgba(52, 211, 153, ${alpha})`
              : `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle =
        n.type === "crimson"
          ? "rgba(255, 42, 75, 0.55)"
          : n.type === "emerald"
          ? "rgba(52, 211, 153, 0.55)"
          : "rgba(0, 229, 255, 0.55)";
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* =========================================================================
   2. SCROLL PROGRESS LASER & STICKY NAVIGATION SPY
   ========================================================================= */
function initScrollProgressAndSpy() {
  const laserBar = document.getElementById("scrollLaserBar");
  const stickyNav = document.getElementById("stickyNav");
  const navAnchors = Array.from(document.querySelectorAll("#navLinks a"));
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function updateOnScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (laserBar) laserBar.style.width = `${pct.toFixed(2)}%`;

    if (stickyNav) {
      stickyNav.classList.toggle("scrolled", scrollTop > 40);
    }

    let currentIndex = 0;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 220) {
        currentIndex = idx;
      }
    });

    navAnchors.forEach((a, idx) => {
      a.classList.toggle("active", idx === currentIndex);
    });
  }

  window.addEventListener("scroll", updateOnScroll, { passive: true });
  updateOnScroll();
}

/* =========================================================================
   3. SCROLL-DRIVEN REVEAL & CHART ANIMATION TRIGGERS
   ========================================================================= */
function initScrollRevealObservers() {
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const chartPanels = document.querySelectorAll(".chart-panel");

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((el) => revealObs.observe(el));

  const chartObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.2 }
  );

  chartPanels.forEach((panel) => chartObs.observe(panel));
}

/* =========================================================================
   4. SVG CHART ENGINE (9 Custom Animated Charts)
   ========================================================================= */
function renderAllCharts() {
  renderChart01FinancialTrajectory();
  renderChart02PnD();
  renderChart03Productivity();
  renderChart04RawMaterials();
  renderChart05UnitEconomics();
  renderChart06OperationalProfit();
  renderChart07CapacityFlow();
  renderChart08RegionalP5();
  renderChart09PromotionHR();
}

/**
 * Chart 01: Evolução de Receita, Lucro Bruto, Lucro Líquido e Caixa (P1 a P5)
 */
function renderChart01FinancialTrajectory() {
  const host = document.getElementById("svgStageFinancial");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5"];
  const receita = [0.0, 0.0, 5.3, 21.82, 28.57];
  const lucroBruto = [0.0, 0.0, 3.49, 15.24, 20.88];
  const lucroLiquido = [-2.17, -2.79, 0.06, 12.46, 11.95];
  const caixa = [5.13, 1.44, 1.27, 10.5, 20.47];

  const W = 960;
  const H = 370;
  const zeroY = 285;
  const scaleY = 8.2; // 1 R$ mi = 8.2px

  let barsSvg = "";
  let caixaPoints = [];

  periods.forEach((p, i) => {
    const groupX = 120 + i * 170;

    // Bar 1: Receita
    const recH = Math.max(2, receita[i] * scaleY);
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 90}ms" x="${groupX - 38}" y="${zeroY - recH}" width="24" height="${recH}" rx="4" fill="#e1112c" />
      <text x="${groupX - 26}" y="${zeroY - recH - 8}" text-anchor="middle" fill="#fda4af" font-size="11" font-family="monospace">${receita[i].toFixed(2)}</text>
    `;

    // Bar 2: Lucro Bruto
    const lbH = Math.max(2, lucroBruto[i] * scaleY);
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 90 + 40}ms" x="${groupX - 10}" y="${zeroY - lbH}" width="24" height="${lbH}" rx="4" fill="#34d399" />
      <text x="${groupX + 2}" y="${zeroY - lbH - 8}" text-anchor="middle" fill="#6ee7b7" font-size="11" font-family="monospace">${lucroBruto[i].toFixed(2)}</text>
    `;

    // Bar 3: Lucro Líquido (can be negative)
    const llVal = lucroLiquido[i];
    const llH = Math.max(3, Math.abs(llVal) * scaleY);
    const llY = llVal >= 0 ? zeroY - llH : zeroY;
    const llLabelY = llVal >= 0 ? llY - 8 : llY + llH + 14;
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 90 + 80}ms" x="${groupX + 18}" y="${llY}" width="24" height="${llH}" rx="4" fill="${llVal >= 0 ? "#00e5ff" : "#fb7185"}" />
      <text x="${groupX + 30}" y="${llLabelY}" text-anchor="middle" fill="#7dd3fc" font-size="11" font-family="monospace">${llVal.toFixed(2)}</text>
    `;

    // Period label
    barsSvg += `
      <text x="${groupX}" y="${H - 18}" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="700" font-family="monospace">${p}</text>
    `;

    // Caixa Line Point
    const cx = groupX;
    const cy = zeroY - caixa[i] * scaleY;
    caixaPoints.push({ x: cx, y: cy, val: caixa[i] });
  });

  const linePath = caixaPoints.map((pt, idx) => `${idx === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const nodesSvg = caixaPoints
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5.5" fill="#f59e0b" stroke="#000" stroke-width="2" />
      <text x="${pt.x}" y="${pt.y - 12}" text-anchor="middle" fill="#fcd34d" font-size="11" font-weight="700" font-family="monospace">Caixa R$ ${pt.val.toFixed(2)}M</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução Financeira P1 a P5">
      <!-- Grid lines -->
      <line x1="50" y1="${zeroY - 25 * scaleY}" x2="${W - 30}" y2="${zeroY - 25 * scaleY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
      <text x="42" y="${zeroY - 25 * scaleY + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="monospace">25M</text>

      <line x1="50" y1="${zeroY - 15 * scaleY}" x2="${W - 30}" y2="${zeroY - 15 * scaleY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
      <text x="42" y="${zeroY - 15 * scaleY + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="monospace">15M</text>

      <line x1="50" y1="${zeroY - 5 * scaleY}" x2="${W - 30}" y2="${zeroY - 5 * scaleY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
      <text x="42" y="${zeroY - 5 * scaleY + 4}" text-anchor="end" fill="#64748b" font-size="10" font-family="monospace">5M</text>

      <line x1="50" y1="${zeroY}" x2="${W - 30}" y2="${zeroY}" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
      <text x="42" y="${zeroY + 4}" text-anchor="end" fill="#94a3b8" font-size="10" font-family="monospace">0</text>

      ${barsSvg}
      <path class="anim-line" d="${linePath}" fill="none" stroke="#f59e0b" stroke-width="3" />
      ${nodesSvg}
    </svg>
  `;
}

/**
 * Chart 02: P&D Anual vs Acumulado e Grau de Inovação (P1 a P5 + P6)
 */
function renderChart02PnD() {
  const host = document.getElementById("svgStagePnD");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5", "P6 (Prev)"];
  const anual = [1.35, 1.05, 1.5, 2.7, 0.9, 2.4];
  const acum = [1.35, 2.4, 3.9, 6.6, 7.5, 9.9];
  const grau = ["Grau 1", "Grau 1", "Grau 1", "GRAU 2", "GRAU 2", "Alvo G3"];

  const W = 580;
  const H = 290;
  const baseY = 240;
  const scaleY = 19;

  let svgContent = "";
  let linePts = [];

  periods.forEach((p, i) => {
    const x = 68 + i * 90;
    const barH = anual[i] * scaleY;
    svgContent += `
      <rect class="anim-bar" style="transition-delay:${i * 80}ms" x="${x - 18}" y="${baseY - barH}" width="36" height="${barH}" rx="5" fill="#e1112c" />
      <text x="${x}" y="${baseY - barH - 7}" text-anchor="middle" fill="#fda4af" font-size="10.5" font-family="monospace">R$ ${anual[i].toFixed(2)}M</text>
      <text x="${x}" y="${baseY + 18}" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="700" font-family="monospace">${p}</text>
      <text x="${x}" y="${baseY + 34}" text-anchor="middle" fill="${i >= 3 ? "#34d399" : "#94a3b8"}" font-size="9.5" font-weight="700" font-family="monospace">${grau[i]}</text>
    `;

    const cy = baseY - acum[i] * scaleY;
    linePts.push({ x, y: cy, val: acum[i] });
  });

  const pathD = linePts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = linePts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5" fill="#00e5ff" stroke="#000" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 10}" text-anchor="middle" fill="#00e5ff" font-size="10.5" font-weight="700" font-family="monospace">${pt.val.toFixed(2)}M</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Investimento em P&D Anual e Acumulado">
      <line x1="30" y1="${baseY}" x2="${W - 20}" y2="${baseY}" stroke="rgba(255,255,255,0.2)"/>
      <line x1="30" y1="${baseY - 6.6 * scaleY}" x2="${W - 20}" y2="${baseY - 6.6 * scaleY}" stroke="rgba(52,211,153,0.3)" stroke-dasharray="4 4"/>
      <text x="${W - 24}" y="${baseY - 6.6 * scaleY - 5}" text-anchor="end" fill="#34d399" font-size="9.5" font-family="monospace">Limiar Grau 2 (R$ 6,60M em P4)</text>
      ${svgContent}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#00e5ff" stroke-width="2.6"/>
      ${ptsSvg}
    </svg>
  `;
}

/**
 * Chart 03: Curva de Produtividade Total (%) vs Ganhos Marginais Decrescentes
 */
function renderChart03Productivity() {
  const host = document.getElementById("svgStageProductivity");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5"];
  const prod = [84.5, 87.0, 88.5, 89.75, 90.0];
  const marginal = [0.0, 2.5, 1.5, 1.25, 0.25];

  const W = 580;
  const H = 290;
  const baseY = 240;

  let barsSvg = "";
  let linePts = [];

  periods.forEach((p, i) => {
    const x = 80 + i * 105;
    // Marginal gain bar
    const mH = marginal[i] * 48;
    barsSvg += `
      <rect class="anim-bar" style="transition-delay:${i * 90}ms" x="${x - 18}" y="${baseY - mH}" width="36" height="${Math.max(2, mH)}" rx="4" fill="#f59e0b" />
      <text x="${x}" y="${baseY - mH - 7}" text-anchor="middle" fill="#fcd34d" font-size="10.5" font-family="monospace">+${marginal[i].toFixed(2)} pt</text>
      <text x="${x}" y="${baseY + 20}" text-anchor="middle" fill="#f8fafc" font-size="11.5" font-weight="700" font-family="monospace">${p}</text>
    `;

    // Productivity line mapped between 82% and 92%
    const py = baseY - (prod[i] - 82) * 22;
    linePts.push({ x, y: py, val: prod[i] });
  });

  const pathD = linePts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = linePts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5.5" fill="#34d399" stroke="#000" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 11}" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700" font-family="monospace">${pt.val.toFixed(2)}%</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Curva de Produtividade e Ganhos Marginais">
      <line x1="35" y1="${baseY}" x2="${W - 25}" y2="${baseY}" stroke="rgba(255,255,255,0.2)"/>
      ${barsSvg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#34d399" stroke-width="3"/>
      ${ptsSvg}
    </svg>
  `;
}

/**
 * Chart 04: Evolução do Custo Unitário de Matéria-Prima (Proporção 2:2:1) P1 a P5
 */
function renderChart04RawMaterials() {
  const host = document.getElementById("svgStageRawMaterials");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5"];
  const mp1UnitCost = [0.4, 0.4, 0.58, 0.6, 0.6]; // 2 x MP1
  const mp2UnitCost = [0.6, 0.6, 0.98, 1.12, 1.16]; // 2 x MP2
  const mp3UnitCost = [0.56, 0.59, 0.78, 0.99, 1.03]; // 1 x MP3
  const totalUnit = [1.56, 1.59, 2.34, 2.71, 2.79];

  const W = 920;
  const H = 310;
  const baseY = 255;
  const scaleY = 68;

  let svg = "";
  let linePts = [];

  periods.forEach((p, i) => {
    const gx = 125 + i * 165;
    const h1 = mp1UnitCost[i] * scaleY;
    const h2 = mp2UnitCost[i] * scaleY;
    const h3 = mp3UnitCost[i] * scaleY;

    svg += `
      <!-- 2x MP1 -->
      <rect class="anim-bar" style="transition-delay:${i * 80}ms" x="${gx - 42}" y="${baseY - h1}" width="24" height="${h1}" rx="3" fill="#e1112c"/>
      <text x="${gx - 30}" y="${baseY - h1 - 6}" text-anchor="middle" fill="#fda4af" font-size="10" font-family="monospace">R$${mp1UnitCost[i].toFixed(2)}</text>

      <!-- 2x MP2 -->
      <rect class="anim-bar" style="transition-delay:${i * 80 + 40}ms" x="${gx - 12}" y="${baseY - h2}" width="24" height="${h2}" rx="3" fill="#00e5ff"/>
      <text x="${gx}" y="${baseY - h2 - 6}" text-anchor="middle" fill="#7dd3fc" font-size="10" font-family="monospace">R$${mp2UnitCost[i].toFixed(2)}</text>

      <!-- 1x MP3 -->
      <rect class="anim-bar" style="transition-delay:${i * 80 + 80}ms" x="${gx + 18}" y="${baseY - h3}" width="24" height="${h3}" rx="3" fill="#f59e0b"/>
      <text x="${gx + 30}" y="${baseY - h3 - 6}" text-anchor="middle" fill="#fcd34d" font-size="10" font-family="monospace">R$${mp3UnitCost[i].toFixed(2)}</text>

      <text x="${gx}" y="${baseY + 22}" text-anchor="middle" fill="#f8fafc" font-size="12" font-weight="700" font-family="monospace">${p}</text>
    `;

    linePts.push({ x: gx, y: baseY - totalUnit[i] * scaleY, val: totalUnit[i] });
  });

  const pathD = linePts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = linePts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5.5" fill="#34d399" stroke="#000" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 11}" text-anchor="middle" fill="#34d399" font-size="11.5" font-weight="700" font-family="monospace">Total R$ ${pt.val.toFixed(2)}/un</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução dos Custos de Matéria-Prima 2:2:1">
      <line x1="45" y1="${baseY}" x2="${W - 30}" y2="${baseY}" stroke="rgba(255,255,255,0.22)"/>
      ${svg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#34d399" stroke-width="2.8"/>
      ${ptsSvg}
    </svg>
  `;
}

/**
 * Chart 05: Anatomia Unitária do Preço (P3, P4, P5): MP vs Custo Variável Comercial vs Lucro Bruto
 */
function renderChart05UnitEconomics() {
  const host = document.getElementById("svgStageUnitEconomics");
  if (!host) return;

  const periods = ["P3 (Preço R$ 11,90)", "P4 (Preço R$ 21,37)", "P5 (Preço R$ 26,76)"];
  const cmvMp = [2.34, 2.71, 2.79];
  const varCom = [1.73, 3.74, 4.42];
  const lucroBruto = [7.83, 14.92, 19.56];
  const margem = ["65,8%", "69,8%", "73,1%"];

  const W = 580;
  const H = 290;
  const baseY = 240;
  const scaleY = 7.2;

  let svg = "";
  periods.forEach((p, i) => {
    const gx = 110 + i * 180;
    const hMp = cmvMp[i] * scaleY;
    const hVar = varCom[i] * scaleY;
    const hLb = lucroBruto[i] * scaleY;

    svg += `
      <!-- MP -->
      <rect class="anim-bar" style="transition-delay:${i * 100}ms" x="${gx - 38}" y="${baseY - hMp}" width="22" height="${hMp}" rx="3" fill="#f59e0b"/>
      <text x="${gx - 27}" y="${baseY - hMp - 6}" text-anchor="middle" fill="#fcd34d" font-size="9.5" font-family="monospace">${cmvMp[i].toFixed(2)}</text>

      <!-- Custo Variável -->
      <rect class="anim-bar" style="transition-delay:${i * 100 + 50}ms" x="${gx - 11}" y="${baseY - hVar}" width="22" height="${hVar}" rx="3" fill="#e1112c"/>
      <text x="${gx}" y="${baseY - hVar - 6}" text-anchor="middle" fill="#fda4af" font-size="9.5" font-family="monospace">${varCom[i].toFixed(2)}</text>

      <!-- Lucro Bruto -->
      <rect class="anim-bar" style="transition-delay:${i * 100 + 100}ms" x="${gx + 16}" y="${baseY - hLb}" width="24" height="${hLb}" rx="3" fill="#34d399"/>
      <text x="${gx + 28}" y="${baseY - hLb - 8}" text-anchor="middle" fill="#34d399" font-size="10.5" font-weight="700" font-family="monospace">R$${lucroBruto[i].toFixed(2)}</text>

      <text x="${gx}" y="${baseY + 18}" text-anchor="middle" fill="#f8fafc" font-size="10.5" font-weight="700" font-family="monospace">${p}</text>
      <text x="${gx}" y="${baseY + 34}" text-anchor="middle" fill="#34d399" font-size="10" font-family="monospace">Margem Bruta: ${margem[i]}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Decomposição Unitária do Preço e CPV">
      <line x1="35" y1="${baseY}" x2="${W - 25}" y2="${baseY}" stroke="rgba(255,255,255,0.22)"/>
      ${svg}
    </svg>
  `;
}

/**
 * Chart 06: Qualidade do Lucro: Resultado Operacional Antes Bônus vs Bônus Governamental (P1 a P5)
 */
function renderChart06OperationalProfit() {
  const host = document.getElementById("svgStageOperationalProfit");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5"];
  const opPuro = [-2.17, -2.79, 0.07, 8.66, 14.06];
  const bonus = [0.0, 0.0, 6.0, 6.0, 0.0];
  const liq = [-2.17, -2.79, 0.06, 12.46, 11.95];

  const W = 580;
  const H = 290;
  const zeroY = 215;
  const scaleY = 11.2;

  let svg = "";
  let linePts = [];

  periods.forEach((p, i) => {
    const gx = 75 + i * 105;

    // Op Puro bar
    const opVal = opPuro[i];
    const opH = Math.max(3, Math.abs(opVal) * scaleY);
    const opY = opVal >= 0 ? zeroY - opH : zeroY;
    svg += `
      <rect class="anim-bar" style="transition-delay:${i * 80}ms" x="${gx - 22}" y="${opY}" width="20" height="${opH}" rx="3" fill="${opVal >= 0 ? "#34d399" : "#fb7185"}"/>
      <text x="${gx - 12}" y="${opVal >= 0 ? opY - 6 : opY + opH + 12}" text-anchor="middle" fill="#6ee7b7" font-size="9.5" font-family="monospace">${opVal.toFixed(2)}M</text>
    `;

    // Bonus bar
    if (bonus[i] > 0) {
      const bH = bonus[i] * scaleY;
      svg += `
        <rect class="anim-bar" style="transition-delay:${i * 80 + 40}ms" x="${gx + 2}" y="${zeroY - bH}" width="20" height="${bH}" rx="3" fill="#a855f7"/>
        <text x="${gx + 12}" y="${zeroY - bH - 6}" text-anchor="middle" fill="#d8b4fe" font-size="9.5" font-family="monospace">+${bonus[i].toFixed(1)}M</text>
      `;
    }

    svg += `<text x="${gx}" y="${H - 15}" text-anchor="middle" fill="#f8fafc" font-size="11.5" font-weight="700" font-family="monospace">${p}</text>`;

    linePts.push({ x: gx, y: zeroY - liq[i] * scaleY, val: liq[i] });
  });

  const pathD = linePts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = linePts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#00e5ff" stroke="#000" stroke-width="1.8"/>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Resultado Operacional Puro vs Bônus Governamental">
      <line x1="30" y1="${zeroY}" x2="${W - 20}" y2="${zeroY}" stroke="rgba(255,255,255,0.22)"/>
      ${svg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#00e5ff" stroke-width="2.4" stroke-dasharray="4 2"/>
      ${ptsSvg}
    </svg>
  `;
}

/**
 * Chart 07: Capacidade Operacional Ativa (900k P2-P5 -> 1,8M P6), Produção, Vendas e Estoque P.A.
 */
function renderChart07CapacityFlow() {
  const host = document.getElementById("svgStageCapacityFlow");
  if (!host) return;

  const periods = ["P1", "P2", "P3", "P4", "P5", "P6 (Plan)"];
  const capAtiva = [0, 900, 900, 900, 900, 1800]; // Regra P+1: 2º módulo comprado em P5 só entra em operação em P6!
  const prodReal = [0, 499.2, 796.5, 807.8, 810.0, 1800.0];
  const vendas = [0, 0, 445.3, 1020.8, 1067.5, 2079.8];
  const estoquePA = [0, 499.2, 850.3, 637.3, 379.8, 100.0];

  const W = 580;
  const H = 300;
  const baseY = 248;
  const scaleY = 0.098; // 2000k = 196px

  let svg = "";
  let stockPts = [];

  periods.forEach((p, i) => {
    const gx = 62 + i * 92;
    const hCap = capAtiva[i] * scaleY;
    const hProd = prodReal[i] * scaleY;
    const hVend = vendas[i] * scaleY;

    svg += `
      <!-- Capacidade Operacional Ativa -->
      <rect class="anim-bar" style="transition-delay:${i * 70}ms" x="${gx - 27}" y="${baseY - hCap}" width="16" height="${Math.max(2, hCap)}" rx="2" fill="#475569"/>
      <text x="${gx - 19}" y="${baseY - hCap - 5}" text-anchor="middle" fill="#94a3b8" font-size="8.5" font-family="monospace">${capAtiva[i]}k</text>

      <!-- Produção -->
      <rect class="anim-bar" style="transition-delay:${i * 70 + 35}ms" x="${gx - 8}" y="${baseY - hProd}" width="16" height="${Math.max(2, hProd)}" rx="2" fill="#00e5ff"/>
      <text x="${gx}" y="${baseY - hProd - 14}" text-anchor="middle" fill="#00e5ff" font-size="8.5" font-family="monospace">${Math.round(prodReal[i])}k</text>

      <!-- Vendas -->
      <rect class="anim-bar" style="transition-delay:${i * 70 + 70}ms" x="${gx + 11}" y="${baseY - hVend}" width="16" height="${Math.max(2, hVend)}" rx="2" fill="#e1112c"/>
      <text x="${gx + 19}" y="${baseY - hVend - 5}" text-anchor="middle" fill="#fda4af" font-size="8.5" font-family="monospace">${Math.round(vendas[i])}k</text>

      <text x="${gx}" y="${baseY + 20}" text-anchor="middle" fill="#f8fafc" font-size="10.5" font-weight="700" font-family="monospace">${p}</text>
    `;

    stockPts.push({ x: gx, y: baseY - estoquePA[i] * scaleY, val: estoquePA[i] });
  });

  const pathD = stockPts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = stockPts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#f59e0b" stroke="#000" stroke-width="1.8"/>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Capacidade Operacional, Produção, Vendas e Estoque">
      <line x1="25" y1="${baseY}" x2="${W - 15}" y2="${baseY}" stroke="rgba(255,255,255,0.22)"/>
      <line x1="25" y1="${baseY - 900 * scaleY}" x2="${W - 15}" y2="${baseY - 900 * scaleY}" stroke="rgba(0,229,255,0.25)" stroke-dasharray="4 4"/>
      <text x="${W - 18}" y="${baseY - 900 * scaleY - 5}" text-anchor="end" fill="#94a3b8" font-size="9" font-family="monospace">Teto Nominal 1 Módulo (900k un em P2–P5)</text>
      ${svg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#f59e0b" stroke-width="2.5"/>
      ${ptsSvg}
    </svg>
  `;
}

/**
 * Chart 08: Distribuição Regional em P5 (Vendas Planejadas vs Realizadas vs Perdidas)
 */
function renderChart08RegionalP5() {
  const host = document.getElementById("svgStageRegionalP5");
  if (!host) return;

  const regions = ["Região 1 (Inexplorada)", "Região 2 (13% vol)", "Região 3 (47% vol)", "Região 4 (39% vol)"];
  const realizado = [0, 143499, 505837, 418114];
  const perdida = [0, 56501, 31455, 381886];
  const conv = ["0%", "71,7%", "94,1%", "52,3%"];

  const W = 580;
  const H = 300;
  const baseY = 248;
  const scaleY = 0.00023; // 800,000 = 184px

  let svg = "";
  regions.forEach((r, i) => {
    const gx = 85 + i * 135;
    const hReal = realizado[i] * scaleY;
    const hPerd = perdida[i] * scaleY;

    svg += `
      <!-- Realizado -->
      <rect class="anim-bar" style="transition-delay:${i * 90}ms" x="${gx - 26}" y="${baseY - hReal}" width="24" height="${Math.max(2, hReal)}" rx="4" fill="#34d399"/>
      <text x="${gx - 14}" y="${baseY - hReal - 7}" text-anchor="middle" fill="#6ee7b7" font-size="9.5" font-family="monospace">${(realizado[i] / 1000).toFixed(0)}k</text>

      <!-- Perdida -->
      <rect class="anim-bar" style="transition-delay:${i * 90 + 45}ms" x="${gx + 2}" y="${baseY - hPerd}" width="24" height="${Math.max(2, hPerd)}" rx="4" fill="#e1112c"/>
      <text x="${gx + 14}" y="${baseY - hPerd - 7}" text-anchor="middle" fill="#fda4af" font-size="9.5" font-family="monospace">${(perdida[i] / 1000).toFixed(0)}k</text>

      <text x="${gx}" y="${baseY + 18}" text-anchor="middle" fill="#f8fafc" font-size="10" font-weight="700" font-family="monospace">${r.split(" ")[0]} ${r.split(" ")[1]}</text>
      <text x="${gx}" y="${baseY + 34}" text-anchor="middle" fill="${i === 2 ? "#34d399" : i === 3 ? "#fda4af" : "#94a3b8"}" font-size="9.5" font-family="monospace">Conv: ${conv[i]}</text>
    `;
  });

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Distribuição Regional P5">
      <line x1="30" y1="${baseY}" x2="${W - 20}" y2="${baseY}" stroke="rgba(255,255,255,0.22)"/>
      ${svg}
    </svg>
  `;
}

/**
 * Chart 09: Esforço Promocional, Capacitação Humana e Receita por Funcionário (P1 a P5)
 */
function renderChart09PromotionHR() {
  const host = document.getElementById("svgStagePromotionHR");
  if (!host) return;

  const periods = ["P1 (22 func)", "P2 (29 func)", "P3 (31 func)", "P4 (34 func)", "P5 (58 func)"];
  const pub = [0.0, 0.61, 0.5, 1.98, 2.44]; // R$ mi
  const rhEsg = [0.05, 0.3, 0.36, 0.73, 1.38]; // Treinamento + Benefícios + ESG (R$ mi)
  const recPorFunc = [0.0, 0.0, 1.71, 6.42, 4.93]; // em R$ 100 mil (ex: 6.42 = R$ 642 mil)

  const W = 920;
  const H = 300;
  const baseY = 248;
  const scaleBar = 68;
  const scaleLine = 30;

  let svg = "";
  let linePts = [];

  periods.forEach((p, i) => {
    const gx = 120 + i * 170;
    const hPub = pub[i] * scaleBar;
    const hRh = rhEsg[i] * scaleBar;

    svg += `
      <!-- Publicidade -->
      <rect class="anim-bar" style="transition-delay:${i * 80}ms" x="${gx - 28}" y="${baseY - hPub}" width="24" height="${Math.max(2, hPub)}" rx="4" fill="#f59e0b"/>
      <text x="${gx - 16}" y="${baseY - hPub - 7}" text-anchor="middle" fill="#fcd34d" font-size="10" font-family="monospace">R$${pub[i].toFixed(2)}M</text>

      <!-- Treinamento + Benefícios + ESG -->
      <rect class="anim-bar" style="transition-delay:${i * 80 + 40}ms" x="${gx + 4}" y="${baseY - hRh}" width="24" height="${Math.max(2, hRh)}" rx="4" fill="#00e5ff"/>
      <text x="${gx + 16}" y="${baseY - hRh - 7}" text-anchor="middle" fill="#7dd3fc" font-size="10" font-family="monospace">R$${rhEsg[i].toFixed(2)}M</text>

      <text x="${gx}" y="${baseY + 22}" text-anchor="middle" fill="#f8fafc" font-size="11.5" font-weight="700" font-family="monospace">${p}</text>
    `;

    linePts.push({ x: gx, y: baseY - recPorFunc[i] * scaleLine, val: Math.round(recPorFunc[i] * 100) });
  });

  const pathD = linePts.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x},${pt.y}`).join(" ");
  const ptsSvg = linePts
    .map(
      (pt) => `
      <circle class="anim-node" cx="${pt.x}" cy="${pt.y}" r="5.5" fill="#34d399" stroke="#000" stroke-width="2"/>
      <text x="${pt.x}" y="${pt.y - 12}" text-anchor="middle" fill="#34d399" font-size="11" font-weight="700" font-family="monospace">R$ ${pt.val} mil/func</text>
    `
    )
    .join("");

  host.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Investimento Promocional, Pessoas e Receita por Funcionário">
      <line x1="45" y1="${baseY}" x2="${W - 30}" y2="${baseY}" stroke="rgba(255,255,255,0.22)"/>
      ${svg}
      <path class="anim-line" d="${pathD}" fill="none" stroke="#34d399" stroke-width="2.8"/>
      ${ptsSvg}
    </svg>
  `;
}

/* =========================================================================
   5. INTERACTIVE PERIOD 6 RED QUEEN PRODUCTION & COST SIMULATOR
   ========================================================================= */
function initP6Simulator() {
  const slSales = document.getElementById("simSales");
  const slSafety = document.getElementById("simSafetyStock");
  const slProd = document.getElementById("simProductivity");
  const slPrice = document.getElementById("simPrice");

  const valSales = document.getElementById("valSimSales");
  const valSafety = document.getElementById("valSimSafetyStock");
  const valProd = document.getElementById("valSimProductivity");
  const valPrice = document.getElementById("valSimPrice");

  const outReqProd = document.getElementById("outReqProd");
  const outCapCheck = document.getElementById("outCapCheck");
  const outFixedUnit = document.getElementById("outFixedUnit");
  const outFixedCompare = document.getElementById("outFixedCompare");
  const outMpConsumption = document.getElementById("outMpConsumption");
  const outMpStatus = document.getElementById("outMpStatus");
  const outRevProfit = document.getElementById("outRevProfit");
  const outGrossMargin = document.getElementById("outGrossMargin");

  const presetDoc = document.getElementById("presetDoc");
  const presetScale = document.getElementById("presetScale");
  const presetOggP6 = document.getElementById("presetOggP6");

  const INITIAL_PA_STOCK = 379842; // Estoque final P5
  const NOMINAL_CAP_P6 = 1800000; // 2 módulos operacionais ativos em P6
  const FIXED_COST_P6 = 1500000; // R$ 1,50 milhão para 2 usinas
  const MP1_STOCK_P5 = 4171500;
  const MP2_STOCK_P5 = 4001500;
  const MP3_STOCK_P5 = 2085750;

  function formatInt(n) {
    return Math.round(n).toLocaleString("pt-BR");
  }

  function recalculate() {
    const sales = Number(slSales.value);
    const safety = Number(slSafety.value);
    const prodPct = Number(slProd.value);
    const price = Number(slPrice.value);

    valSales.textContent = `${formatInt(sales)} un`;
    valSafety.textContent = `${formatInt(safety)} un`;
    valProd.textContent = `${prodPct.toFixed(1).replace(".", ",")}%`;
    valPrice.textContent = `R$ ${price.toFixed(2).replace(".", ",")}`;

    // Fórmula do documento: Produção = Venda Esperada + Estoque de Segurança - Estoque Atual (379.842)
    const maxRealCapacity = Math.round(NOMINAL_CAP_P6 * (prodPct / 100));
    const rawRequiredProd = Math.max(0, sales + safety - INITIAL_PA_STOCK);
    const effectiveProd = Math.min(rawRequiredProd, maxRealCapacity);

    outReqProd.textContent = `${formatInt(effectiveProd)} un`;
    const occNominal = (effectiveProd / NOMINAL_CAP_P6) * 100;

    if (rawRequiredProd > maxRealCapacity) {
      outCapCheck.textContent = `Limitado pelo teto real (${formatInt(maxRealCapacity)} un @ ${prodPct.toFixed(1)}%)`;
      outCapCheck.style.color = "#fcd34d";
    } else {
      outCapCheck.textContent = `Ocupação de ${occNominal.toFixed(1).replace(".", ",")}% da cap. nominal de 1,80M un`;
      outCapCheck.style.color = "#94a3b8";
    }

    // Custo fixo unitário diluído
    const fixedPerUnit = effectiveProd > 0 ? FIXED_COST_P6 / effectiveProd : 0;
    outFixedUnit.textContent = `R$ ${fixedPerUnit.toFixed(2).replace(".", ",")} / un`;
    if (fixedPerUnit <= 1.0) {
      outFixedCompare.textContent = `Diluído com sucesso! (Retorna ao patamar de R$ 0,93/un de P4)`;
      outFixedCompare.style.color = "#34d399";
    } else {
      outFixedCompare.textContent = `Em P5 foi R$ 1,85/un (aumente produção p/ aproximar de R$ 0,93/un)`;
      outFixedCompare.style.color = "#fcd34d";
    }

    // Consumo de MP (2:2:1)
    const reqMp1 = effectiveProd * 2;
    const reqMp2 = effectiveProd * 2;
    const reqMp3 = effectiveProd * 1;
    outMpConsumption.textContent = `${(reqMp1 / 1e6).toFixed(2).replace(".", ",")}M / ${(reqMp2 / 1e6).toFixed(2).replace(".", ",")}M / ${(reqMp3 / 1e6).toFixed(2).replace(".", ",")}M`;

    if (reqMp1 <= MP1_STOCK_P5 && reqMp2 <= MP2_STOCK_P5 && reqMp3 <= MP3_STOCK_P5) {
      outMpStatus.textContent = `100% coberto pelo estoque inicial do P6 (sobra ${( (MP1_STOCK_P5 - reqMp1) / 1e6 ).toFixed(2).replace(".", ",")}M MP1)`;
      outMpStatus.style.color = "#34d399";
    } else {
      outMpStatus.textContent = `Atenção: Excede o estoque inicial disponível!`;
      outMpStatus.style.color = "#fda4af";
    }

    // Receita e Lucro Bruto estimado (MP ~R$ 2,79/un + Imposto 12,5% + Comissão 5% = 17,5% da receita)
    const actualSold = Math.min(sales, effectiveProd + INITIAL_PA_STOCK);
    const revenue = actualSold * price;
    const cpvTotal = actualSold * 2.79 + revenue * 0.175;
    const grossProfit = revenue - cpvTotal;
    const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    outRevProfit.textContent = `R$ ${(revenue / 1e6).toFixed(2).replace(".", ",")} mi`;
    outGrossMargin.textContent = `Lucro Bruto: R$ ${(grossProfit / 1e6).toFixed(2).replace(".", ",")} mi (Margem Bruta ${grossMarginPct.toFixed(1).replace(".", ",")}%)`;
  }

  [slSales, slSafety, slProd, slPrice].forEach((el) => {
    if (el) el.addEventListener("input", recalculate);
  });

  function setActivePreset(btn) {
    [presetDoc, presetScale, presetOggP6].forEach((b) => b && b.classList.remove("active"));
    if (btn) btn.classList.add("active");
  }

  if (presetDoc) {
    presetDoc.addEventListener("click", () => {
      setActivePreset(presetDoc);
      slSales.value = 1100000;
      slSafety.value = 350000;
      slProd.value = 90.5;
      slPrice.value = 28.5;
      recalculate();
    });
  }

  if (presetScale) {
    presetScale.addEventListener("click", () => {
      setActivePreset(presetScale);
      slSales.value = 1650000;
      slSafety.value = 350000;
      slProd.value = 90.5;
      slPrice.value = 28.0;
      recalculate();
    });
  }

  if (presetOggP6) {
    presetOggP6.addEventListener("click", () => {
      setActivePreset(presetOggP6);
      slSales.value = 2000000;
      slSafety.value = 200000;
      slProd.value = 91.5;
      slPrice.value = 29.5;
      recalculate();
    });
  }

  recalculate();
}

/* =========================================================================
   6. SEGMENTED FINANCIAL STATEMENT TABS
   ========================================================================= */
function initFinancialTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-tab");
      tabBtns.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      tabPanes.forEach((pane) => {
        pane.classList.toggle("active", pane.id === targetId);
      });
    });
  });
}
