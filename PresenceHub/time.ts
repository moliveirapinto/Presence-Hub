/**
 * Duration / date formatting and day-window maths.
 *
 * Locale is passed in rather than read from a module global so these stay pure and testable.
 */

export interface DayBounds { start: number; end: number; }

/** Local midnight-to-midnight window around `date`. */
export function dayBounds(date: Date): DayBounds {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime(),
    end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0).getTime(),
  };
}

/**
 * Clamp a presence segment to a day window. `rawEnd` of null means "still open".
 * Cross-midnight segments would otherwise report their full multi-day length against a
 * single day's totals.
 */
export function clampSpan(
  rawStart: number,
  rawEnd: number | null,
  bounds: DayBounds,
  now: number = Date.now()
): { st: number; en: number } {
  const st = Math.max(rawStart, bounds.start);
  const en = Math.min(rawEnd ?? now, bounds.end, now);
  return { st, en: Math.max(st, en) };
}

/**
 * Convert a local Date instant to an OData-safe UTC literal: `yyyy-MM-ddTHH:mm:ssZ`.
 * We MUST emit UTC (with `Z`), not a numeric offset like `+02:00`, because the literal
 * `+` inside an OData `$filter` value is URL-decoded to a space by the gateway,
 * producing an invalid DateTimeOffset (e.g. `2026-05-21T00:00:00 02:00`) and a
 * `"should be in format 'yyyy-mm-ddThh:mm:ss('.'s+)?(zzzzzz)?'"` error.
 * Users in negative-offset timezones never saw this (the `-` is safe); EU/Asia did.
 */
export function toUtcLiteral(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}-${mo}-${da}T${h}:${mi}:${s}Z`;
}

/** `HH:MM:SS`, prefixed with `Nd ` past 24h so long spans stay readable. */
export function fmtClock(ms: number): string {
  let s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  s = s % 60;
  const clock = `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  return d > 0 ? `${d}d ${clock}` : clock;
}

/** Compact duration: `5d 18h` / `2h 14m` / `3m 07s` / `42s`. */
export function fmtShort(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h - d * 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s % 60}s`;
}

export function fmtTime(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function fmtDateTime(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleString(locale, {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function fmtTimeRange(startIso: string, endIso: string | null, locale: string, nowLabel: string): string {
  return fmtTime(startIso, locale) + " \u2013 " + (endIso ? fmtTime(endIso, locale) : nowLabel);
}

export function isToday(d: Date, now: Date = new Date()): boolean {
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
}

export function getInitials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts.length ? parts[0][0].toUpperCase() : "?";
}
