import { IInputs, IOutputs } from "./generated/ManifestTypes";

/* ═══════════════════════════════════════════════════════════════
   Shared constants & utilities
   ═══════════════════════════════════════════════════════════════ */

const POLL_PRESENCE_MS = 5000;
const POLL_QUEUE_MS = 10000;

const COLORS: Record<string, string> = {
  available: "#92c353",
  busy: "#c4314b",
  "busy - dnd": "#c4314b",
  "do not disturb": "#c4314b",
  away: "#fcd116",
  "appear away": "#fcd116",
  offline: "#8c8c8c",
  inactive: "#8c8c8c",
  "busy - after conversation work": "#e3008c",
  "after conversation work": "#e3008c",
  "dnd-initiating outbound call": "#c4314b",
  "voice consult dnd": "#c4314b",
  "do not disturb - after conversation work": "#e3008c",
};

function color(name: string): string {
  const l = (name || "").toLowerCase();
  for (const k of Object.keys(COLORS)) {
    if (l.indexOf(k) > -1) return COLORS[k];
  }
  return "#8c8c8c";
}

/** Return inner-HTML icon for a presence status — matches D365 system icons. */
function statusIcon(name: string, sz: "lg" | "sm" = "lg"): string {
  const l = (name || "").toLowerCase();
  // DND / Do Not Disturb → white minus bar
  if (l.indexOf("do not disturb") > -1 || l.indexOf("dnd") > -1)
    return sz === "lg" ? '<span class="dot-minus"></span>' : '<span class="dot-minus-sm"></span>';
  // Available → white checkmark
  if (l.indexOf("available") > -1)
    return sz === "lg"
      ? '<svg class="dot-icon" viewBox="0 0 12 12"><polyline points="2.5,6.5 5,9 9.5,3.5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg class="dot-icon-sm" viewBox="0 0 12 12"><polyline points="3,6.5 5,8.5 9,3.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  // Away / Appear Away → white clock
  if (l.indexOf("away") > -1)
    return sz === "lg"
      ? '<svg class="dot-icon" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.5" fill="none" stroke="#fff" stroke-width="1.3"/><line x1="6" y1="4" x2="6" y2="6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><line x1="6" y1="6" x2="7.8" y2="6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>'
      : '<svg class="dot-icon-sm" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#fff" stroke-width="1.8"/><line x1="6" y1="4.2" x2="6" y2="6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><line x1="6" y1="6" x2="7.6" y2="6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>';
  // Offline / Inactive → diagonal slash (the dot itself is the circle)
  if (l.indexOf("offline") > -1 || l.indexOf("inactive") > -1)
    return sz === "lg"
      ? '<svg class="dot-icon" viewBox="0 0 12 12"><line x1="3" y1="9" x2="9" y2="3" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>'
      : '<svg class="dot-icon-sm" viewBox="0 0 12 12"><line x1="3" y1="9" x2="9" y2="3" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>';
  // Busy / After Conversation Work → solid, no inner icon
  return "";
}

function esc(s: string): string {
  const t = document.createElement("span");
  t.textContent = s;
  return t.innerHTML;
}

function fmtShort(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s % 60}s`;
}

interface WebApiLike {
  retrieveMultipleRecords: (
    entity: string,
    query: string,
    maxPageSize?: number
  ) => Promise<ComponentFramework.WebApi.RetrieveMultipleResponse>;
}

function getWebApi(ctx: ComponentFramework.Context<IInputs>): WebApiLike {
  if (ctx.webAPI) return ctx.webAPI;
  const xrm = (window as unknown as Record<string, unknown>)["Xrm"] as
    { WebApi?: WebApiLike } | undefined;
  if (xrm?.WebApi) return xrm.WebApi;
  throw new Error("WebAPI not available");
}

function getUserId(ctx: ComponentFramework.Context<IInputs>): string {
  const c = ctx as ComponentFramework.Context<IInputs> & { userSettings?: { userId?: string } };
  const uid = c.userSettings?.userId;
  if (uid) return uid.replace(/[{}]/g, "").toLowerCase();
  const xrm = (window as unknown as Record<string, unknown>)["Xrm"] as
    { Utility?: { getGlobalContext?: () => { userSettings?: { userId?: string } } } } | undefined;
  const xrmUid = xrm?.Utility?.getGlobalContext?.()?.userSettings?.userId;
  if (xrmUid) return xrmUid.replace(/[{}]/g, "").toLowerCase();
  throw new Error("Cannot determine user ID");
}

function getClientUrl(): string {
  const xrm = (window as unknown as Record<string, unknown>)["Xrm"] as
    { Utility?: { getGlobalContext?: () => { getClientUrl?: () => string } } } | undefined;
  const url = xrm?.Utility?.getGlobalContext?.()?.getClientUrl?.();
  if (url) return url;
  return window.location.origin;
}

async function loadPresenceMap(api: WebApiLike): Promise<Record<string, string>> {
  const resp = await api.retrieveMultipleRecords(
    "msdyn_presence",
    "?$select=msdyn_presenceid,msdyn_presencestatustext"
  );
  const pmap: Record<string, string> = {};
  for (const e of resp.entities) {
    pmap[e.msdyn_presenceid as string] = e.msdyn_presencestatustext as string;
  }
  return pmap;
}

function pName(id: string | null, pmap: Record<string, string>): string {
  if (!id) return "Unknown";
  return pmap[id] || "Unknown";
}

interface SharedServices {
  userId: string;
  pmap: Record<string, string>;
  api: WebApiLike;
}

/* ═══════════════════════════════════════════════════════════════
   Presence Timer utilities
   ═══════════════════════════════════════════════════════════════ */

function fmtClock(ms: number): string {
  let s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  s = s % 60;
  return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function fmtTimeRange(startIso: string, endIso: string | null): string {
  return fmtTime(startIso) + (endIso ? ` \u2013 ${fmtTime(endIso)}` : " \u2013 now");
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

/* ═══════════════════════════════════════════════════════════════
   Queue Hub utilities
   ═══════════════════════════════════════════════════════════════ */

function getInitials(name: string): string {
  const parts = (name || "?").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

interface QueueInfo { id: string; name: string; }
interface AgentInfo { id: string; name: string; presenceId: string | null; presenceName: string; since: string | null; }
interface AgentWithQueues extends AgentInfo { queues: QueueInfo[]; }

function statusOrder(a: AgentInfo): number {
  const l = a.presenceName.toLowerCase();
  if (l.indexOf("available") > -1) return 0;
  if (l.indexOf("busy") > -1) return 1;
  if (l.indexOf("do not disturb") > -1) return 2;
  if (l.indexOf("away") > -1 || l.indexOf("appear away") > -1) return 3;
  if (l.indexOf("offline") > -1 || l.indexOf("inactive") > -1) return 5;
  return 4;
}

const LOADING_HTML = `<div class="qh-loading"><span class="qh-loading-dot"></span><span class="qh-loading-dot" style="animation-delay:.2s"></span><span class="qh-loading-dot" style="animation-delay:.4s"></span></div>`;

/* ═══════════════════════════════════════════════════════════════
   Presence Timer Panel
   ═══════════════════════════════════════════════════════════════ */

class PresenceTimerPanel {
  private _c: HTMLDivElement;
  private _s: SharedServices;

  private _curId: string | null = null;
  private _start: number | null = null;
  private _selectedDate: Date = new Date();
  private _tickTimer: number | null = null;
  private _pollTimer: number | null = null;
  private _calViewDate: Date = new Date();
  private _calOpen = false;
  private _onDocClick: ((e: MouseEvent) => void) | null = null;

  private _elDot!: HTMLDivElement;
  private _elName!: HTMLSpanElement;
  private _elClock!: HTMLDivElement;
  private _elErr!: HTMLDivElement;
  private _elTL!: HTMLDivElement;
  private _elSum!: HTMLDivElement;
  private _elDpLbl!: HTMLSpanElement;
  private _elPrev!: HTMLButtonElement;
  private _elNext!: HTMLButtonElement;
  private _elToday!: HTMLButtonElement;
  private _elCalBtn!: HTMLButtonElement;
  private _elCalOverlay!: HTMLDivElement;

  constructor(container: HTMLDivElement, services: SharedServices) {
    this._c = container;
    this._s = services;
  }

  public init(): void {
    this._c.classList.add("presence-timer");
    this._buildUI();
    this._initialize();
  }

  public destroy(): void {
    if (this._tickTimer !== null) clearInterval(this._tickTimer);
    if (this._pollTimer !== null) clearInterval(this._pollTimer);
    if (this._onDocClick) document.removeEventListener("click", this._onDocClick);
  }

  private _buildUI(): void {
    this._c.innerHTML = `
      <div class="card">
        <div class="pill">
          <div class="dot" data-ref="dot"></div>
          <span class="name" data-ref="sName">Loading\u2026</span>
        </div>
        <div class="time" data-ref="clock">00:00:00</div>
        <div class="lbl">time in status</div>
        <div class="err" data-ref="err"></div>
      </div>
      <div class="dp-section">
        <div class="dp-wrap">
          <button class="dp-btn" data-ref="prevDay">\u2039</button>
          <span class="dp-label" data-ref="dpLabel">Today</span>
          <button class="dp-btn" data-ref="nextDay">\u203A</button>
          <button class="dp-cal-btn" data-ref="calBtn" title="Pick a date"><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M7 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm2-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm2-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 5.5A2.5 2.5 0 0 0 14.5 3h-9A2.5 2.5 0 0 0 3 5.5v9A2.5 2.5 0 0 0 5.5 17h9a2.5 2.5 0 0 0 2.5-2.5v-9zM4 7h12v7.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 14.5V7zm1.5-3h9A1.5 1.5 0 0 1 16 5.5V6H4v-.5A1.5 1.5 0 0 1 5.5 4z"/></svg></button>
          <button class="dp-today" data-ref="todayBtn">Today</button>
        </div>
        <div class="cal-overlay" data-ref="calOverlay" style="display:none"></div>
      </div>
      <div class="summary" data-ref="summary"></div>
      <div class="hist">
        <div class="hist-title-row"><span class="hist-title">Timeline</span><button class="hist-refresh" data-ref="refreshBtn" title="Refresh">↻</button></div>
        <div data-ref="timeline"></div>
      </div>`;

    this._elDot = this._ref("dot") as HTMLDivElement;
    this._elName = this._ref("sName") as HTMLSpanElement;
    this._elClock = this._ref("clock") as HTMLDivElement;
    this._elErr = this._ref("err") as HTMLDivElement;
    this._elTL = this._ref("timeline") as HTMLDivElement;
    this._elSum = this._ref("summary") as HTMLDivElement;
    this._elDpLbl = this._ref("dpLabel") as HTMLSpanElement;
    this._elPrev = this._ref("prevDay") as HTMLButtonElement;
    this._elNext = this._ref("nextDay") as HTMLButtonElement;
    this._elToday = this._ref("todayBtn") as HTMLButtonElement;
    this._elCalBtn = this._ref("calBtn") as HTMLButtonElement;
    this._elCalOverlay = this._ref("calOverlay") as HTMLDivElement;

    (this._ref("refreshBtn") as HTMLButtonElement).addEventListener("click", () => this._loadDay());
    this._elPrev.addEventListener("click", () => this._shiftDay(-1));
    this._elNext.addEventListener("click", () => this._shiftDay(1));
    this._elToday.addEventListener("click", () => {
      this._selectedDate = new Date();
      this._calOpen = false;
      this._elCalOverlay.style.display = "none";
      this._loadDay();
    });
    this._elCalBtn.addEventListener("click", () => this._toggleCalendar());
    this._elCalOverlay.addEventListener("click", (e) => e.stopPropagation());
    this._onDocClick = (e: MouseEvent) => {
      if (this._calOpen && !this._elCalBtn.contains(e.target as Node)) {
        this._calOpen = false;
        this._elCalOverlay.style.display = "none";
      }
    };
    document.addEventListener("click", this._onDocClick);
  }

  private _ref(name: string): HTMLElement {
    return this._c.querySelector(`[data-ref="${name}"]`) as HTMLElement;
  }

  private async _initialize(): Promise<void> {
    try {
      const p = await this._getPresence();
      this._curId = p.id;
      this._start = p.since ? new Date(p.since).getTime() : Date.now();
      this._render(p);
      this._tick();
      this._tickTimer = window.setInterval(() => this._tick(), 1000);
      this._pollTimer = window.setInterval(() => this._poll(), POLL_PRESENCE_MS);
      this._loadDay();
    } catch (e: unknown) {
      this._elName.textContent = "\u2014";
      this._showErr(e instanceof Error ? e.message : String(e));
    }
  }

  private async _getPresence(): Promise<{ id: string; name: string; since: string | null }> {
    const resp = await this._s.api.retrieveMultipleRecords(
      "msdyn_agentstatus",
      `?$filter=_msdyn_agentid_value eq ${this._s.userId}&$select=_msdyn_currentpresenceid_value&$top=1`
    );
    if (!resp.entities || !resp.entities.length) throw new Error("No agent status record found");
    const rec = resp.entities[0];
    const pid = rec["_msdyn_currentpresenceid_value"] as string;
    if (!pid) throw new Error("No current presence assigned");

    // Get the real start time from the latest history record (immune to page-refresh resets)
    let since: string | null = null;
    try {
      const hResp = await this._s.api.retrieveMultipleRecords(
        "msdyn_agentstatushistory",
        `?$filter=_msdyn_agentid_value eq ${this._s.userId} and _msdyn_presenceid_value eq ${pid}` +
        `&$select=msdyn_starttime,msdyn_endtime&$orderby=msdyn_starttime desc&$top=1`
      );
      if (hResp.entities && hResp.entities.length) {
        since = (hResp.entities[0]["msdyn_starttime"] as string) || null;
      }
    } catch { /* fall through */ }

    return { id: pid, name: pName(pid, this._s.pmap), since };
  }

  private static _tzOffsetStr(): string {
    const off = new Date().getTimezoneOffset();
    const sign = off <= 0 ? "+" : "-";
    const h = String(Math.floor(Math.abs(off) / 60)).padStart(2, "0");
    const m = String(Math.abs(off) % 60).padStart(2, "0");
    return `${sign}${h}:${m}`;
  }

  private async _fetchHistory(date: Date): Promise<ComponentFramework.WebApi.Entity[]> {
    const tz = PresenceTimerPanel._tzOffsetStr();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const dayStartStr = `${y}-${m}-${d}T00:00:00${tz}`;
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const ny = next.getFullYear();
    const nm = String(next.getMonth() + 1).padStart(2, "0");
    const nd = String(next.getDate()).padStart(2, "0");
    const dayEndStr = `${ny}-${nm}-${nd}T00:00:00${tz}`;
    const filter =
      `_msdyn_agentid_value eq ${this._s.userId}` +
      ` and msdyn_starttime ge ${dayStartStr}` +
      ` and msdyn_starttime lt ${dayEndStr}`;
    const q =
      `?$filter=${filter}` +
      `&$select=msdyn_starttime,msdyn_endtime,_msdyn_presenceid_value` +
      `&$orderby=msdyn_starttime desc`;
    const resp = await this._s.api.retrieveMultipleRecords("msdyn_agentstatushistory", q, 5000);
    return resp.entities || [];
  }

  private _tick(): void {
    if (this._start) this._elClock.textContent = fmtClock(Date.now() - this._start);
  }

  private _render(p: { id: string; name: string }): void {
    this._elName.textContent = p.name;
    this._elDot.style.background = color(p.name);
    this._elDot.innerHTML = statusIcon(p.name, "lg");
    this._elErr.style.display = "none";
  }

  private _showErr(msg: string): void {
    this._elErr.textContent = msg;
    this._elErr.style.display = "block";
  }

  private async _poll(): Promise<void> {
    try {
      const p = await this._getPresence();
      if (p.id !== this._curId) {
        this._curId = p.id;
        this._start = p.since ? new Date(p.since).getTime() : Date.now();
        if (isToday(this._selectedDate)) this._loadDay();
      }
      this._render(p);
    } catch (e: unknown) {
      this._showErr(e instanceof Error ? e.message : String(e));
    }
  }

  private _renderTimeline(records: ComponentFramework.WebApi.Entity[]): void {
    if (!records.length) {
      this._elTL.innerHTML = '<div class="tl-empty">No activity on this day</div>';
      this._elSum.innerHTML = "";
      return;
    }
    const totals: Record<string, number> = {};
    let maxDur = 0;
    for (const r of records) {
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const st = new Date(r["msdyn_starttime"] as string).getTime();
      const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
      const dur = en - st;
      totals[name] = (totals[name] || 0) + dur;
      if (dur > maxDur) maxDur = dur;
    }
    const sortedNames = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    let sumHtml = "";
    for (const n of sortedNames) {
      sumHtml += `<div class="sum-chip"><div class="sum-dot" style="background:${color(n)}">${statusIcon(n, "sm")}</div><span>${esc(n)}</span> <span class="sum-val">${fmtShort(totals[n])}</span></div>`;
    }
    this._elSum.innerHTML = sumHtml;

    let html = '<div class="tl">';
    for (const r of records) {
      const name = pName(r["_msdyn_presenceid_value"] as string, this._s.pmap);
      const c = color(name);
      const st = new Date(r["msdyn_starttime"] as string).getTime();
      const en = r["msdyn_endtime"] ? new Date(r["msdyn_endtime"] as string).getTime() : Date.now();
      const dur = en - st;
      const barPct = maxDur > 0 ? Math.max(4, Math.round((dur / maxDur) * 100)) : 100;
      html += `<div class="tl-item"><div class="tl-dot" style="background:${c}">${statusIcon(name, "lg")}</div><div class="tl-body"><div class="tl-row"><span class="tl-name">${esc(name)}</span><span class="tl-dur">${fmtShort(dur)}</span></div><div class="tl-time">${fmtTimeRange(r["msdyn_starttime"] as string, (r["msdyn_endtime"] as string) || null)}</div><div class="tl-bar" style="width:${barPct}%;background:${c}"></div></div></div>`;
    }
    html += "</div>";
    this._elTL.innerHTML = html;
  }

  private _updateDateLabel(): void {
    if (isToday(this._selectedDate)) {
      this._elDpLbl.textContent = "Today";
      this._elToday.style.display = "none";
      this._elNext.style.visibility = "hidden";
    } else {
      this._elDpLbl.textContent = this._selectedDate.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
      this._elToday.style.display = "";
      this._elNext.style.visibility = "";
    }
  }

  private async _loadDay(): Promise<void> {
    this._updateDateLabel();
    this._elTL.innerHTML = '<div class="hist-loading">Loading\u2026</div>';
    this._elSum.innerHTML = "";
    try {
      const records = await this._fetchHistory(this._selectedDate);
      this._renderTimeline(records);
    } catch (e: unknown) {
      this._elTL.innerHTML = `<div class="tl-empty">Failed to load: ${esc(e instanceof Error ? e.message : String(e))}</div>`;
    }
  }

  private _shiftDay(offset: number): void {
    const d = new Date(this._selectedDate);
    d.setDate(d.getDate() + offset);
    if (d > new Date()) return;
    this._selectedDate = d;
    this._loadDay();
  }

  private _toggleCalendar(): void {
    this._calOpen = !this._calOpen;
    if (this._calOpen) {
      this._calViewDate = new Date(this._selectedDate.getFullYear(), this._selectedDate.getMonth(), 1);
      this._renderCalendar();
      this._elCalOverlay.style.display = "";
    } else {
      this._elCalOverlay.style.display = "none";
    }
  }

  private _renderCalendar(): void {
    const year = this._calViewDate.getFullYear();
    const month = this._calViewDate.getMonth();
    const today = new Date();
    const sel = this._selectedDate;
    const monthName = new Date(year, month, 1).toLocaleDateString([], { month: "long", year: "numeric" });
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const canGoNext = new Date(year, month + 1, 1) <= today;

    let html = `<div class="cal-head">`;
    html += `<button class="cal-nav" data-action="calPrev">\u2039</button>`;
    html += `<span class="cal-title">${esc(monthName)}</span>`;
    html += `<button class="cal-nav${canGoNext ? "" : " cal-nav-dis"}" data-action="calNext">\u203A</button>`;
    html += `</div><div class="cal-dow-row">`;
    for (const d of ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]) {
      html += `<span class="cal-dow">${d}</span>`;
    }
    html += `</div><div class="cal-grid">`;
    for (let i = 0; i < firstDow; i++) html += `<span class="cal-cell"></span>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const isFuture = cellDate > today;
      const isTdy = cellDate.toDateString() === today.toDateString();
      const isSel = cellDate.toDateString() === sel.toDateString();
      let cls = "cal-day";
      if (isFuture) cls += " cal-dis";
      if (isTdy) cls += " cal-today";
      if (isSel) cls += " cal-sel";
      html += `<button class="${cls}"${isFuture ? " disabled" : ""} data-day="${d}">${d}</button>`;
    }
    html += `</div>`;
    this._elCalOverlay.innerHTML = html;

    this._elCalOverlay.querySelector('[data-action="calPrev"]')
      ?.addEventListener("click", () => this._shiftCalMonth(-1));
    if (canGoNext) {
      this._elCalOverlay.querySelector('[data-action="calNext"]')
        ?.addEventListener("click", () => this._shiftCalMonth(1));
    }
    this._elCalOverlay.querySelectorAll(".cal-day:not(.cal-dis)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const day = parseInt((btn as HTMLElement).dataset.day || "1", 10);
        this._selectedDate = new Date(year, month, day);
        this._calOpen = false;
        this._elCalOverlay.style.display = "none";
        this._loadDay();
      });
    });
  }

  private _shiftCalMonth(offset: number): void {
    this._calViewDate = new Date(this._calViewDate.getFullYear(), this._calViewDate.getMonth() + offset, 1);
    this._renderCalendar();
  }
}

/* ═══════════════════════════════════════════════════════════════
   Queue Hub Panel
   ═══════════════════════════════════════════════════════════════ */

class QueueHubPanel {
  private _c: HTMLDivElement;
  private _s: SharedServices;

  private _queues: QueueInfo[] = [];
  private _pollTimer: number | null = null;
  private _activeTab: "queues" | "agents" = "queues";
  private _dataLoaded = false;

  // Queues subtab state
  private _selectedQueueIds = new Set<string>();
  private _queueAgents: AgentInfo[] = [];
  private _queuesCollapsed = false;

  // Agents subtab state
  private _allAgents: AgentWithQueues[] = [];
  private _expandedAgentIds = new Set<string>();

  private _elSearch!: HTMLInputElement;
  private _elSubtitle!: HTMLDivElement;
  private _elList!: HTMLDivElement;
  private _elSummary!: HTMLDivElement;
  private _elTabQueues!: HTMLButtonElement;
  private _elTabAgents!: HTMLButtonElement;

  constructor(container: HTMLDivElement, services: SharedServices) {
    this._c = container;
    this._s = services;
  }

  public init(): void {
    this._c.classList.add("queue-hub");
    this._buildUI();
    this._initialize();
  }

  public destroy(): void {
    if (this._pollTimer !== null) clearInterval(this._pollTimer);
  }

  private _buildUI(): void {
    this._c.innerHTML = `
      <div class="qh-subtitle" data-ref="subtitle">Check agents\u2019 presence status and queue membership in real-time.</div>
      <div class="qh-tabs" data-ref="tabs">
        <button class="qh-tab qh-tab--active" data-ref="tab-queues" data-tab="queues">Queues</button>
        <button class="qh-tab" data-ref="tab-agents" data-tab="agents">Agents</button>
      </div>
      <div class="qh-search-wrap">
        <input class="qh-search" data-ref="search" placeholder="Search queues\u2026" autocomplete="off" />
      </div>
      <div class="qh-summary" data-ref="summary" style="display:none"></div>
      <div class="qh-list" data-ref="list">${LOADING_HTML}</div>`;

    this._elSearch = this._ref("search") as HTMLInputElement;
    this._elSubtitle = this._ref("subtitle") as HTMLDivElement;
    this._elList = this._ref("list") as HTMLDivElement;
    this._elSummary = this._ref("summary") as HTMLDivElement;
    this._elTabQueues = this._ref("tab-queues") as HTMLButtonElement;
    this._elTabAgents = this._ref("tab-agents") as HTMLButtonElement;

    this._elSearch.addEventListener("input", () => this._onSearch());
    this._elTabQueues.addEventListener("click", () => this._switchTab("queues"));
    this._elTabAgents.addEventListener("click", () => this._switchTab("agents"));
  }

  private _ref(name: string): HTMLElement {
    return this._c.querySelector(`[data-ref="${name}"]`) as HTMLElement;
  }

  private async _initialize(): Promise<void> {
    try {
      await this._loadQueues();
      this._dataLoaded = true;
      this._renderQueuesTab();
    } catch (e: unknown) {
      this._elList.innerHTML = `<div class="qh-empty">${esc(e instanceof Error ? e.message : String(e))}</div>`;
    }
  }

  /* ── Data loading ── */

  private async _loadQueues(): Promise<void> {
    const fetchXml = `<fetch>
      <entity name="queue">
        <attribute name="queueid"/>
        <attribute name="name"/>
        <order attribute="name"/>
        <link-entity name="queuemembership" from="queueid" to="queueid" intersect="true">
          <link-entity name="systemuser" from="systemuserid" to="systemuserid">
            <filter><condition attribute="systemuserid" operator="eq" value="${this._s.userId}"/></filter>
          </link-entity>
        </link-entity>
      </entity>
    </fetch>`;
    const resp = await this._s.api.retrieveMultipleRecords("queue", `?fetchXml=${encodeURIComponent(fetchXml)}`, 5000);
    this._queues = [];
    for (const e of resp.entities) {
      const name = e["name"] as string;
      if (/^<.*>$/.test(name) || /^[0-9a-f]{20,}_\d+$/i.test(name)) continue;
      this._queues.push({ id: e["queueid"] as string, name });
    }
  }

  private async _loadAgentsInQueue(queueId: string): Promise<AgentInfo[]> {
    const fetchXml = `<fetch>
      <entity name="systemuser">
        <attribute name="systemuserid"/>
        <attribute name="fullname"/>
        <order attribute="fullname"/>
        <link-entity name="queuemembership" from="systemuserid" to="systemuserid" intersect="true">
          <link-entity name="queue" from="queueid" to="queueid">
            <filter><condition attribute="queueid" operator="eq" value="${queueId}"/></filter>
          </link-entity>
        </link-entity>
      </entity>
    </fetch>`;
    const resp = await this._s.api.retrieveMultipleRecords("systemuser", `?fetchXml=${encodeURIComponent(fetchXml)}`, 5000);

    const agents: AgentInfo[] = [];
    const userIds: string[] = [];
    for (const e of resp.entities) {
      const uid = e["systemuserid"] as string;
      userIds.push(uid);
      agents.push({ id: uid, name: (e["fullname"] as string) || "Unknown", presenceId: null, presenceName: "Unknown", since: null });
    }

    if (userIds.length > 0) {
      const statusMap: Record<string, { presenceId: string | null; since: string | null }> = {};
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const filter = batch.map(id => `_msdyn_agentid_value eq ${id}`).join(" or ");
        try {
          const sr = await this._s.api.retrieveMultipleRecords(
            "msdyn_agentstatus",
            `?$filter=${filter}&$select=_msdyn_agentid_value,_msdyn_currentpresenceid_value,msdyn_presencemodifiedon`
          );
          for (const s of sr.entities) {
            const aid = s["_msdyn_agentid_value"] as string;
            statusMap[aid] = {
              presenceId: (s["_msdyn_currentpresenceid_value"] as string) || null,
              since: (s["msdyn_presencemodifiedon"] as string) || null,
            };
          }
        } catch {
          // Some agents may not have status records
        }
      }
      for (const a of agents) {
        const st = statusMap[a.id];
        if (st) {
          a.presenceId = st.presenceId;
          a.presenceName = pName(st.presenceId, this._s.pmap);
          a.since = st.since;
        }
      }
    }
    return agents;
  }

  private async _loadAgentsForSelectedQueues(): Promise<AgentInfo[]> {
    const agentMap: Record<string, AgentInfo> = {};
    for (const qid of this._selectedQueueIds) {
      const agents = await this._loadAgentsInQueue(qid);
      for (const a of agents) {
        if (!agentMap[a.id]) {
          agentMap[a.id] = { ...a };
        } else if (a.presenceId) {
          agentMap[a.id].presenceId = a.presenceId;
          agentMap[a.id].presenceName = a.presenceName;
          agentMap[a.id].since = a.since;
        }
      }
    }
    return Object.values(agentMap).sort((a, b) => {
      const diff = statusOrder(a) - statusOrder(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
  }

  private async _loadAllAgentsWithQueues(): Promise<AgentWithQueues[]> {
    const agentMap: Record<string, AgentWithQueues> = {};
    for (const q of this._queues) {
      const agents = await this._loadAgentsInQueue(q.id);
      for (const a of agents) {
        if (!agentMap[a.id]) {
          agentMap[a.id] = { ...a, queues: [] };
        } else if (a.presenceId) {
          agentMap[a.id].presenceId = a.presenceId;
          agentMap[a.id].presenceName = a.presenceName;
          agentMap[a.id].since = a.since;
        }
        agentMap[a.id].queues.push(q);
      }
    }
    return Object.values(agentMap).sort((a, b) => a.name.localeCompare(b.name));
  }

  /* ── Tab switching ── */

  private _switchTab(tab: "queues" | "agents"): void {
    if (this._activeTab === tab) return;
    if (this._pollTimer !== null) { clearInterval(this._pollTimer); this._pollTimer = null; }
    this._activeTab = tab;
    this._elSearch.value = "";
    this._elSummary.style.display = "none";
    this._elSummary.innerHTML = "";

    this._elTabQueues.classList.toggle("qh-tab--active", tab === "queues");
    this._elTabAgents.classList.toggle("qh-tab--active", tab === "agents");

    if (tab === "queues") {
      this._elSearch.placeholder = "Search queues\u2026";
      this._renderQueuesTab();
    } else {
      this._elSearch.placeholder = "Search agents\u2026";
      this._renderAgentsTab();
    }
  }

  /* ══════════════════════════════════
     QUEUES SUBTAB
     ══════════════════════════════════ */

  private _renderQueuesTab(filter?: string): void {
    let queues = this._queues;
    if (filter) {
      const lf = filter.toLowerCase();
      queues = queues.filter(q => q.name.toLowerCase().indexOf(lf) > -1);
    }

    if (!queues.length) {
      this._elList.innerHTML = `<div class="qh-empty">${filter ? "No queues match your search" : "No queues found"}</div>`;
      return;
    }

    const selCount = this._selectedQueueIds.size;
    const collapsed = this._queuesCollapsed;
    const selQueues = selCount ? this._queues.filter(q => this._selectedQueueIds.has(q.id)) : [];
    const collapseLabel = collapsed
      ? `${queues.length} queue${queues.length !== 1 ? "s" : ""}${selCount ? ` \u00b7 ${selCount} selected` : ""}`
      : `${queues.length} queue${queues.length !== 1 ? "s" : ""}`;

    let html = `<div class="qh-collapse-hdr" data-ref="collapse-toggle">
      <svg class="qh-collapse-arrow${collapsed ? "" : " qh-collapse-arrow--open"}" width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M15.85 7.65a.5.5 0 0 0-.7 0L10 12.79 4.85 7.65a.5.5 0 0 0-.7.7l5.5 5.5a.5.5 0 0 0 .7 0l5.5-5.5a.5.5 0 0 0 0-.7Z"/></svg>
      <span class="qh-collapse-label">${collapseLabel}</span>
    </div>`;
    if (collapsed && selQueues.length) {
      html += `<div class="qh-selected-queues">${selQueues.map(q => `<span class="qh-sel-tag">${esc(q.name)}<span class="qh-sel-tag-x" data-qid="${esc(q.id)}">&times;</span></span>`).join("")}</div>`;
    }
    html += `<div class="qh-collapse-body" style="display:${collapsed ? "none" : "block"}">`;
    for (const q of queues) {
      const checked = this._selectedQueueIds.has(q.id);
      html += `<div class="qh-item qh-item--selectable${checked ? " qh-item--selected" : ""}" data-qid="${esc(q.id)}">
        <label class="qh-checkbox-wrap" onclick="event.stopPropagation()">
          <input type="checkbox" class="qh-checkbox" data-qid="${esc(q.id)}" ${checked ? "checked" : ""} />
          <span class="qh-checkbox-custom"></span>
        </label>
        <div class="qh-item-icon">${esc(getInitials(q.name))}</div>
        <div class="qh-item-body">
          <div class="qh-item-name">${esc(q.name)}</div>
        </div>
      </div>`;
    }
    html += `</div>`;

    if (selCount > 0) {
      html += `<div class="qh-results-divider"><span>Agents in selected queues</span></div>`;
      if (!collapsed) html += `<div class="qh-selected-queues">${selQueues.map(q => `<span class="qh-sel-tag">${esc(q.name)}<span class="qh-sel-tag-x" data-qid="${esc(q.id)}">&times;</span></span>`).join("")}</div>`;
      html += `<div data-ref="queue-agents">${LOADING_HTML}</div>`;
    }

    this._elList.innerHTML = html;

    // Bind collapse toggle
    const colToggle = this._c.querySelector('[data-ref="collapse-toggle"]');
    if (colToggle) {
      colToggle.addEventListener("click", () => {
        this._queuesCollapsed = !this._queuesCollapsed;
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
        if (this._selectedQueueIds.size > 0) this._loadAndRenderQueueAgents();
      });
    }

    // Bind checkbox events
    this._elList.querySelectorAll(".qh-checkbox").forEach(cb => {
      cb.addEventListener("change", (ev) => {
        const input = ev.target as HTMLInputElement;
        const qid = input.dataset.qid!;
        if (input.checked) {
          this._selectedQueueIds.add(qid);
        } else {
          this._selectedQueueIds.delete(qid);
        }
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
        if (this._selectedQueueIds.size > 0) {
          this._loadAndRenderQueueAgents();
        }
      });
    });

    // Also allow clicking the row to toggle
    this._elList.querySelectorAll(".qh-item--selectable").forEach(el => {
      el.addEventListener("click", () => {
        const qid = (el as HTMLElement).dataset.qid!;
        const cb = el.querySelector(".qh-checkbox") as HTMLInputElement;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event("change"));
      });
    });

    // Bind tag remove buttons
    this._elList.querySelectorAll(".qh-sel-tag-x").forEach(btn => {
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const qid = (btn as HTMLElement).dataset.qid!;
        this._selectedQueueIds.delete(qid);
        this._renderQueuesTab(this._elSearch.value.trim() || undefined);
        if (this._selectedQueueIds.size > 0) this._loadAndRenderQueueAgents();
      });
    });

    if (selCount > 0) {
      this._loadAndRenderQueueAgents();
    }
  }

  private async _loadAndRenderQueueAgents(): Promise<void> {
    const target = this._c.querySelector('[data-ref="queue-agents"]') as HTMLDivElement;
    if (!target) return;

    try {
      this._queueAgents = await this._loadAgentsForSelectedQueues();
      this._renderQueueAgentsSection(target);
      if (this._pollTimer !== null) clearInterval(this._pollTimer);
      this._pollTimer = window.setInterval(() => this._pollQueueAgents(), POLL_QUEUE_MS);
    } catch (e: unknown) {
      target.innerHTML = `<div class="qh-empty">${esc(e instanceof Error ? e.message : String(e))}</div>`;
    }
  }

  private _renderQueueAgentsSection(target: HTMLElement): void {
    const agents = this._queueAgents;
    const totals: Record<string, number> = {};
    for (const a of agents) {
      totals[a.presenceName] = (totals[a.presenceName] || 0) + 1;
    }
    const sorted = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    let sumHtml = `<div class="qh-summary" style="display:${sorted.length ? "flex" : "none"}">`;
    for (const n of sorted) {
      sumHtml += `<div class="qh-chip"><div class="qh-chip-dot" style="background:${color(n)}">${statusIcon(n, "sm")}</div><span class="qh-chip-count">${totals[n]}</span><span>${esc(n)}</span></div>`;
    }
    sumHtml += `</div>`;

    if (!agents.length) {
      target.innerHTML = `${sumHtml}<div class="qh-empty">No agents in selected queues</div>`;
      return;
    }

    let html = sumHtml;
    html += `<div class="qh-results-count">${agents.length} agent${agents.length !== 1 ? "s" : ""}</div>`;
    for (const a of agents) {
      html += this._agentCardHtml(a);
    }
    target.innerHTML = html;
  }

  private async _pollQueueAgents(): Promise<void> {
    if (this._activeTab !== "queues" || this._selectedQueueIds.size === 0) return;
    try {
      this._queueAgents = await this._loadAgentsForSelectedQueues();
      const target = this._c.querySelector('[data-ref="queue-agents"]') as HTMLDivElement;
      if (target) this._renderQueueAgentsSection(target);
    } catch {
      // silently retry
    }
  }

  /* ══════════════════════════════════
     AGENTS SUBTAB
     ══════════════════════════════════ */

  private async _renderAgentsTab(filter?: string): Promise<void> {
    if (!this._allAgents.length || !this._dataLoaded) {
      this._elList.innerHTML = LOADING_HTML;
      try {
        this._allAgents = await this._loadAllAgentsWithQueues();
      } catch (e: unknown) {
        this._elList.innerHTML = `<div class="qh-empty">${esc(e instanceof Error ? e.message : String(e))}</div>`;
        return;
      }
    }

    let agents = this._allAgents;
    if (filter) {
      const lf = filter.toLowerCase();
      agents = agents.filter(a => a.name.toLowerCase().indexOf(lf) > -1);
    }

    if (!agents.length) {
      this._elList.innerHTML = `<div class="qh-empty">${filter ? "No agents match your search" : "No agents found"}</div>`;
      return;
    }

    agents = [...agents].sort((a, b) => {
      const diff = statusOrder(a) - statusOrder(b);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });

    // Status summary chips
    const totals: Record<string, number> = {};
    for (const a of this._allAgents) {
      totals[a.presenceName] = (totals[a.presenceName] || 0) + 1;
    }
    const sortedStatuses = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
    let sumHtml = `<div class="qh-summary" style="display:${sortedStatuses.length ? "flex" : "none"}">`;
    for (const n of sortedStatuses) {
      sumHtml += `<div class="qh-chip"><div class="qh-chip-dot" style="background:${color(n)}">${statusIcon(n, "sm")}</div><span class="qh-chip-count">${totals[n]}</span><span>${esc(n)}</span></div>`;
    }
    sumHtml += `</div>`;

    const clientUrl = getClientUrl();
    let html = "";
    for (const a of agents) {
      const expanded = this._expandedAgentIds.has(a.id);
      const col = color(a.presenceName);
      const sinceStr = a.since ? fmtShort(Date.now() - new Date(a.since).getTime()) : "";
      const isMe = a.id === this._s.userId;
      const initials = esc(getInitials(a.name));
      const imgUrl = `${clientUrl}/api/data/v9.2/systemusers(${a.id})/entityimage/$value`;
      const photoHtml = `<img class="qh-agent-photo" src="${esc(imgUrl)}" alt="" onload="this.parentElement.style.background='transparent'" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="qh-agent-initials" style="display:none">${initials}</span>`;

      html += `<div class="qh-agent-expandable${expanded ? " qh-agent-expandable--open" : ""}" data-aid="${esc(a.id)}">
        <div class="qh-agent qh-agent--clickable">
          <div class="qh-agent-avatar" style="background:${isMe ? "#e0ecff" : "#f0f0f0"};color:${isMe ? "#0078d4" : "#666"}">
            ${photoHtml}
            <div class="qh-agent-dot" style="background:${col}">${statusIcon(a.presenceName, "sm")}</div>
          </div>
          <div class="qh-agent-body">
            <div class="qh-agent-name">${esc(a.name)}</div>
            <div class="qh-agent-status"><span style="color:${col}">${esc(a.presenceName)}</span>${sinceStr ? ` \u00b7 ${esc(sinceStr)}` : ""}</div>
          </div>
          ${isMe ? '<span class="qh-agent-you">You</span>' : ""}
          <span class="qh-agent-queue-count">${a.queues.length} queue${a.queues.length !== 1 ? "s" : ""}</span>
          <svg class="qh-expand-arrow${expanded ? " qh-expand-arrow--open" : ""}" width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M15.85 7.65a.5.5 0 0 0-.7 0L10 12.79 4.85 7.65a.5.5 0 0 0-.7.7l5.5 5.5a.5.5 0 0 0 .7 0l5.5-5.5a.5.5 0 0 0 0-.7Z"/></svg>
        </div>
        <div class="qh-agent-queues" style="display:${expanded ? "block" : "none"}">
          ${a.queues.map(q => `<div class="qh-agent-queue-item">
            <div class="qh-item-icon qh-item-icon--sm">${esc(getInitials(q.name))}</div>
            <span>${esc(q.name)}</span>
          </div>`).join("")}
        </div>
      </div>`;
    }

    this._elList.innerHTML = sumHtml + html;

    // Bind expand/collapse
    this._elList.querySelectorAll(".qh-agent--clickable").forEach(el => {
      el.addEventListener("click", () => {
        const wrapper = el.closest(".qh-agent-expandable") as HTMLElement;
        const aid = wrapper.dataset.aid!;
        const queuesDiv = wrapper.querySelector(".qh-agent-queues") as HTMLElement;
        const arrow = wrapper.querySelector(".qh-expand-arrow") as HTMLElement;
        if (this._expandedAgentIds.has(aid)) {
          this._expandedAgentIds.delete(aid);
          queuesDiv.style.display = "none";
          wrapper.classList.remove("qh-agent-expandable--open");
          arrow.classList.remove("qh-expand-arrow--open");
        } else {
          this._expandedAgentIds.add(aid);
          queuesDiv.style.display = "block";
          wrapper.classList.add("qh-agent-expandable--open");
          arrow.classList.add("qh-expand-arrow--open");
        }
      });
    });

    if (this._pollTimer !== null) clearInterval(this._pollTimer);
    this._pollTimer = window.setInterval(() => this._pollAgentsTab(), POLL_QUEUE_MS);
  }

  private async _pollAgentsTab(): Promise<void> {
    if (this._activeTab !== "agents") return;
    try {
      this._allAgents = await this._loadAllAgentsWithQueues();
      this._renderAgentsTab(this._elSearch.value.trim() || undefined);
    } catch {
      // silently retry
    }
  }

  /* ── Shared agent card HTML ── */

  private _agentCardHtml(a: AgentInfo): string {
    const col = color(a.presenceName);
    const sinceStr = a.since ? fmtShort(Date.now() - new Date(a.since).getTime()) : "";
    const isMe = a.id === this._s.userId;
    const initials = esc(getInitials(a.name));
    const clientUrl = getClientUrl();
    const imgUrl = `${clientUrl}/api/data/v9.2/systemusers(${a.id})/entityimage/$value`;
    const photoHtml = `<img class="qh-agent-photo" src="${esc(imgUrl)}" alt="" onload="this.parentElement.style.background='transparent'" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="qh-agent-initials" style="display:none">${initials}</span>`;
    return `<div class="qh-agent">
      <div class="qh-agent-avatar" style="background:${isMe ? "#e0ecff" : "#f0f0f0"};color:${isMe ? "#0078d4" : "#666"}">
        ${photoHtml}
        <div class="qh-agent-dot" style="background:${col}">${statusIcon(a.presenceName, "sm")}</div>
      </div>
      <div class="qh-agent-body">
        <div class="qh-agent-name">${esc(a.name)}</div>
        <div class="qh-agent-status"><span style="color:${col}">${esc(a.presenceName)}</span>${sinceStr ? ` \u00b7 ${esc(sinceStr)}` : ""}</div>
      </div>
      ${isMe ? '<span class="qh-agent-you">You</span>' : ""}
    </div>`;
  }

  /* ── Search ── */

  private _onSearch(): void {
    const val = this._elSearch.value.trim();
    if (this._activeTab === "queues") {
      this._renderQueuesTab(val || undefined);
    } else {
      this._renderAgentsTab(val || undefined);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   Main Control — Presence Hub
   ═══════════════════════════════════════════════════════════════ */

export class PresenceHub implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container!: HTMLDivElement;
  private _context!: ComponentFramework.Context<IInputs>;
  private _presencePanel!: PresenceTimerPanel;
  private _queuePanel!: QueueHubPanel;
  private _activeTab: "presence" | "queues" = "presence";
  private _tabPresence!: HTMLButtonElement;
  private _tabQueues!: HTMLButtonElement;
  private _panelPresence!: HTMLDivElement;
  private _panelQueues!: HTMLDivElement;

  constructor() {
    // empty
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    _notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._context = context;
    this._container = container;
    this._container.classList.add("presence-hub");

    this._container.innerHTML = `
      <div class="ph-tabs">
        <button class="ph-tab ph-tab-active" data-tab="presence">Presence History</button>
        <button class="ph-tab" data-tab="queues">Queue Hub</button>
        <svg class="ph-info-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 7.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5ZM8 5.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Zm6-5a5 5 0 1 0 0 10A5 5 0 0 0 8 3Z"/></svg>
      </div>
      <div class="ph-panel" data-panel="presence"></div>
      <div class="ph-panel" data-panel="queues" style="display:none"></div>`;

    this._tabPresence = this._container.querySelector('[data-tab="presence"]') as HTMLButtonElement;
    this._tabQueues = this._container.querySelector('[data-tab="queues"]') as HTMLButtonElement;
    this._panelPresence = this._container.querySelector('[data-panel="presence"]') as HTMLDivElement;
    this._panelQueues = this._container.querySelector('[data-panel="queues"]') as HTMLDivElement;

    this._tabPresence.addEventListener("click", () => this._switchTab("presence"));
    this._tabQueues.addEventListener("click", () => this._switchTab("queues"));

    this._initAsync();
  }

  private async _initAsync(): Promise<void> {
    try {
      const api = getWebApi(this._context);
      const userId = getUserId(this._context);
      const pmap = await loadPresenceMap(api);
      const services: SharedServices = { userId, pmap, api };

      this._presencePanel = new PresenceTimerPanel(this._panelPresence, services);
      this._presencePanel.init();

      this._queuePanel = new QueueHubPanel(this._panelQueues, services);
      this._queuePanel.init();
    } catch (e: unknown) {
      this._panelPresence.textContent = `Init error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  private _switchTab(tab: "presence" | "queues"): void {
    if (tab === this._activeTab) return;
    this._activeTab = tab;
    if (tab === "presence") {
      this._tabPresence.classList.add("ph-tab-active");
      this._tabQueues.classList.remove("ph-tab-active");
      this._panelPresence.style.display = "";
      this._panelQueues.style.display = "none";
    } else {
      this._tabQueues.classList.add("ph-tab-active");
      this._tabPresence.classList.remove("ph-tab-active");
      this._panelQueues.style.display = "";
      this._panelPresence.style.display = "none";
    }
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    if (this._presencePanel) this._presencePanel.destroy();
    if (this._queuePanel) this._queuePanel.destroy();
  }
}
