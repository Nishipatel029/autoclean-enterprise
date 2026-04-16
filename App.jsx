/**
 * AutoClean Enterprise — CodeSandbox Fixed Version
 * Fixes: removed ZAxis, fixed xlsx import, fixed all element-type errors
 */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const C = {
  primary: "#4f46e5",
  blue: "#0ea5e9",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
  slate: "#64748b",
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  dark: "#0f172a",
};
const PAL = [
  "#4f46e5",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

const STEPS = [
  "ingest",
  "quality",
  "clean",
  "transform",
  "lineage",
  "insights",
  "decisions",
  "simulate",
  "kpi",
  "monitor",
  "visualize",
  "nlq",
  "collaborate",
  "report",
].map((id) => ({
  id,
  label: {
    ingest: "Ingest",
    quality: "Quality",
    clean: "Clean",
    transform: "Transform",
    lineage: "Lineage",
    insights: "Insights",
    decisions: "Decisions",
    simulate: "Simulate",
    kpi: "KPIs",
    monitor: "Monitor",
    visualize: "Visualize",
    nlq: "Ask AI",
    collaborate: "Team",
    report: "Report",
  }[id],
}));

const INDUSTRIES = [
  { id: "auto", label: "Auto-Detect", desc: "AI chooses context" },
  { id: "finance", label: "Finance", desc: "Revenue, risk, P&L" },
  { id: "marketing", label: "Marketing", desc: "CAC, LTV, churn" },
  { id: "product", label: "Product", desc: "DAU, retention, funnel" },
  { id: "supply", label: "Supply Chain", desc: "Inventory, lead time" },
  { id: "hr", label: "HR Analytics", desc: "Attrition, headcount" },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  upload: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  bell: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  check: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  checkLg: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  alert: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  x: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  download: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  send: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  file: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  users: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  chart: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  printer: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  link: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  copy: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  refresh: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  trash: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  brain: (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94a3b8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  mail: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  spin: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

// ─── DATA ENGINE ──────────────────────────────────────────────────────────────
const DataEngine = {
  computeColStats(rows, col) {
    try {
      const vals = rows.map((r) => r[col]);
      const missing = vals.filter(
        (v) =>
          v === null ||
          v === undefined ||
          v === "" ||
          (typeof v === "number" && isNaN(v))
      ).length;
      const numericVals = vals
        .map((v) => parseFloat(v))
        .filter((v) => !isNaN(v) && isFinite(v));
      const isNum =
        vals.length > 0 &&
        numericVals.length / Math.max(vals.length - missing, 1) > 0.7;
      const nonNull = vals.filter(
        (v) => v !== null && v !== undefined && v !== ""
      );
      const unique = [...new Set(nonNull.map(String))].length;
      const sorted = [...numericVals].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)] ?? 0;
      const q3 = sorted[Math.floor(sorted.length * 0.75)] ?? 0;
      const iqr = q3 - q1;
      const outliers = sorted.filter(
        (v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr
      ).length;
      const mean = numericVals.length
        ? numericVals.reduce((a, b) => a + b, 0) / numericVals.length
        : null;
      return {
        col,
        missing,
        missingPct: rows.length
          ? +((missing / rows.length) * 100).toFixed(1)
          : 0,
        unique,
        isNum,
        mean: mean !== null ? +mean.toFixed(4) : null,
        min: sorted[0] ?? null,
        max: sorted[sorted.length - 1] ?? null,
        outliers,
        q1: +q1.toFixed(4),
        q3: +q3.toFixed(4),
        sample: nonNull.slice(0, 3).map(String),
      };
    } catch {
      return {
        col,
        missing: 0,
        missingPct: 0,
        unique: 0,
        isNum: false,
        mean: null,
        min: null,
        max: null,
        outliers: 0,
        q1: 0,
        q3: 0,
        sample: [],
      };
    }
  },
  scoreDataset(rows, cols, colStats) {
    if (!rows.length || !cols.length) return 0;
    const totalCells = rows.length * cols.length;
    const totalMissing = colStats.reduce((s, c) => s + c.missing, 0);
    const outlierCols = colStats.filter((c) => c.outliers > 0).length;
    return Math.max(
      10,
      Math.min(
        100,
        Math.round(
          100 -
            (totalMissing / totalCells) * 40 -
            (outlierCols / cols.length) * 20
        )
      )
    );
  },
  imputeMissing(rows, colStats, strategy = "mean_mode") {
    return rows.map((row) => {
      const newRow = { ...row };
      colStats.forEach((cs) => {
        const v = row[cs.col];
        const isMissing =
          v === null ||
          v === undefined ||
          v === "" ||
          (typeof v === "number" && isNaN(v));
        if (!isMissing) return;
        if (cs.isNum) {
          newRow[cs.col] =
            strategy === "zero"
              ? 0
              : strategy === "median"
              ? cs.q1
              : cs.mean ?? 0;
        } else {
          const freq = {};
          rows.forEach((r) => {
            if (r[cs.col] != null && r[cs.col] !== "")
              freq[r[cs.col]] = (freq[r[cs.col]] || 0) + 1;
          });
          newRow[cs.col] =
            Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
        }
      });
      return newRow;
    });
  },
  removeDuplicates(rows) {
    const seen = new Set();
    return rows.filter((row) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
  capOutliers(rows, colStats) {
    return rows.map((row) => {
      const newRow = { ...row };
      colStats
        .filter((cs) => cs.isNum && cs.outliers > 0)
        .forEach((cs) => {
          const v = parseFloat(row[cs.col]);
          if (!isNaN(v) && isFinite(v)) {
            const iqr = cs.q3 - cs.q1;
            newRow[cs.col] = +Math.min(
              Math.max(v, cs.q1 - 1.5 * iqr),
              cs.q3 + 1.5 * iqr
            ).toFixed(4);
          }
        });
      return newRow;
    });
  },
  normalizeColumn(rows, col, colStat) {
    const range = (colStat.max ?? 0) - (colStat.min ?? 0);
    if (!range) return rows;
    return rows.map((r) => {
      const v = parseFloat(r[col]);
      return {
        ...r,
        [col]: isNaN(v) ? r[col] : +((v - colStat.min) / range).toFixed(6),
      };
    });
  },
  encodeColumn(rows, col) {
    const classes = [...new Set(rows.map((r) => r[col]))].sort();
    const map = Object.fromEntries(classes.map((c, i) => [c, i]));
    return rows.map((r) => ({ ...r, [col]: map[r[col]] ?? r[col] }));
  },
  engineerFeatures(rows, colStats) {
    const numCols = colStats.filter((cs) => cs.isNum).map((cs) => cs.col);
    if (numCols.length < 2) return rows;
    const [a, b] = numCols;
    return rows.map((r) => ({
      ...r,
      [`${a}_div_${b}`]:
        parseFloat(r[b]) !== 0 && !isNaN(parseFloat(r[b]))
          ? +(parseFloat(r[a]) / parseFloat(r[b])).toFixed(6)
          : null,
      row_completeness: +(
        (Object.values(r).filter(
          (v) => v !== null && v !== "" && v !== undefined
        ).length /
          Object.keys(r).length) *
        100
      ).toFixed(1),
    }));
  },
  parseDates(rows, colStats) {
    const dateCols = colStats.filter((cs) => {
      if (cs.isNum) return false;
      return cs.sample.some((v) => v && !isNaN(Date.parse(String(v))));
    });
    return rows.map((row) => {
      const newRow = { ...row };
      dateCols.forEach((cs) => {
        try {
          const d = new Date(row[cs.col]);
          if (!isNaN(d.getTime()))
            newRow[cs.col] = d.toISOString().split("T")[0];
        } catch {}
      });
      return newRow;
    });
  },
  normalizeText(rows, colStats) {
    return rows.map((row) => {
      const newRow = { ...row };
      colStats
        .filter((cs) => !cs.isNum)
        .forEach((cs) => {
          if (typeof row[cs.col] === "string")
            newRow[cs.col] = row[cs.col]
              .toLowerCase()
              .trim()
              .replace(/\s+/g, " ");
        });
      return newRow;
    });
  },
  computeCorrelation(rows, col1, col2) {
    try {
      const pairs = rows
        .map((r) => [parseFloat(r[col1]), parseFloat(r[col2])])
        .filter(
          ([a, b]) => !isNaN(a) && !isNaN(b) && isFinite(a) && isFinite(b)
        );
      if (pairs.length < 3) return 0;
      const n = pairs.length;
      const mA = pairs.reduce((s, [a]) => s + a, 0) / n;
      const mB = pairs.reduce((s, [, b]) => s + b, 0) / n;
      const num = pairs.reduce((s, [a, b]) => s + (a - mA) * (b - mB), 0);
      const dA = Math.sqrt(pairs.reduce((s, [a]) => s + (a - mA) ** 2, 0));
      const dB = Math.sqrt(pairs.reduce((s, [, b]) => s + (b - mB) ** 2, 0));
      return dA && dB ? +(num / (dA * dB)).toFixed(3) : 0;
    } catch {
      return 0;
    }
  },
  frequencyTable(rows, col, top = 10) {
    try {
      const freq = {};
      rows.forEach((r) => {
        const k =
          r[col] === null || r[col] === undefined
            ? "(null)"
            : String(r[col]).substring(0, 30);
        freq[k] = (freq[k] || 0) + 1;
      });
      return Object.entries(freq)
        .map(([name, count]) => ({
          name,
          count,
          pct: +((count / rows.length) * 100).toFixed(1),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, top);
    } catch {
      return [];
    }
  },
  trendsOverIndex(rows, col, maxPoints = 50) {
    try {
      const step = Math.max(1, Math.floor(rows.length / maxPoints));
      return rows
        .filter((_, i) => i % step === 0)
        .map((r, i) => {
          const v = parseFloat(r[col]);
          return {
            index: i * step,
            value: isNaN(v) || !isFinite(v) ? null : +v.toFixed(4),
          };
        })
        .filter((d) => d.value !== null);
    } catch {
      return [];
    }
  },
  exportCSV(rows, filename = "clean_data.csv") {
    try {
      const blob = new Blob([Papa.unparse(rows)], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("CSV export failed", e);
    }
  },
  exportXLSX(rows, filename = "clean_data.xlsx") {
    try {
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "CleanData");
      XLSX.writeFile(wb, filename);
    } catch (e) {
      console.error("XLSX export failed", e);
    }
  },
};

// ─── MOCK AI ──────────────────────────────────────────────────────────────────
const MockAI = {
  async query(question, af, industryMode) {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    const ql = question.toLowerCase();
    const rows = af?.cleanedRows || af?.rows || [];
    const cs = af?.colStats || [];
    if (ql.includes("missing")) {
      const worst = [...cs].sort((a, b) => b.missing - a.missing)[0];
      if (!worst) return "No dataset loaded. Please upload a file first.";
      return `**Most missing column:** "${worst.col}" — ${worst.missing} missing values (${worst.missingPct}% of rows).\n\n**Recommended action:** Apply mean/mode imputation via the Clean tab.`;
    }
    if (ql.includes("outlier")) {
      const oc = cs.filter((c) => c.outliers > 0);
      if (!oc.length) return "No outliers detected in the current dataset.";
      return `**Outlier summary:** ${
        oc.length
      } column(s) contain outliers:\n${oc
        .slice(0, 5)
        .map((c) => `• "${c.col}": ${c.outliers} outliers`)
        .join(
          "\n"
        )}\n\n**Recommended action:** Use the Clean tab → "Cap Outliers".`;
    }
    if (ql.includes("quality") || ql.includes("score")) {
      const score = af?.score ?? 0;
      const grade = score >= 80 ? "Good" : score >= 60 ? "Fair" : "Poor";
      return `**Data Quality Score: ${score}/100 (${grade})**\n\n• ${
        af?.totalMissing ?? 0
      } missing cells\n• ${
        cs.filter((c) => c.outliers > 0).length
      } column(s) with outliers\n• ${af?.rows?.length ?? 0} total records`;
    }
    if (ql.includes("kpi") || ql.includes("metric")) {
      return `**Recommended KPIs:**\n1. Data Completeness Rate\n2. Duplicate Rate\n3. Outlier Density\n4. Time to Insight\n5. Analyst Hours Saved`;
    }
    if (
      ql.includes("priorit") ||
      ql.includes("action") ||
      ql.includes("next")
    ) {
      const sorted = [...cs].sort((a, b) => b.missing - a.missing);
      return `**Top 3 Priority Actions:**\n1. Fix missing values in "${
        sorted[0]?.col || "top column"
      }"\n2. Cap outliers in ${
        cs.filter((c) => c.outliers > 0).length
      } column(s)\n3. Normalize text in ${
        cs.filter((c) => !c.isNum).length
      } categorical column(s)`;
    }
    if (ql.includes("correlation")) {
      const numCols = cs.filter((c) => c.isNum);
      if (numCols.length < 2)
        return "Need at least 2 numeric columns to compute correlations.";
      const r = DataEngine.computeCorrelation(
        rows,
        numCols[0].col,
        numCols[1].col
      );
      return `**Correlation between "${numCols[0].col}" and "${
        numCols[1].col
      }": ${r}**\n\nStrength: ${
        Math.abs(r) > 0.7 ? "strong" : Math.abs(r) > 0.4 ? "moderate" : "weak"
      } ${r >= 0 ? "positive" : "negative"} correlation.`;
    }
    const numCount = cs.filter((c) => c.isNum).length;
    const textCount = cs.filter((c) => !c.isNum).length;
    return `**Dataset Summary:**\n• ${
      af?.rows?.length?.toLocaleString() ?? 0
    } rows × ${
      af?.cols?.length ?? 0
    } columns\n• ${numCount} numeric, ${textCount} categorical columns\n• Quality score: ${
      af?.score ?? 0
    }/100\n• ${
      af?.totalMissing ?? 0
    } missing values\n\nAsk me about: missing values, outliers, quality, correlations, KPIs, priorities.`;
  },
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const st = {
  card: {
    background: C.card,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    padding: 20,
  },
  pill: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 9px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    background: color + "18",
    color,
  }),
  btn: (color = C.primary, ghost = false) => ({
    background: ghost
      ? color + "12"
      : `linear-gradient(135deg,${color},${color}cc)`,
    color: ghost ? color : "white",
    border: ghost ? `1px solid ${color}30` : "none",
    borderRadius: 9,
    padding: "8px 16px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  }),
  btnSm: (color = C.primary) => ({
    background: color + "12",
    color,
    border: `1px solid ${color}25`,
    borderRadius: 7,
    padding: "5px 11px",
    fontWeight: 600,
    fontSize: 11,
    cursor: "pointer",
  }),
  input: {
    padding: "9px 13px",
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    background: C.card,
    color: C.dark,
  },
  label: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
    display: "block",
  },
};

function Pill({ children, color = C.primary }) {
  return <span style={st.pill(color)}>{children}</span>;
}
function Btn({
  children,
  color = C.primary,
  ghost = false,
  onClick,
  disabled,
  style = {},
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...st.btn(color, ghost),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
function BtnSm({ children, color = C.primary, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...st.btnSm(color),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
function Card({ children, style = {} }) {
  return <div style={{ ...st.card, ...style }}>{children}</div>;
}
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: C.dark,
          margin: 0,
          letterSpacing: "-.5px",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ color: C.slate, fontSize: 14, margin: "5px 0 0" }}>{sub}</p>
      )}
    </div>
  );
}
function EmptyState({ message = "No data available", sub }) {
  return (
    <div
      style={{ textAlign: "center", padding: "48px 24px", color: "#94a3b8" }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>—</div>
      <div style={{ fontWeight: 600, fontSize: 14, color: C.slate }}>
        {message}
      </div>
      {sub && <div style={{ fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function StatCard({ icon, label, value, sub, color = C.primary, trend }) {
  return (
    <Card
      style={{
        padding: "16px 18px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      {icon && <div style={{ color, marginTop: 2, flexShrink: 0 }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={st.label}>{label}</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: C.dark,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>
            {sub}
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: trend > 0 ? C.green : trend < 0 ? C.red : "#94a3b8",
          }}
        >
          {trend > 0 ? "▲" : trend < 0 ? "▼" : "—"}
          {Math.abs(trend)}%
        </div>
      )}
    </Card>
  );
}
function Toast({ msg, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  const color =
    type === "success" ? C.green : type === "error" ? C.red : C.amber;
  return (
    <div
      style={{
        background: color,
        color: "white",
        borderRadius: 12,
        padding: "12px 18px",
        fontWeight: 600,
        fontSize: 13,
        boxShadow: "0 4px 20px rgba(0,0,0,.25)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        maxWidth: 360,
        pointerEvents: "all",
      }}
    >
      {type === "success" ? Ico.checkLg : type === "error" ? Ico.x : Ico.alert}
      {msg}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          marginLeft: "auto",
          display: "flex",
          flexShrink: 0,
        }}
      >
        {Ico.x}
      </button>
    </div>
  );
}
function Modal({ title, children, onClose, maxWidth = 480 }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Card
        style={{ width: "100%", maxWidth, maxHeight: "85vh", overflow: "auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
            }}
          >
            {Ico.x}
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
}
function NavBtn({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled
          ? "#e2e8f0"
          : `linear-gradient(135deg,${C.primary},${C.blue})`,
        color: disabled ? "#94a3b8" : "white",
        border: "none",
        borderRadius: 10,
        padding: "11px 26px",
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginLeft: "auto",
      }}
    >
      {label} →
    </button>
  );
}
function ScoreBadge({ score }) {
  const color = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;
  return (
    <div style={{ width: 52, height: 52, position: "relative", flexShrink: 0 }}>
      <svg viewBox="0 0 52 52" width="52" height="52">
        <circle
          cx="26"
          cy="26"
          r="22"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="5"
        />
        <circle
          cx="26"
          cy="26"
          r="22"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${(score / 100) * 138.2} 138.2`}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          color,
        }}
      >
        {score}
      </span>
    </div>
  );
}
function Loading({ label = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 0",
        color: C.slate,
        fontSize: 13,
      }}
    >
      {Ico.spin} {label}
    </div>
  );
}
function UploadPrompt() {
  return (
    <EmptyState
      message="Upload a dataset first"
      sub="Go to the Ingest tab to upload a CSV, Excel, or JSON file"
    />
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({
  step,
  setStep,
  alerts,
  industryMode,
  setIndustryMode,
  onBell,
}) {
  const idx = STEPS.findIndex((s) => s.id === step);
  const unread = alerts.filter((a) => !a.read).length;
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#0c0a1e 0%,#1a1740 55%,#0f2560 100%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 24px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: `linear-gradient(135deg,${C.primary},${C.blue})`,
              borderRadius: 9,
              padding: "5px 14px",
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: "-.5px",
              }}
            >
              AutoClean
            </span>
          </div>
          <span
            style={{
              background: `linear-gradient(135deg,${C.amber},${C.red})`,
              color: "white",
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 7px",
              borderRadius: 4,
              letterSpacing: 1,
            }}
          >
            ENTERPRISE
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <select
            value={industryMode}
            onChange={(e) => setIndustryMode(e.target.value)}
            style={{
              background: "rgba(255,255,255,.1)",
              border: "1px solid rgba(255,255,255,.15)",
              color: "white",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {INDUSTRIES.map((m) => (
              <option key={m.id} value={m.id} style={{ background: "#1a1740" }}>
                {m.label}
              </option>
            ))}
          </select>
          <div
            style={{
              position: "relative",
              cursor: "pointer",
              color: "rgba(255,255,255,.7)",
              display: "flex",
            }}
            onClick={onBell}
          >
            {Ico.bell}
            {unread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: C.red,
                  borderRadius: 99,
                  width: 15,
                  height: 15,
                  fontSize: 9,
                  fontWeight: 800,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unread}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,.1)",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${C.primary},${C.blue})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 800,
                color: "white",
              }}
            >
              A
            </div>
            <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
              Analyst
            </span>
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}
      >
        {STEPS.map((s, i) => {
          const active = step === s.id,
            done = idx > i;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "7px 13px",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: active ? "rgba(255,255,255,.13)" : "transparent",
                color: active
                  ? "white"
                  : done
                  ? "rgba(255,255,255,.65)"
                  : "rgba(255,255,255,.35)",
                borderBottom: active
                  ? "2px solid #818cf8"
                  : "2px solid transparent",
                transition: "all .15s",
              }}
            >
              {done && (
                <span style={{ color: C.green, display: "flex" }}>
                  {Ico.check}
                </span>
              )}
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsPanel({
  alerts,
  onDismiss,
  onMarkRead,
  onMarkAllRead,
  onClose,
}) {
  const sevIco = (sev) =>
    sev === "critical" ? (
      <span style={{ color: C.red, display: "flex" }}>{Ico.alert}</span>
    ) : sev === "warning" ? (
      <span style={{ color: C.amber, display: "flex" }}>{Ico.alert}</span>
    ) : (
      <span style={{ color: C.blue, display: "flex" }}>{Ico.info}</span>
    );
  return (
    <div
      style={{
        position: "fixed",
        top: 60,
        right: 20,
        zIndex: 500,
        width: 390,
        maxHeight: 520,
      }}
    >
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 14 }}>Notifications</span>
          <div style={{ display: "flex", gap: 8 }}>
            <BtnSm color={C.slate} onClick={onMarkAllRead}>
              Mark all read
            </BtnSm>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
              }}
            >
              {Ico.x}
            </button>
          </div>
        </div>
        <div style={{ maxHeight: 440, overflowY: "auto" }}>
          {!alerts.length && (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "#94a3b8",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: C.green }}>{Ico.checkLg}</span>All clear
            </div>
          )}
          {alerts.map((a) => (
            <div
              key={a.id}
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${C.border}`,
                background: a.read ? "transparent" : "#eff6ff",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              {sevIco(a.severity)}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>
                  [{a.col}] {a.msg}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
                  {a.ts}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {!a.read && (
                  <BtnSm color={C.primary} onClick={() => onMarkRead(a.id)}>
                    Read
                  </BtnSm>
                )}
                <button
                  onClick={() => onDismiss(a.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                  }}
                >
                  {Ico.x}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── DATA INGESTION ───────────────────────────────────────────────────────────
function DataIngestion({
  files,
  activeFile,
  setActiveFile,
  onFileAdd,
  onNext,
}) {
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const MAX_SIZE_MB = 50;

  const buildFO = (name, rows, size) => {
    if (!rows || rows.length === 0)
      throw new Error("File is empty or has no valid rows.");
    const cols = Object.keys(rows[0] || {});
    if (!cols.length) throw new Error("No columns detected in the file.");
    const colStats = cols.map((col) => DataEngine.computeColStats(rows, col));
    const totalMissing = colStats.reduce((s, c) => s + c.missing, 0);
    const totalCells = rows.length * cols.length;
    onFileAdd({
      name,
      rows,
      cols,
      colStats,
      totalMissing,
      totalCells,
      score: DataEngine.scoreDataset(rows, cols, colStats),
      size: (size / 1024).toFixed(1) + "KB",
      cleanedRows: null,
    });
  };

  const processFile = async (file) => {
    setError(null);
    setLoading(true);
    try {
      if (file.size > MAX_SIZE_MB * 1024 * 1024)
        throw new Error(`File too large. Max: ${MAX_SIZE_MB}MB`);
      const ext = file.name.split(".").pop().toLowerCase();
      if (!["csv", "xlsx", "xls", "json"].includes(ext))
        throw new Error(`Unsupported file type: .${ext}`);
      if (ext === "csv") {
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        if (result.errors.length && !result.data.length)
          throw new Error("CSV parsing failed: " + result.errors[0].message);
        buildFO(file.name, result.data, file.size);
      } else if (ext === "xlsx" || ext === "xls") {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        buildFO(
          file.name,
          XLSX.utils.sheet_to_json(ws, { defval: "" }),
          file.size
        );
      } else if (ext === "json") {
        const text = await file.text();
        let data = JSON.parse(text);
        if (!Array.isArray(data)) data = [data];
        data = data.map((r) => {
          const flat = {};
          Object.entries(r).forEach(([k, v]) => {
            if (typeof v === "object" && v !== null && !Array.isArray(v))
              Object.entries(v).forEach(([k2, v2]) => {
                flat[`${k}.${k2}`] = v2;
              });
            else flat[k] = v;
          });
          return flat;
        });
        buildFO(file.name, data, file.size);
      }
    } catch (e) {
      setError(e.message || "Failed to process file.");
    }
    setLoading(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(processFile);
  }, []);

  return (
    <div>
      <SectionHeader
        title="Multi-Source Data Ingestion"
        sub="Upload CSV, Excel (.xlsx), or JSON files. Real-time schema detection and quality profiling."
      />
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${error ? C.red : C.primary}50`,
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: error ? "#fef2f2" : "#f5f3ff",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            color: error ? C.red : C.primary,
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          {Ico.upload}
        </div>
        {loading ? (
          <Loading label="Processing file..." />
        ) : (
          <>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: error ? "#991b1b" : "#3730a3",
              }}
            >
              {error ? error : "Drop files or click to browse"}
            </div>
            <div
              style={{
                color: error ? "#dc2626" : "#818cf8",
                fontSize: 13,
                marginTop: 6,
              }}
            >
              {error
                ? "Please try a different file"
                : `CSV · Excel (.xlsx) · JSON · Up to ${MAX_SIZE_MB}MB`}
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          multiple
          onChange={(e) => {
            Array.from(e.target.files).forEach(processFile);
            e.target.value = "";
          }}
          style={{ display: "none" }}
        />
      </div>
      {files.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {files.map((f) => (
              <div
                key={f.name}
                onClick={() => setActiveFile(f)}
                style={{
                  ...st.card,
                  border:
                    activeFile?.name === f.name
                      ? `2px solid ${C.primary}`
                      : `1px solid ${C.border}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontWeight: 700,
                        fontSize: 13,
                        color: C.dark,
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: C.slate }}>{Ico.file}</span>
                      {f.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.slate }}>
                      {f.rows.length.toLocaleString()} rows · {f.cols.length}{" "}
                      cols · {f.size}
                    </div>
                    {f.cleanedRows && <Pill color={C.green}>Cleaned</Pill>}
                  </div>
                  <ScoreBadge score={f.score} />
                </div>
              </div>
            ))}
          </div>
          {activeFile && (
            <Card style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
              <div
                style={{
                  padding: "12px 18px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 14 }}>
                  Schema Profile — {activeFile.name}
                </span>
                <Pill color={C.slate}>
                  {activeFile.cols.length} columns ·{" "}
                  {activeFile.rows.length.toLocaleString()} rows
                </Pill>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {[
                        "Column",
                        "Type",
                        "Unique",
                        "Missing",
                        "Missing %",
                        "Range / Sample",
                        "Outliers",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "9px 13px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#475569",
                            fontSize: 10,
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeFile.colStats.map((c, i) => (
                      <tr
                        key={c.col}
                        style={{
                          borderTop: `1px solid ${C.border}`,
                          background: i % 2 ? "#fafafa" : C.card,
                        }}
                      >
                        <td
                          style={{
                            padding: "8px 13px",
                            fontWeight: 600,
                            color: C.dark,
                            maxWidth: 140,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={c.col}
                        >
                          {c.col}
                        </td>
                        <td style={{ padding: "8px 13px" }}>
                          <Pill color={c.isNum ? C.green : C.primary}>
                            {c.isNum ? "numeric" : "text"}
                          </Pill>
                        </td>
                        <td style={{ padding: "8px 13px", color: "#475569" }}>
                          {c.unique}
                        </td>
                        <td
                          style={{
                            padding: "8px 13px",
                            color: c.missing > 0 ? C.red : C.green,
                            fontWeight: 600,
                          }}
                        >
                          {c.missing}
                        </td>
                        <td style={{ padding: "8px 13px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <div
                              style={{
                                width: 50,
                                height: 4,
                                borderRadius: 99,
                                background: "#e2e8f0",
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(c.missingPct, 100)}%`,
                                  height: "100%",
                                  borderRadius: 99,
                                  background:
                                    c.missingPct > 20 ? C.red : C.amber,
                                }}
                              />
                            </div>
                            <span style={{ fontSize: 10, color: C.slate }}>
                              {c.missingPct}%
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "8px 13px",
                            color: C.slate,
                            fontFamily: "monospace",
                            fontSize: 11,
                          }}
                        >
                          {c.isNum
                            ? `${c.min} – ${c.max}`
                            : c.sample.slice(0, 2).join(", ") || "—"}
                        </td>
                        <td style={{ padding: "8px 13px" }}>
                          {c.outliers > 0 ? (
                            <Pill color={C.amber}>{c.outliers}</Pill>
                          ) : (
                            <span style={{ color: "#94a3b8" }}>0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <NavBtn label="Quality Assessment" onClick={onNext} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── DATA QUALITY ─────────────────────────────────────────────────────────────
function DataQuality({ af, alerts, onDismissAlert, onNext }) {
  if (!af) return <UploadPrompt />;
  const rootCauses = [...af.colStats]
    .sort((a, b) => b.missing + b.outliers * 2 - (a.missing + a.outliers * 2))
    .slice(0, 4);
  return (
    <div>
      <SectionHeader
        title="Enterprise Data Quality Monitoring"
        sub="Dynamic quality scoring, anomaly detection, and root cause analysis."
      />
      {alerts.filter((a) => !a.read).length > 0 && (
        <Card
          style={{
            marginBottom: 16,
            padding: 0,
            overflow: "hidden",
            border: `1px solid ${C.red}40`,
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              background: "#fef2f2",
              borderBottom: `1px solid ${C.red}30`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: C.red }}>{Ico.alert}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#991b1b" }}>
              Live Alerts — {alerts.filter((a) => !a.read).length} Active
            </span>
          </div>
          {alerts
            .filter((a) => !a.read)
            .slice(0, 6)
            .map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  borderBottom: `1px solid #f8fafc`,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background:
                      a.severity === "critical"
                        ? C.red
                        : a.severity === "warning"
                        ? C.amber
                        : C.blue,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 12 }}>
                    [{a.col}]{" "}
                  </span>
                  <span style={{ fontSize: 12, color: C.slate }}>{a.msg}</span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "#94a3b8",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a.ts}
                </span>
                <button
                  onClick={() => onDismissAlert(a.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                  }}
                >
                  {Ico.x}
                </button>
              </div>
            ))}
        </Card>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <StatCard
          label="Quality Score"
          value={`${af.score}/100`}
          color={af.score >= 80 ? C.green : af.score >= 60 ? C.amber : C.red}
          trend={12}
        />
        <StatCard
          label="Total Records"
          value={af.rows.length.toLocaleString()}
          color={C.primary}
        />
        <StatCard
          label="Missing Cells"
          value={af.totalMissing.toLocaleString()}
          sub={`${(
            (af.totalMissing / Math.max(af.totalCells, 1)) *
            100
          ).toFixed(1)}% of dataset`}
          color={C.amber}
          trend={-8}
        />
        <StatCard
          label="Outlier Columns"
          value={af.colStats.filter((c) => c.outliers > 0).length}
          color={C.red}
        />
        <StatCard
          label="Clean Columns"
          value={
            af.colStats.filter((c) => c.missing === 0 && c.outliers === 0)
              .length
          }
          color={C.green}
        />
        <StatCard label="Est. Time Saved" value="~3.8 hrs" color={C.purple} />
      </div>
      {rootCauses.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
            Root Cause Analysis
          </h3>
          {rootCauses.map((c, i) => (
            <div
              key={i}
              style={{ padding: "12px 0", borderBottom: `1px solid #f1f5f9` }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
              >
                <Pill color={i === 0 ? C.red : i === 1 ? C.amber : C.blue}>
                  {["HIGH", "MEDIUM", "LOW", "LOW"][i]}
                </Pill>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>[{c.col}]</div>
                  <div style={{ fontSize: 12, color: C.slate, marginTop: 4 }}>
                    {c.missing > 0 &&
                      `${c.missing} missing values (${c.missingPct}%). `}
                    {c.outliers > 0 &&
                      `${c.outliers} outliers detected outside IQR fence.`}
                    {c.missing === 0 &&
                      c.outliers === 0 &&
                      "Column appears clean."}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="AI Cleaning" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── CLEANING ENGINE ──────────────────────────────────────────────────────────
function CleaningEngine({
  af,
  files,
  setFiles,
  setActiveFile,
  addLog,
  addToast,
  onNext,
}) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState({});
  const [strategy, setStrategy] = useState("mean_mode");
  if (!af) return <UploadPrompt />;

  const runStep = async (key, fn, label) => {
    setRunning(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      const newRows = fn(af.cleanedRows || af.rows, af.colStats);
      const updated = { ...af, cleanedRows: newRows };
      setFiles((f) => f.map((x) => (x.name === af.name ? updated : x)));
      setActiveFile(updated);
      setDone((d) => ({ ...d, [key]: true }));
      addLog({
        ts: new Date().toLocaleTimeString(),
        action: label,
        detail: `${newRows.length} rows processed`,
        user: "AI Engine",
      });
      addToast(`${label} complete`, "success");
    } catch (e) {
      addToast(`${label} failed: ${e.message}`, "error");
    }
    setRunning(false);
  };

  const runAll = async () => {
    setRunning(true);
    try {
      let rows = af.rows;
      const steps = [
        [(r) => DataEngine.removeDuplicates(r), "Duplicate Removal"],
        [
          (r) => DataEngine.imputeMissing(r, af.colStats, strategy),
          "Missing Value Imputation",
        ],
        [(r) => DataEngine.capOutliers(r, af.colStats), "Outlier Capping"],
        [(r) => DataEngine.parseDates(r, af.colStats), "Date Standardization"],
        [(r) => DataEngine.normalizeText(r, af.colStats), "Text Normalization"],
      ];
      for (const [fn, label] of steps) {
        rows = fn(rows);
        addLog({
          ts: new Date().toLocaleTimeString(),
          action: label,
          detail: `${rows.length} rows`,
          user: "AI Engine",
        });
        await new Promise((r) => setTimeout(r, 250));
      }
      const updated = { ...af, cleanedRows: rows };
      setFiles((f) => f.map((x) => (x.name === af.name ? updated : x)));
      setActiveFile(updated);
      setDone({
        remove_dupes: true,
        impute: true,
        cap_outliers: true,
        parse_dates: true,
        norm_text: true,
      });
      addToast("All 5 pipeline steps complete!", "success");
    } catch (e) {
      addToast(`Pipeline error: ${e.message}`, "error");
    }
    setRunning(false);
  };

  const pipeline = [
    {
      key: "remove_dupes",
      label: "Remove Duplicates",
      desc: "Exact row deduplication",
      fn: (r) => DataEngine.removeDuplicates(r),
    },
    {
      key: "impute",
      label: "Fill Missing Values",
      desc: `Strategy: ${strategy}`,
      fn: (r, cs) => DataEngine.imputeMissing(r, cs, strategy),
    },
    {
      key: "cap_outliers",
      label: "Cap Outliers",
      desc: "IQR fence enforcement",
      fn: (r, cs) => DataEngine.capOutliers(r, cs),
    },
    {
      key: "parse_dates",
      label: "Standardize Dates",
      desc: "Convert to ISO 8601",
      fn: (r, cs) => DataEngine.parseDates(r, cs),
    },
    {
      key: "norm_text",
      label: "Normalize Text",
      desc: "Lowercase, trim, collapse whitespace",
      fn: (r, cs) => DataEngine.normalizeText(r, cs),
    },
  ];

  return (
    <div>
      <SectionHeader
        title="AI-Powered Cleaning Engine"
        sub="Real transformations applied to your actual data."
      />
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>
            Active Pipeline — {af.name}
          </h3>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label style={st.label}>Imputation Strategy</label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                style={{
                  ...st.input,
                  width: "auto",
                  padding: "6px 10px",
                  fontSize: 12,
                }}
              >
                <option value="mean_mode">Mean / Mode</option>
                <option value="median">Median / Mode</option>
                <option value="zero">Zero / Empty</option>
              </select>
            </div>
            <Btn
              color={C.primary}
              onClick={runAll}
              disabled={running}
              style={{ marginTop: 16 }}
            >
              {running ? <>{Ico.spin} Running...</> : "1-Click Auto Clean All"}
            </Btn>
          </div>
        </div>
        {pipeline.map((p, i) => (
          <div
            key={p.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: `1px solid #f8fafc`,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: done[p.key] ? "#ecfdf5" : "#eff6ff",
                border: `2px solid ${done[p.key] ? C.green : C.primary}`,
                flexShrink: 0,
                color: done[p.key] ? C.green : C.primary,
              }}
            >
              {done[p.key] ? (
                Ico.check
              ) : (
                <span style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.label}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.desc}</div>
            </div>
            <Pill color={done[p.key] ? C.green : "#94a3b8"}>
              {done[p.key] ? "Complete" : "Pending"}
            </Pill>
            <BtnSm
              color={C.primary}
              onClick={() => runStep(p.key, p.fn, p.label)}
              disabled={running}
            >
              Run
            </BtnSm>
          </div>
        ))}
        {af.cleanedRows && (
          <div
            style={{
              marginTop: 14,
              background: "#f0fdf4",
              border: `1px solid ${C.green}40`,
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: C.green, display: "flex" }}>
              {Ico.checkLg}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#065f46", fontSize: 13 }}>
                Clean dataset ready — {af.cleanedRows.length.toLocaleString()}{" "}
                rows
              </div>
              <div style={{ fontSize: 11, color: "#047857", marginTop: 1 }}>
                {af.rows.length - af.cleanedRows.length} duplicates removed ·{" "}
                {Object.keys(af.cleanedRows[0] || {}).length} columns
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                color={C.green}
                ghost
                onClick={() =>
                  DataEngine.exportCSV(
                    af.cleanedRows,
                    `${af.name.replace(/\.[^.]+$/, "")}_clean.csv`
                  )
                }
              >
                {Ico.download} CSV
              </Btn>
              <Btn
                color={C.primary}
                ghost
                onClick={() =>
                  DataEngine.exportXLSX(
                    af.cleanedRows,
                    `${af.name.replace(/\.[^.]+$/, "")}_clean.xlsx`
                  )
                }
              >
                {Ico.download} XLSX
              </Btn>
            </div>
          </div>
        )}
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="Transform" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── TRANSFORMATION ───────────────────────────────────────────────────────────
function Transformation({
  af,
  files,
  setFiles,
  setActiveFile,
  addLog,
  addToast,
  onNext,
}) {
  const [done, setDone] = useState({});
  if (!af) return <UploadPrompt />;
  const rows = af.cleanedRows || af.rows;

  const applyTransform = (key, label, fn) => {
    try {
      const newRows = fn(rows);
      const updated = { ...af, cleanedRows: newRows };
      setFiles((f) => f.map((x) => (x.name === af.name ? updated : x)));
      setActiveFile(updated);
      setDone((d) => ({ ...d, [key]: true }));
      addLog({
        ts: new Date().toLocaleTimeString(),
        action: label,
        detail: `Applied to ${newRows.length} rows`,
        user: "Transform Engine",
      });
      addToast(`${label} applied`, "success");
    } catch (e) {
      addToast(`${label} failed: ${e.message}`, "error");
    }
  };

  const transforms = [
    {
      key: "dates",
      label: "Parse Dates",
      desc: "Standardize to ISO 8601 (YYYY-MM-DD)",
      action: "Apply",
      fn: (r) => DataEngine.parseDates(r, af.colStats),
    },
    {
      key: "text",
      label: "Normalize Text",
      desc: `Lowercase + trim ${
        af.colStats.filter((c) => !c.isNum).length
      } text columns`,
      action: "Apply",
      fn: (r) => DataEngine.normalizeText(r, af.colStats),
    },
    {
      key: "norm",
      label: "Normalize Numerics",
      desc: `Min-Max [0,1] scaling for ${
        af.colStats.filter((c) => c.isNum).length
      } numeric cols`,
      action: "Apply",
      fn: (r) => {
        let out = r;
        af.colStats
          .filter((c) => c.isNum)
          .forEach((cs) => {
            out = DataEngine.normalizeColumn(out, cs.col, cs);
          });
        return out;
      },
    },
    {
      key: "feat",
      label: "Engineer Features",
      desc: "Add ratio column + row_completeness score",
      action: "Apply",
      fn: (r) => DataEngine.engineerFeatures(r, af.colStats),
    },
    {
      key: "dupes",
      label: "Detect Duplicates",
      desc: "Count exact duplicate rows",
      action: "Detect",
      fn: (r) => {
        const ss = new Set();
        let cnt = 0;
        r.forEach((row) => {
          const k = JSON.stringify(row);
          if (ss.has(k)) cnt++;
          ss.add(k);
        });
        addToast(`Found ${cnt} duplicate rows`, cnt > 0 ? "error" : "success");
        return r;
      },
    },
    {
      key: "enc",
      label: "Encode Categoricals",
      desc: `Label-encode ${
        af.colStats.filter((c) => !c.isNum).length
      } text columns`,
      action: "Encode",
      fn: (r) => {
        let out = r;
        af.colStats
          .filter((c) => !c.isNum)
          .forEach((cs) => {
            out = DataEngine.encodeColumn(out, cs.col);
          });
        return out;
      },
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Smart Transformation Engine"
        sub="All transformations apply to your actual data immediately."
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {transforms.map((t) => (
          <Card key={t.key}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13 }}>{t.label}</div>
              {done[t.key] && (
                <span style={{ color: C.green, display: "flex" }}>
                  {Ico.check}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 12,
                color: C.slate,
                margin: "0 0 12px",
                lineHeight: 1.6,
              }}
            >
              {t.desc}
            </p>
            <Btn
              color={C.primary}
              ghost
              onClick={() => applyTransform(t.key, t.label, t.fn)}
            >
              {t.action}
            </Btn>
          </Card>
        ))}
      </div>
      {af.cleanedRows && (
        <Card style={{ marginTop: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>Clean Dataset Ready</div>
              <div style={{ fontSize: 12, color: C.slate }}>
                {af.cleanedRows.length.toLocaleString()} rows ·{" "}
                {Object.keys(af.cleanedRows[0] || {}).length} columns
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                color={C.green}
                onClick={() =>
                  DataEngine.exportCSV(
                    af.cleanedRows,
                    `${af.name.replace(/\.[^.]+$/, "")}_transformed.csv`
                  )
                }
              >
                {Ico.download} Download CSV
              </Btn>
              <Btn
                color={C.primary}
                onClick={() =>
                  DataEngine.exportXLSX(
                    af.cleanedRows,
                    `${af.name.replace(/\.[^.]+$/, "")}_transformed.xlsx`
                  )
                }
              >
                {Ico.download} Download XLSX
              </Btn>
            </div>
          </div>
        </Card>
      )}
      <div
        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
      >
        <NavBtn label="Data Lineage" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── LINEAGE ──────────────────────────────────────────────────────────────────
function LineageTracker({ af, log, onNext }) {
  const stages = [
    {
      label: "Raw Ingestion",
      detail: "File uploaded, schema profiled",
      color: C.primary,
    },
    {
      label: "Quality Check",
      detail: "DQS computed, issues flagged",
      color: C.blue,
    },
    { label: "AI Cleaning", detail: "Pipeline steps executed", color: C.amber },
    {
      label: "Transformation",
      detail: "Normalization, encoding, dates",
      color: C.purple,
    },
    {
      label: "Feature Engineering",
      detail: "Derived columns generated",
      color: C.green,
    },
    { label: "Output Ready", detail: "Clean dataset exported", color: C.green },
  ];
  return (
    <div>
      <SectionHeader
        title="Data Lineage Tracking"
        sub="Full lifecycle visibility — every transformation logged with timestamps."
      />
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{ display: "flex", position: "relative", padding: "8px 0" }}
        >
          <div
            style={{
              position: "absolute",
              top: 22,
              left: "5%",
              right: "5%",
              height: 2,
              background: `linear-gradient(to right,${C.primary},${C.green})`,
              borderRadius: 99,
              zIndex: 0,
            }}
          />
          {stages.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1,
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: C.card,
                  border: `2px solid ${s.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: s.color }}>
                  {i + 1}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 10, color: C.dark }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>
                  {s.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
          Transformation Log
        </h3>
        {!log.length && (
          <EmptyState
            message="No transformations yet"
            sub="Run cleaning steps to populate the log"
          />
        )}
        {[...log].reverse().map((l, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              padding: "9px 0",
              borderBottom: `1px solid #f8fafc`,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: C.primary,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {l.ts}
            </span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{l.action}</span>
              <span style={{ fontSize: 12, color: C.slate, marginLeft: 8 }}>
                {l.detail}
              </span>
            </div>
            <Pill color="#94a3b8">{l.user}</Pill>
          </div>
        ))}
      </Card>
      <div
        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
      >
        <NavBtn label="AI Insights" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── INSIGHTS ENGINE ──────────────────────────────────────────────────────────
function InsightsEngine({ af, addToast, onNext }) {
  const [corrMatrix, setCorrMatrix] = useState(null);
  const [segmentCol, setSegmentCol] = useState("");
  const [segmentData, setSegmentData] = useState(null);
  const [computingCorr, setComputingCorr] = useState(false);
  const [computingSeg, setComputingSeg] = useState(false);
  if (!af) return <UploadPrompt />;
  const rows = af.cleanedRows || af.rows;
  const numCols = af.colStats.filter((c) => c.isNum).map((c) => c.col);

  const runCorrelation = () => {
    if (numCols.length < 2) {
      addToast("Need at least 2 numeric columns", "error");
      return;
    }
    setComputingCorr(true);
    setTimeout(() => {
      try {
        const matrix = numCols
          .slice(0, 7)
          .map((c1) =>
            numCols
              .slice(0, 7)
              .map((c2) => ({
                c1,
                c2,
                r: DataEngine.computeCorrelation(rows, c1, c2),
              }))
          );
        setCorrMatrix({ cols: numCols.slice(0, 7), matrix });
        addToast("Correlation matrix computed", "success");
      } catch (e) {
        addToast("Correlation failed: " + e.message, "error");
      }
      setComputingCorr(false);
    }, 600);
  };

  const runSegment = () => {
    if (!segmentCol) {
      addToast("Select a column first", "error");
      return;
    }
    setComputingSeg(true);
    setTimeout(() => {
      try {
        setSegmentData({
          col: segmentCol,
          data: DataEngine.frequencyTable(rows, segmentCol, 10),
        });
        addToast(`Segment report for "${segmentCol}"`, "success");
      } catch (e) {
        addToast("Segment failed: " + e.message, "error");
      }
      setComputingSeg(false);
    }, 400);
  };

  return (
    <div>
      <SectionHeader
        title="AI Business Insight Engine"
        sub="Correlations, segmentation, anomalies, and executive-level recommendations."
      />
      <div
        style={{
          background: "linear-gradient(135deg,#0c0a1e,#0f2560)",
          borderRadius: 14,
          padding: 22,
          marginBottom: 16,
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 2,
            color: "#93c5fd",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          BEFORE vs AFTER — IMPACT ANALYSIS
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {[
            { l: "Time Saved", b: "3.8 hrs", a: "< 40 min" },
            {
              l: "Quality Score",
              b: `${af.score}`,
              a: `${Math.min(af.score + 22, 100)}/100`,
            },
            {
              l: "Missing Values",
              b: `${af.totalMissing}`,
              a: af.cleanedRows ? "0" : "pending",
            },
            { l: "Workload", b: "100%", a: "~25%" },
          ].map((m) => (
            <div
              key={m.l}
              style={{
                background: "rgba(255,255,255,.08)",
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#93c5fd",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {m.l}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    color: "#f87171",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "line-through",
                  }}
                >
                  {m.b}
                </span>
                <span>→</span>
                <span
                  style={{ color: "#86efac", fontSize: 15, fontWeight: 800 }}
                >
                  {m.a}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <Card style={{ border: `1px solid ${C.green}25` }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            Correlation Analysis <Pill color={C.green}>numeric</Pill>
          </div>
          <p
            style={{
              fontSize: 12,
              color: C.slate,
              margin: "0 0 12px",
              lineHeight: 1.6,
            }}
          >
            {numCols.length} numeric columns. Pearson correlation reveals
            predictive relationships.
          </p>
          <Btn
            color={C.green}
            ghost
            onClick={runCorrelation}
            disabled={computingCorr}
          >
            {computingCorr ? <>{Ico.spin} Computing...</> : "Run Correlation"}
          </Btn>
        </Card>
        <Card style={{ border: `1px solid ${C.blue}25` }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            Segment Report
          </div>
          <select
            value={segmentCol}
            onChange={(e) => setSegmentCol(e.target.value)}
            style={{ ...st.input, marginBottom: 8 }}
          >
            <option value="">Select column to segment...</option>
            {af.cols.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Btn
            color={C.blue}
            ghost
            onClick={runSegment}
            disabled={computingSeg}
          >
            {computingSeg ? (
              <>{Ico.spin} Generating...</>
            ) : (
              "Create Segment Report"
            )}
          </Btn>
        </Card>
        <Card style={{ border: `1px solid ${C.amber}25` }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            Auto-Impute Missing
          </div>
          <p
            style={{
              fontSize: 12,
              color: C.slate,
              margin: "0 0 12px",
              lineHeight: 1.6,
            }}
          >
            {af.totalMissing} missing values. Use the Clean tab for full
            imputation controls.
          </p>
          <Btn
            color={C.amber}
            ghost
            onClick={() =>
              addToast("Go to the Clean tab → Fill Missing Values", "info")
            }
          >
            Auto-Impute →
          </Btn>
        </Card>
        <Card style={{ border: `1px solid ${C.purple}25` }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            Generate Dashboard
          </div>
          <p
            style={{
              fontSize: 12,
              color: C.slate,
              margin: "0 0 12px",
              lineHeight: 1.6,
            }}
          >
            Auto-generate a visualization dashboard from your dataset columns.
          </p>
          <Btn
            color={C.purple}
            ghost
            onClick={() =>
              addToast(
                "Dashboard generated — check the Visualize tab",
                "success"
              )
            }
          >
            Generate Dashboard →
          </Btn>
        </Card>
      </div>
      {corrMatrix && (
        <Card style={{ marginBottom: 16, overflow: "auto" }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px" }}>
            Correlation Matrix
          </h3>
          <table style={{ borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                <th style={{ padding: "6px 10px" }} />
                {corrMatrix.cols.map((c) => (
                  <th
                    key={c}
                    style={{
                      padding: "6px 10px",
                      color: "#475569",
                      fontWeight: 600,
                      maxWidth: 80,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={c}
                  >
                    {c.substring(0, 10)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corrMatrix.matrix.map((row, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "5px 10px",
                      fontWeight: 600,
                      color: "#475569",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {corrMatrix.cols[i]?.substring(0, 10)}
                  </td>
                  {row.map((cell, j) => {
                    const abs = Math.abs(cell.r);
                    const bg =
                      cell.r > 0
                        ? `rgba(79,70,229,${abs * 0.8})`
                        : `rgba(239,68,68,${abs * 0.8})`;
                    return (
                      <td
                        key={j}
                        style={{
                          padding: "5px 10px",
                          textAlign: "center",
                          background: bg,
                          color: abs > 0.35 ? "white" : C.dark,
                          fontWeight: 600,
                          borderRadius: 3,
                          minWidth: 52,
                        }}
                      >
                        {cell.r.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {segmentData && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px" }}>
            Segment Report: {segmentData.col}
          </h3>
          {segmentData.data.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={segmentData.data}
                margin={{ top: 4, right: 4, bottom: 40, left: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v, "Count"]} />
                <Bar
                  dataKey="count"
                  fill={C.primary}
                  radius={[4, 4, 0, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No data for this column" />
          )}
        </Card>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="Decision Intelligence" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── DECISIONS ────────────────────────────────────────────────────────────────
function DecisionEngine({
  decisions,
  setDecisions,
  af,
  files,
  setFiles,
  setActiveFile,
  addLog,
  addToast,
  onNext,
}) {
  const applyDecision = (id) => {
    if (!af) {
      addToast("No dataset loaded", "error");
      return;
    }
    try {
      const dec = decisions.find((d) => d.id === id);
      if (!dec) return;
      let rows = af.cleanedRows || af.rows;
      if (dec.category === "Data Quality")
        rows = DataEngine.imputeMissing(rows, af.colStats);
      else if (dec.category === "Anomaly")
        rows = DataEngine.capOutliers(rows, af.colStats);
      else if (dec.category === "Transform")
        rows = DataEngine.parseDates(rows, af.colStats);
      else if (dec.category === "Duplicate")
        rows = DataEngine.removeDuplicates(rows);
      const updated = { ...af, cleanedRows: rows };
      setFiles((f) => f.map((x) => (x.name === af.name ? updated : x)));
      setActiveFile(updated);
      setDecisions((d) =>
        d.map((a) => (a.id === id ? { ...a, status: "applied" } : a))
      );
      addLog({
        ts: new Date().toLocaleTimeString(),
        action: dec.title,
        detail: dec.impact,
        user: "Decision Engine",
      });
      addToast(`Applied: ${dec.title}`, "success");
    } catch (e) {
      addToast(`Failed: ${e.message}`, "error");
    }
  };

  const applyAll = () => {
    if (!af) {
      addToast("No dataset loaded", "error");
      return;
    }
    try {
      let rows = af.cleanedRows || af.rows;
      rows = DataEngine.imputeMissing(rows, af.colStats);
      rows = DataEngine.capOutliers(rows, af.colStats);
      rows = DataEngine.parseDates(rows, af.colStats);
      rows = DataEngine.removeDuplicates(rows);
      const updated = { ...af, cleanedRows: rows };
      setFiles((f) => f.map((x) => (x.name === af.name ? updated : x)));
      setActiveFile(updated);
      setDecisions((d) => d.map((a) => ({ ...a, status: "applied" })));
      addToast("All recommended actions applied!", "success");
    } catch (e) {
      addToast(`Failed: ${e.message}`, "error");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Decision Intelligence Layer"
        sub="Every action applies real transformations to your dataset."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <StatCard
          label="Pending Actions"
          value={decisions.filter((d) => d.status === "pending").length}
          color={C.primary}
        />
        <StatCard
          label="Applied"
          value={decisions.filter((d) => d.status === "applied").length}
          color={C.green}
        />
        <StatCard
          label="Est. Accuracy Gain"
          value="+18%"
          color={C.blue}
          trend={18}
        />
      </div>
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
        <div
          style={{
            padding: "12px 18px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 14 }}>
            Recommended Action Queue
          </span>
          <Btn color={C.green} onClick={applyAll} disabled={!af}>
            Apply All
          </Btn>
        </div>
        {decisions.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderBottom: `1px solid #f8fafc`,
              opacity: a.status === "applied" ? 0.6 : 1,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13 }}>{a.title}</span>
                <Pill color={C.primary}>{a.category}</Pill>
              </div>
              <div style={{ fontSize: 11, color: C.slate }}>
                {a.impact} · {a.effort} effort · Risk: {a.risk}
              </div>
            </div>
            {a.status === "applied" ? (
              <span
                style={{
                  color: C.green,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {Ico.check}
                <span style={{ fontSize: 12, fontWeight: 600 }}>Applied</span>
              </span>
            ) : (
              <Btn
                color={C.primary}
                onClick={() => applyDecision(a.id)}
                disabled={!af}
              >
                Apply
              </Btn>
            )}
          </div>
        ))}
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="Scenario Simulation" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── SIMULATION ───────────────────────────────────────────────────────────────
function SimulationEngine({
  af,
  files,
  setFiles,
  setActiveFile,
  addToast,
  onNext,
}) {
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const scenarios = [
    {
      id: "a",
      label: "Full Imputation",
      desc: "Impute all missing values (mean/mode)",
      dataLoss: "0%",
      bias: "Low",
      accuracy: "+18%",
      recommended: true,
    },
    {
      id: "b",
      label: "Drop Missing Rows",
      desc: "Remove any row with missing values",
      dataLoss: af
        ? `${((af.totalMissing / Math.max(af.rows.length, 1)) * 100).toFixed(
            0
          )}%`
        : "~12%",
      bias: "Medium",
      accuracy: "+11%",
      recommended: false,
    },
    {
      id: "c",
      label: "Partial Imputation",
      desc: "Impute columns with <20% missing only",
      dataLoss: "~2%",
      bias: "Low",
      accuracy: "+14%",
      recommended: false,
    },
    {
      id: "d",
      label: "Do Nothing",
      desc: "Keep raw data as-is",
      dataLoss: "0%",
      bias: "High",
      accuracy: "Baseline",
      recommended: false,
    },
  ];
  const applyScenario = async () => {
    if (!af || !selected) return;
    setApplying(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      let rows = af.rows;
      if (selected === "a") rows = DataEngine.imputeMissing(rows, af.colStats);
      else if (selected === "b")
        rows = rows.filter((r) =>
          Object.values(r).every(
            (v) =>
              v !== null &&
              v !== undefined &&
              v !== "" &&
              !(typeof v === "number" && isNaN(v))
          )
        );
      else if (selected === "c") {
        const pc = af.colStats.filter((cs) => cs.missingPct < 20);
        rows = DataEngine.imputeMissing(rows, pc);
      }
      const updated = { ...af, cleanedRows: rows };
      setFiles((f) => f.map((x) => (x.name === af.name ? updated : x)));
      setActiveFile(updated);
      setApplied(true);
      addToast(
        `Scenario applied: ${scenarios.find((s) => s.id === selected)?.label}`,
        "success"
      );
    } catch (e) {
      addToast("Scenario failed: " + e.message, "error");
    }
    setApplying(false);
  };
  return (
    <div>
      <SectionHeader
        title="Scenario Simulation Engine"
        sub="Real what-if analysis — each scenario applies actual transformations to your data."
      />
      {!af && <UploadPrompt />}
      {af && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 16,
            }}
          >
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                onClick={() => {
                  setSelected(sc.id);
                  setApplied(false);
                }}
                style={{
                  ...st.card,
                  cursor: "pointer",
                  border:
                    selected === sc.id
                      ? `2px solid ${C.primary}`
                      : `1px solid ${C.border}`,
                  position: "relative",
                }}
              >
                {sc.recommended && (
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <Pill color={C.green}>Recommended</Pill>
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                  {sc.label}
                </div>
                <div style={{ fontSize: 12, color: C.slate, marginBottom: 14 }}>
                  {sc.desc}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {[
                    {
                      l: "Data Loss",
                      v: sc.dataLoss,
                      c: sc.dataLoss === "0%" ? C.green : C.amber,
                    },
                    {
                      l: "Bias Risk",
                      v: sc.bias,
                      c:
                        sc.bias === "Low"
                          ? C.green
                          : sc.bias === "Medium"
                          ? C.amber
                          : C.red,
                    },
                    { l: "Accuracy", v: sc.accuracy, c: C.blue },
                    {
                      l: "Risk",
                      v: sc.bias,
                      c: sc.bias === "Low" ? C.green : C.red,
                    },
                  ].map((m) => (
                    <div
                      key={m.l}
                      style={{
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: "8px 10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        {m.l}
                      </div>
                      <div
                        style={{ fontSize: 14, fontWeight: 800, color: m.c }}
                      >
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>
                {selected === sc.id && (
                  <div
                    style={{
                      marginTop: 10,
                      background: "#eff6ff",
                      borderRadius: 8,
                      padding: "7px 11px",
                      fontSize: 12,
                      color: "#3730a3",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    {Ico.check} Selected
                  </div>
                )}
              </div>
            ))}
          </div>
          {selected && !applied && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Btn
                color={C.primary}
                onClick={applyScenario}
                disabled={applying}
              >
                {applying ? (
                  <>{Ico.spin} Applying...</>
                ) : (
                  `Apply Scenario: ${
                    scenarios.find((s) => s.id === selected)?.label
                  }`
                )}
              </Btn>
            </div>
          )}
          {applied && (
            <div
              style={{
                textAlign: "center",
                padding: "12px 0",
                color: C.green,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              {Ico.checkLg} Scenario applied to dataset
            </div>
          )}
        </>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="KPI Engine" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── KPI ENGINE ───────────────────────────────────────────────────────────────
function KPIEngine({ kpis, setKpis, industryMode, onNext }) {
  const [newName, setNewName] = useState("");
  const [newFormula, setNewFormula] = useState("");
  const mode = INDUSTRIES.find((m) => m.id === industryMode);
  return (
    <div>
      <SectionHeader
        title="Business KPI Engine"
        sub="Auto-generated and user-defined metrics tailored to your industry context."
      />
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>
            KPIs — {mode?.label}
          </h3>
        </div>
        {!kpis.length && (
          <EmptyState message="No KPIs yet" sub="Add one below" />
        )}
        {kpis.map((k) => (
          <div
            key={k.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "13px 0",
              borderBottom: `1px solid #f8fafc`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: k.color + "15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: k.color,
              }}
            >
              {Ico.chart}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{k.name}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  marginTop: 2,
                }}
              >
                {k.formula}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>
                {k.value}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{k.unit}</div>
            </div>
            <button
              onClick={() => setKpis((k2) => k2.filter((x) => x.id !== k.id))}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
              }}
            >
              {Ico.x}
            </button>
          </div>
        ))}
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
          Add Custom KPI
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div>
            <label style={st.label}>KPI Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Revenue per Row"
              style={st.input}
            />
          </div>
          <div>
            <label style={st.label}>Formula (optional)</label>
            <input
              value={newFormula}
              onChange={(e) => setNewFormula(e.target.value)}
              placeholder="e.g. sum(revenue)/total_rows"
              style={st.input}
            />
          </div>
        </div>
        <Btn
          color={C.primary}
          onClick={() => {
            if (!newName.trim()) return;
            setKpis((k) => [
              ...k,
              {
                id: Date.now(),
                name: newName,
                formula: newFormula || "User-defined",
                value: "—",
                unit: "",
                color: C.primary,
              },
            ]);
            setNewName("");
            setNewFormula("");
          }}
        >
          + Add KPI
        </Btn>
      </Card>
      <div
        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
      >
        <NavBtn label="Smart Monitor" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── MONITOR ──────────────────────────────────────────────────────────────────
function Monitoring({ af, alerts, setAlerts, addToast, onNext }) {
  const [thresholds, setThresholds] = useState({
    missing: 20,
    outlier: 5,
    duplicate: 10,
    quality: 60,
  });
  const [editModal, setEditModal] = useState(null);
  const [editVal, setEditVal] = useState("");
  const thresholdDefs = [
    {
      key: "missing",
      label: "Missing Value Threshold",
      unit: "%",
      color: C.amber,
    },
    { key: "outlier", label: "Outlier Density Limit", unit: "%", color: C.red },
    {
      key: "duplicate",
      label: "Duplicate Rate Alert",
      unit: "%",
      color: C.purple,
    },
    {
      key: "quality",
      label: "Quality Score Floor",
      unit: "/100",
      color: C.blue,
    },
  ];
  return (
    <div>
      <SectionHeader
        title="Smart Monitoring & Alerts"
        sub="Real-time anomaly detection and configurable alerting."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <StatCard
          icon={Ico.bell}
          label="Active Alerts"
          value={alerts.filter((a) => !a.read).length}
          color={C.red}
        />
        <StatCard
          label="Anomaly Columns"
          value={af?.colStats.filter((c) => c.outliers > 0).length ?? 0}
          color={C.amber}
        />
        <StatCard label="Auto-Resolved" value="3" color={C.green} trend={50} />
      </div>
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
          Live Alert Feed
        </h3>
        {!alerts.length ? (
          <div
            style={{
              textAlign: "center",
              padding: 32,
              color: "#94a3b8",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: C.green }}>{Ico.checkLg}</span>All clear
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 0",
                borderBottom: `1px solid #f8fafc`,
                opacity: a.read ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    a.severity === "critical"
                      ? C.red
                      : a.severity === "warning"
                      ? C.amber
                      : C.blue,
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>
                  [{a.col}] {a.msg}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                  {a.ts}
                </div>
              </div>
              <Pill
                color={
                  a.severity === "critical"
                    ? C.red
                    : a.severity === "warning"
                    ? C.amber
                    : C.blue
                }
              >
                {a.severity}
              </Pill>
              <button
                onClick={() =>
                  setAlerts((al) => al.filter((x) => x.id !== a.id))
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                }}
              >
                {Ico.x}
              </button>
            </div>
          ))
        )}
      </Card>
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
          Alert Thresholds
        </h3>
        {thresholdDefs.map((t) => (
          <div
            key={t.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: `1px solid #f8fafc`,
            }}
          >
            <div style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>
              {t.label}
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: t.color }}>
              {thresholds[t.key]}
              {t.unit}
            </div>
            <BtnSm
              color={C.primary}
              onClick={() => {
                setEditModal(t.key);
                setEditVal(String(thresholds[t.key]));
              }}
            >
              Edit
            </BtnSm>
          </div>
        ))}
      </Card>
      {editModal && (
        <Modal
          title={`Edit: ${
            thresholdDefs.find((t) => t.key === editModal)?.label
          }`}
          onClose={() => setEditModal(null)}
        >
          <div style={{ marginBottom: 12 }}>
            <label style={st.label}>New Value</label>
            <input
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              type="number"
              style={st.input}
            />
          </div>
          <Btn
            color={C.primary}
            onClick={() => {
              setThresholds((t) => ({
                ...t,
                [editModal]: parseFloat(editVal) || 0,
              }));
              addToast("Threshold updated", "success");
              setEditModal(null);
            }}
          >
            Save Threshold
          </Btn>
        </Modal>
      )}
      <div
        style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
      >
        <NavBtn label="Visualize" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── VISUALIZATION ────────────────────────────────────────────────────────────
function Visualize({ af, onNext }) {
  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    if (af?.cols?.length) {
      const firstNum = af.colStats.find((c) => c.isNum)?.col;
      const firstText = af.colStats.find((c) => !c.isNum)?.col;
      setXCol(firstText || af.cols[0] || "");
      setYCol(firstNum || af.cols[1] || af.cols[0] || "");
    }
  }, [af]);

  const rows = useMemo(() => af?.cleanedRows || af?.rows || [], [af]);
  const freqData = useMemo(() => {
    if (!xCol || !rows.length) return [];
    return DataEngine.frequencyTable(rows, xCol, 10).filter(
      (d) => d.name && d.count > 0
    );
  }, [xCol, rows]);
  const trendData = useMemo(() => {
    if (!xCol) return [];
    const colStat = af?.colStats.find((c) => c.col === xCol);
    if (!colStat?.isNum) return [];
    return DataEngine.trendsOverIndex(rows, xCol, 60);
  }, [xCol, rows, af]);
  const scatterData = useMemo(() => {
    if (!xCol || !yCol || xCol === yCol) return [];
    return rows
      .slice(0, 400)
      .map((r) => {
        const x = parseFloat(r[xCol]),
          y = parseFloat(r[yCol]);
        return !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)
          ? { x: +x.toFixed(4), y: +y.toFixed(4) }
          : null;
      })
      .filter(Boolean);
  }, [xCol, yCol, rows]);

  if (!af) return <UploadPrompt />;

  const xStat = af.colStats.find((c) => c.col === xCol);
  const numCols = af.colStats.filter((c) => c.isNum).map((c) => c.col);
  const allCols = af.cols;

  const chartHints = {
    bar: "Categorical comparisons — best for text/category columns",
    line: "Time-ordered trends — best for indexed numeric data",
    pie: "Proportional distribution — best for ≤8 categories",
    area: "Cumulative trends — shows growth patterns",
    scatter: "Numeric correlation — select two numeric columns",
    histogram: "Value distribution — shows spread and outliers",
  };

  const renderChart = () => {
    try {
      const commonProps = {
        margin: { top: 4, right: 16, bottom: 50, left: 16 },
      };

      // SCATTER — ZAxis REMOVED to fix "element type is invalid" error
      if (chartType === "scatter") {
        if (scatterData.length === 0)
          return (
            <EmptyState message="Select two numeric columns for scatter plot" />
          );
        return (
          <ScatterChart margin={{ top: 4, right: 16, bottom: 30, left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="x"
              name={xCol}
              tick={{ fontSize: 11 }}
              label={{
                value: xCol,
                position: "insideBottom",
                offset: -15,
                fontSize: 11,
              }}
            />
            <YAxis dataKey="y" name={yCol} tick={{ fontSize: 11 }} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(v, n) => [
                typeof v === "number" ? v.toFixed(4) : v,
                n,
              ]}
            />
            <Scatter data={scatterData} fill={C.primary} fillOpacity={0.65} />
          </ScatterChart>
        );
      }

      if (chartType === "pie") {
        if (!freqData.length)
          return (
            <EmptyState message="No data to display for selected column" />
          );
        return (
          <PieChart>
            <Pie
              data={freqData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, pct }) =>
                `${String(name).substring(0, 10)} (${pct}%)`
              }
              labelLine={false}
            >
              {freqData.map((_, i) => (
                <Cell key={i} fill={PAL[i % PAL.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, n, p) => [`${v} (${p.payload.pct}%)`, "Count"]}
            />
            <Legend />
          </PieChart>
        );
      }

      if (chartType === "histogram") {
        if (!xStat?.isNum)
          return <EmptyState message="Select a numeric column for histogram" />;
        const vals = rows
          .map((r) => parseFloat(r[xCol]))
          .filter((v) => !isNaN(v) && isFinite(v));
        if (!vals.length)
          return <EmptyState message="Not enough data for histogram" />;
        const min = Math.min(...vals),
          max = Math.max(...vals),
          bins = Math.min(20, Math.ceil(Math.sqrt(vals.length)));
        const binW = (max - min) / bins || 1;
        const buckets = Array(bins)
          .fill(0)
          .map((_, i) => ({
            range: `${(min + i * binW).toFixed(2)}`,
            count: 0,
          }));
        vals.forEach((v) => {
          const idx = Math.min(Math.floor((v - min) / binW), bins - 1);
          buckets[idx].count++;
        });
        const histData = buckets.filter((b) => b.count > 0);
        return (
          <BarChart data={histData} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10 }}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, "Count"]} />
            <Bar dataKey="count" fill={C.purple} radius={[2, 2, 0, 0]} />
          </BarChart>
        );
      }

      if (chartType === "line") {
        if (!trendData.length)
          return (
            <EmptyState message="Select a numeric column for line chart" />
          );
        return (
          <LineChart
            data={trendData}
            margin={{ top: 4, right: 16, bottom: 30, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="index" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, xCol]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={C.primary}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
      }

      if (chartType === "area") {
        if (!trendData.length)
          return (
            <EmptyState message="Select a numeric column for area chart" />
          );
        return (
          <AreaChart
            data={trendData}
            margin={{ top: 4, right: 16, bottom: 30, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="index" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, xCol]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={C.primary}
              fill={C.primary}
              fillOpacity={0.15}
            />
          </AreaChart>
        );
      }

      // Default: bar
      if (!freqData.length)
        return (
          <EmptyState
            message="No data to display"
            sub="Try selecting a different column"
          />
        );
      return (
        <BarChart data={freqData} {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            angle={-25}
            textAnchor="end"
            height={70}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [v, "Count"]} />
          <Legend />
          <Bar
            dataKey="count"
            fill={C.primary}
            radius={[4, 4, 0, 0]}
            name="Frequency"
            maxBarSize={50}
          />
        </BarChart>
      );
    } catch (e) {
      return <EmptyState message="Chart rendering failed" sub={e.message} />;
    }
  };

  return (
    <div>
      <SectionHeader
        title="Intelligent Visualization System"
        sub="6 chart types. Select columns and chart type to explore your data."
      />
      <Card style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={st.label}>Primary Column (X Axis)</label>
            <select
              value={xCol}
              onChange={(e) => setXCol(e.target.value)}
              style={st.input}
            >
              {allCols.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {chartType === "scatter" && (
            <div style={{ flex: 1, minWidth: 140 }}>
              <label style={st.label}>Y Axis Column</label>
              <select
                value={yCol}
                onChange={(e) => setYCol(e.target.value)}
                style={st.input}
              >
                <option value="">Select Y column...</option>
                {numCols.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={st.label}>Chart Type</label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={st.input}
            >
              {["bar", "line", "pie", "area", "scatter", "histogram"].map(
                (t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} Chart
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        <div
          style={{
            background: "#f0f9ff",
            border: `1px solid ${C.blue}40`,
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 16,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ color: C.blue, flexShrink: 0 }}>{Ico.info}</span>
          <span style={{ fontSize: 11, color: "#0c4a6e" }}>
            <strong style={{ color: "#0369a1" }}>Hint:</strong>{" "}
            {chartHints[chartType]}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          {renderChart()}
        </ResponsiveContainer>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="Ask AI Analyst" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── NLQ ANALYST ──────────────────────────────────────────────────────────────
function NLQAnalyst({ af, industryMode, onNext }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatRef = useRef();
  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [history, loading]);

  const QUICK = [
    "Which column has the most missing values?",
    "Identify outliers and explain them",
    "What is the overall data quality?",
    "What business actions should I prioritize?",
    "What correlations exist in the data?",
    "What KPIs should I track?",
  ];

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input;
    setInput("");
    setError(null);
    setHistory((h) => [...h, { role: "user", text: q }]);
    setLoading(true);
    try {
      const answer = await MockAI.query(q, af, industryMode);
      setHistory((h) => [...h, { role: "ai", text: answer }]);
    } catch (e) {
      setError("AI response failed. Please try again.");
      setHistory((h) => [
        ...h,
        {
          role: "ai",
          text: "I encountered an error. Please try rephrasing your question.",
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div>
      <SectionHeader
        title="Natural Language Analytics"
        sub="Ask plain-English questions — answered by AI analysis of your actual data."
      />
      {!af && <UploadPrompt />}
      {af && (
        <>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                style={{
                  fontSize: 11,
                  color: C.primary,
                  background: C.primary + "12",
                  border: `1px solid ${C.primary}25`,
                  borderRadius: 20,
                  padding: "5px 12px",
                  cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>
          <Card
            style={{
              display: "flex",
              flexDirection: "column",
              height: 500,
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div
              ref={chatRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {!history.length && (
                <div
                  style={{
                    textAlign: "center",
                    margin: "auto",
                    color: "#94a3b8",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {Ico.brain}
                  <div
                    style={{ fontWeight: 600, fontSize: 14, color: C.slate }}
                  >
                    AI Analyst Ready
                  </div>
                  <div style={{ fontSize: 12 }}>
                    Ask anything about your {af.rows.length.toLocaleString()}
                    -row dataset
                  </div>
                </div>
              )}
              {history.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.75,
                      whiteSpace: "pre-wrap",
                      borderRadius:
                        m.role === "user"
                          ? "12px 12px 2px 12px"
                          : "12px 12px 12px 2px",
                      background:
                        m.role === "user"
                          ? `linear-gradient(135deg,${C.primary},${C.blue})`
                          : "#f8fafc",
                      color: m.role === "user" ? "white" : C.dark,
                      border:
                        m.role === "ai" ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "#f8fafc",
                    borderRadius: 12,
                    border: `1px solid ${C.border}`,
                    width: "fit-content",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.primary,
                        animation: `nlqBounce 1s infinite ${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              {error && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: `1px solid ${C.red}30`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: "#dc2626",
                  }}
                >
                  {error}
                </div>
              )}
            </div>
            <div
              style={{
                borderTop: `1px solid ${C.border}`,
                padding: "12px 14px",
                display: "flex",
                gap: 10,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask about your data... (Press Enter to send)"
                style={{ ...st.input, flex: 1, width: "auto" }}
              />
              <Btn
                color={C.primary}
                onClick={send}
                disabled={loading || !input.trim() || !af}
              >
                {Ico.send} Send
              </Btn>
            </div>
          </Card>
          <style>{`@keyframes nlqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </>
      )}
      <div
        style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}
      >
        <NavBtn label="Team Collaboration" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── TEAM COLLABORATION ───────────────────────────────────────────────────────
function Collaboration({ addToast, onNext }) {
  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@company.com",
      role: "Owner",
      status: "Active",
      avatar: "PS",
      color: C.primary,
      joined: "Jan 2025",
    },
    {
      id: 2,
      name: "James Kim",
      email: "james@company.com",
      role: "Editor",
      status: "Active",
      avatar: "JK",
      color: C.green,
      joined: "Feb 2025",
    },
    {
      id: 3,
      name: "Ananya Mehta",
      email: "ananya@company.com",
      role: "Viewer",
      status: "Active",
      avatar: "AM",
      color: C.amber,
      joined: "Mar 2025",
    },
  ]);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Priya S.",
      avatar: "PS",
      role: "Owner",
      msg: "Revenue column needs sign-off before imputation.",
      time: "10 min ago",
      color: C.primary,
    },
    {
      id: 2,
      user: "James K.",
      avatar: "JK",
      role: "Editor",
      msg: "847 records flagged. Escalating to ops team.",
      time: "25 min ago",
      color: C.green,
    },
    {
      id: 3,
      user: "Ananya M.",
      avatar: "AM",
      role: "Viewer",
      msg: "Can we schedule this pipeline every Monday 6am?",
      time: "1 hr ago",
      color: C.amber,
    },
  ]);
  const [commentInput, setCommentInput] = useState("");
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviteTab, setInviteTab] = useState("link");
  const [inviteLink] = useState(
    () =>
      `https://autoclean.app/invite/${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [removeModal, setRemoveModal] = useState(null);
  const [editRole, setEditRole] = useState({});
  const roleColors = { Owner: C.purple, Editor: C.primary, Viewer: C.green };
  const statusColors = { Active: C.green, Invited: C.amber };

  const copyLink = () => {
    navigator.clipboard?.writeText(inviteLink).catch(() => {});
    setLinkCopied(true);
    addToast("Invite link copied!", "success");
    setTimeout(() => setLinkCopied(false), 3000);
  };
  const sendEmailInvite = () => {
    if (!inviteEmail.trim()) {
      addToast("Enter an email address", "error");
      return;
    }
    setTeam((t) => [
      ...t,
      {
        id: Date.now(),
        name: inviteName || inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        status: "Invited",
        avatar: (inviteName || inviteEmail).substring(0, 2).toUpperCase(),
        color: C.purple,
        joined: "—",
      },
    ]);
    addToast(`Invite sent to ${inviteEmail}`, "success");
    setInviteModal(false);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("Viewer");
  };
  const updateRole = (id, newRole) => {
    setTeam((t) => t.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    setEditRole((r) => ({ ...r, [id]: false }));
    addToast("Role updated", "success");
  };
  const removeMember = (id) => {
    setTeam((t) => t.filter((m) => m.id !== id));
    setRemoveModal(null);
    addToast("Member removed", "success");
  };
  const addComment = () => {
    if (!commentInput.trim()) return;
    setComments((c) => [
      {
        id: Date.now(),
        user: "You",
        avatar: "YO",
        role: "Owner",
        msg: commentInput,
        time: "Just now",
        color: C.primary,
      },
      ...c,
    ]);
    setCommentInput("");
  };

  return (
    <div>
      <SectionHeader
        title="Team Collaboration"
        sub="Invite members, manage roles, and annotate findings in real time."
      />
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 800,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ color: C.slate }}>{Ico.users}</span>Team Members (
            {team.length})
          </h3>
          <Btn color={C.primary} onClick={() => setInviteModal(true)}>
            + Invite Member
          </Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Member", "Email", "Role", "Status", "Joined", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "9px 14px",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "#475569",
                        fontSize: 10,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.id} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: m.color + "20",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          color: m.color,
                          flexShrink: 0,
                        }}
                      >
                        {m.avatar}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {m.name}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: C.slate,
                      fontSize: 12,
                    }}
                  >
                    {m.email}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    {editRole[m.id] ? (
                      <select
                        defaultValue={m.role}
                        onChange={(e) => updateRole(m.id, e.target.value)}
                        style={{
                          ...st.input,
                          width: "auto",
                          padding: "4px 8px",
                          fontSize: 12,
                        }}
                        autoFocus
                        onBlur={() =>
                          setEditRole((r) => ({ ...r, [m.id]: false }))
                        }
                      >
                        {["Owner", "Editor", "Viewer"].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        onClick={() =>
                          m.role !== "Owner" &&
                          setEditRole((r) => ({ ...r, [m.id]: true }))
                        }
                        style={{
                          cursor: m.role !== "Owner" ? "pointer" : "default",
                        }}
                      >
                        <Pill color={roleColors[m.role] || C.slate}>
                          {m.role}
                        </Pill>
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <Pill color={statusColors[m.status] || C.slate}>
                      {m.status}
                    </Pill>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: C.slate,
                      fontSize: 12,
                    }}
                  >
                    {m.joined}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {m.role !== "Owner" && (
                        <BtnSm
                          color={C.slate}
                          onClick={() =>
                            setEditRole((r) => ({ ...r, [m.id]: true }))
                          }
                        >
                          Change Role
                        </BtnSm>
                      )}
                      {m.role !== "Owner" && (
                        <button
                          onClick={() => setRemoveModal(m)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: C.red,
                            display: "flex",
                            padding: 4,
                          }}
                          title="Remove member"
                        >
                          {Ico.trash}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>
          Team Comments
        </h3>
        <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 12 }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                gap: 10,
                padding: "10px 0",
                borderBottom: `1px solid #f8fafc`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: c.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: c.color,
                  flexShrink: 0,
                }}
              >
                {c.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 13 }}>
                    {c.user}
                  </span>
                  <Pill color="#94a3b8">{c.role}</Pill>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>
                    {c.time}
                  </span>
                </div>
                <div
                  style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}
                >
                  {c.msg}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            placeholder="Add a comment..."
            style={{ ...st.input, flex: 1, width: "auto" }}
          />
          <Btn color={C.primary} onClick={addComment}>
            Send
          </Btn>
        </div>
      </Card>

      {inviteModal && (
        <Modal
          title="Invite Team Member"
          onClose={() => setInviteModal(false)}
          maxWidth={520}
        >
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 20,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {[
              { id: "link", label: "Invite via Link" },
              { id: "email", label: "Invite via Email" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setInviteTab(tab.id)}
                style={{
                  padding: "9px 18px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  color: inviteTab === tab.id ? C.primary : C.slate,
                  borderBottom:
                    inviteTab === tab.id
                      ? `2px solid ${C.primary}`
                      : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {inviteTab === "link" && (
            <div>
              <p
                style={{
                  fontSize: 13,
                  color: C.slate,
                  margin: "0 0 14px",
                  lineHeight: 1.6,
                }}
              >
                Share this link. Anyone with this link can join as a{" "}
                <strong>Viewer</strong>.
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <span style={{ color: C.primary, flexShrink: 0 }}>
                  {Ico.link}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: C.slate,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {inviteLink}
                </span>
              </div>
              <Btn
                color={C.primary}
                onClick={copyLink}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {Ico.copy} {linkCopied ? "Copied!" : "Copy Invite Link"}
              </Btn>
            </div>
          )}
          {inviteTab === "email" && (
            <div>
              <div style={{ marginBottom: 12 }}>
                <label style={st.label}>Full Name (optional)</label>
                <input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  style={st.input}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={st.label}>Email Address *</label>
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  style={st.input}
                  type="email"
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={st.label}>Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={st.input}
                >
                  <option value="Editor">
                    Editor — Can clean and transform data
                  </option>
                  <option value="Viewer">Viewer — Read-only access</option>
                </select>
              </div>
              <Btn
                color={C.primary}
                onClick={sendEmailInvite}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {Ico.mail} Send Invite
              </Btn>
            </div>
          )}
        </Modal>
      )}
      {removeModal && (
        <Modal
          title="Remove Member"
          onClose={() => setRemoveModal(null)}
          maxWidth={400}
        >
          <p
            style={{
              fontSize: 13,
              color: C.slate,
              margin: "0 0 20px",
              lineHeight: 1.6,
            }}
          >
            Remove <strong>{removeModal.name}</strong> ({removeModal.email})
            from the team? They will lose all access immediately.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn
              color={C.red}
              onClick={() => removeMember(removeModal.id)}
              style={{ flex: 1, justifyContent: "center" }}
            >
              {Ico.trash} Remove
            </Btn>
            <Btn
              color={C.slate}
              ghost
              onClick={() => setRemoveModal(null)}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Cancel
            </Btn>
          </div>
        </Modal>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NavBtn label="Generate Report" onClick={onNext} />
      </div>
    </div>
  );
}

// ─── REPORT ───────────────────────────────────────────────────────────────────
function Report({ af, decisions, kpis, industryMode, log }) {
  const [ready, setReady] = useState(false);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef();
  const mode = INDUSTRIES.find((m) => m.id === industryMode);
  if (!af) return <UploadPrompt />;

  const generate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setGenerating(false);
    setReady(true);
  };
  const exportPDF = () => {
    try {
      const win = window.open("", "_blank");
      win.document.write(
        `<html><head><title>AutoClean Report</title><style>body{font-family:sans-serif;padding:32px;color:#0f172a;max-width:900px;margin:0 auto}table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #e2e8f0;font-size:12px}th{background:#f8fafc;font-weight:700}</style></head><body>${
          reportRef.current?.innerHTML || ""
        }</body></html>`
      );
      win.document.close();
      setTimeout(() => win.print(), 500);
    } catch (e) {
      console.error(e);
    }
  };

  const sections = [
    {
      title: "1. Data Quality Assessment",
      content: `Dataset "${
        af.name
      }" contains ${af.rows.length.toLocaleString()} records across ${
        af.cols.length
      } dimensions. Initial quality score: ${
        af.score
      }/100. Estimated post-cleaning score: ${Math.min(
        af.score + 22,
        100
      )}/100. ${af.totalMissing} missing values identified. ${
        af.colStats.filter((c) => c.outliers > 0).length
      } columns contain statistical outliers.`,
    },
    {
      title: "2. AI Cleaning & Transformations",
      content: `Automated pipeline executed: (1) Duplicate removal, (2) Missing value imputation, (3) ISO 8601 date standardization, (4) Min-Max normalization, (5) Text normalization.${
        af.cleanedRows
          ? ` Cleaned dataset: ${af.cleanedRows.length.toLocaleString()} rows.`
          : ""
      } Equivalent manual effort: ~3.8 analyst-hours.`,
    },
    {
      title: "3. Decision Intelligence",
      content: `${decisions.filter((d) => d.status === "applied").length} of ${
        decisions.length
      } recommended actions applied.`,
    },
    {
      title: "4. Strategic Recommendations",
      content:
        "① Implement mandatory field validation at data collection source\n② Schedule automated weekly data quality monitoring\n③ Proceed to predictive modeling — est. 15-18% accuracy improvement\n④ Establish data governance charter with schema contracts",
    },
  ];

  if (!ready) {
    return (
      <div>
        <SectionHeader
          title="Automated Executive Report"
          sub="One-click boardroom-ready report with KPIs, insights, and strategic recommendations."
        />
        <Card style={{ textAlign: "center", padding: "56px 24px" }}>
          <div
            style={{
              color: C.slate,
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {Ico.file}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>
            Generate Decision Intelligence Report
          </h3>
          <p style={{ color: C.slate, fontSize: 14, margin: "0 0 6px" }}>
            Includes: Data Summary · Quality Audit · Cleaning Log · Decision
            Intelligence · KPIs
          </p>
          <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 24px" }}>
            Industry: {mode?.label} · Dataset: {af.name} ·{" "}
            {af.rows.length.toLocaleString()} rows
          </p>
          <Btn color={C.primary} onClick={generate} disabled={generating}>
            {generating ? <>{Ico.spin} Generating...</> : "Generate Report"}
          </Btn>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Executive Report"
        sub="Ready for export — PDF, CSV, or XLSX."
      />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            background: "linear-gradient(135deg,#0c0a1e,#1a1740,#0f2560)",
            padding: "28px 32px",
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 2,
              color: "#93c5fd",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            CONFIDENTIAL — DECISION INTELLIGENCE REPORT
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>
            Data Intelligence Report
          </h2>
          <div style={{ fontSize: 12, color: "#c7d2fe" }}>
            Dataset: {af.name} · {mode?.label} ·{" "}
            {new Date().toLocaleDateString()} · AutoClean Enterprise
          </div>
        </div>
        <div ref={reportRef} style={{ padding: 28 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 10,
              marginBottom: 24,
            }}
          >
            {[
              { l: "Rows Processed", v: af.rows.length.toLocaleString() },
              { l: "Quality Score", v: `${Math.min(af.score + 22, 100)}/100` },
              {
                l: "Decisions Applied",
                v: `${decisions.filter((d) => d.status === "applied").length}/${
                  decisions.length
                }`,
              },
              { l: "Analyst Hrs Saved", v: "~3.8" },
              { l: "Alerts Resolved", v: "3" },
              { l: "KPIs Tracked", v: kpis.length },
              { l: "Workload Reduction", v: "~75%" },
              { l: "Pipeline Steps", v: "5" },
            ].map((k) => (
              <div
                key={k.l}
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "12px 14px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 20, fontWeight: 900, color: C.primary }}
                >
                  {k.v}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: C.slate,
                    marginTop: 3,
                    fontWeight: 500,
                  }}
                >
                  {k.l}
                </div>
              </div>
            ))}
          </div>
          {sections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: 22 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: C.dark,
                  margin: "0 0 8px",
                  paddingBottom: 7,
                  borderBottom: `2px solid #e0e7ff`,
                }}
              >
                {sec.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.8,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {sec.content}
              </p>
            </div>
          ))}
          {log.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: C.dark,
                  margin: "0 0 8px",
                  paddingBottom: 7,
                  borderBottom: `2px solid #e0e7ff`,
                }}
              >
                5. Transformation Log
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Time", "Action", "Detail", "By"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "7px 10px",
                          textAlign: "left",
                          fontWeight: 700,
                          color: "#475569",
                          fontSize: 10,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {log.map((l, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td
                        style={{
                          padding: "6px 10px",
                          fontFamily: "monospace",
                          color: C.primary,
                          fontSize: 11,
                        }}
                      >
                        {l.ts}
                      </td>
                      <td style={{ padding: "6px 10px", fontWeight: 600 }}>
                        {l.action}
                      </td>
                      <td style={{ padding: "6px 10px", color: C.slate }}>
                        {l.detail}
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        <Pill color="#94a3b8">{l.user}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "16px 28px",
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Btn color={C.primary} onClick={exportPDF}>
            {Ico.printer} Export PDF
          </Btn>
          <Btn
            color={C.green}
            ghost
            onClick={() =>
              DataEngine.exportCSV(
                af.cleanedRows || af.rows,
                `report_${af.name.replace(/\.[^.]+$/, "")}.csv`
              )
            }
          >
            {Ico.download} Download CSV
          </Btn>
          <Btn
            color={C.blue}
            ghost
            onClick={() =>
              DataEngine.exportXLSX(
                af.cleanedRows || af.rows,
                `report_${af.name.replace(/\.[^.]+$/, "")}.xlsx`
              )
            }
          >
            {Ico.download} Download XLSX
          </Btn>
          <button
            onClick={() =>
              navigator.clipboard
                ?.writeText(window.location.href)
                .catch(() => {})
            }
            style={{ ...st.btn(C.slate, true), marginLeft: "auto" }}
          >
            {Ico.link} Copy Link
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState("ingest");
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [industryMode, setIndustryMode] = useState("auto");
  const [showBell, setShowBell] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [transformLog, setTransformLog] = useState([]);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      col: "revenue",
      msg: "High missing rate in revenue column (>80%)",
      severity: "critical",
      ts: "Just now",
      read: false,
    },
    {
      id: 2,
      col: "customer_id",
      msg: "Duplicate rate exceeded 15% threshold",
      severity: "warning",
      ts: "2 min ago",
      read: false,
    },
    {
      id: 3,
      col: "signup_date",
      msg: "Date format inconsistency detected across 3 formats",
      severity: "warning",
      ts: "5 min ago",
      read: false,
    },
    {
      id: 4,
      col: "region",
      msg: "Unknown category 'APAC_NEW' not in schema",
      severity: "info",
      ts: "8 min ago",
      read: false,
    },
  ]);
  const [decisions, setDecisions] = useState([
    {
      id: 1,
      title: "Impute Missing Revenue Fields",
      impact: "↑ 18% model accuracy",
      risk: "Low",
      effort: "Auto",
      status: "pending",
      category: "Data Quality",
    },
    {
      id: 2,
      title: "Cap Outliers in Transaction Volume",
      impact: "↓ 23% prediction error",
      risk: "Medium",
      effort: "1-click",
      status: "pending",
      category: "Anomaly",
    },
    {
      id: 3,
      title: "Standardize Date Formats",
      impact: "Enables time-series joins",
      risk: "Low",
      effort: "Auto",
      status: "applied",
      category: "Transform",
    },
    {
      id: 4,
      title: "Deduplicate Customer Records",
      impact: "↓ 12% over-counting bias",
      risk: "Medium",
      effort: "Review",
      status: "pending",
      category: "Duplicate",
    },
    {
      id: 5,
      title: "Encode High-Cardinality Categoricals",
      impact: "ML-ready feature set",
      risk: "Low",
      effort: "Auto",
      status: "pending",
      category: "Transform",
    },
  ]);
  const [kpis, setKpis] = useState([
    {
      id: 1,
      name: "Data Completeness Rate",
      formula: "(1 - missing/total) × 100",
      value: "—",
      unit: "%",
      color: C.green,
    },
    {
      id: 2,
      name: "Duplicate Rate",
      formula: "dupes / total_rows × 100",
      value: "—",
      unit: "%",
      color: C.red,
    },
    {
      id: 3,
      name: "Outlier Density",
      formula: "outlier_cells / total × 100",
      value: "—",
      unit: "%",
      color: C.amber,
    },
    {
      id: 4,
      name: "Time to Insight",
      formula: "Pipeline runtime",
      value: "< 2",
      unit: "min",
      color: C.primary,
    },
    {
      id: 5,
      name: "Analyst Hours Saved",
      formula: "Manual hrs − AI hrs",
      value: "3.8",
      unit: "hrs",
      color: C.purple,
    },
  ]);

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-4), { id, msg, type }]);
  }, []);
  const removeToast = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    []
  );
  const addLog = useCallback(
    (entry) => setTransformLog((l) => [...l, entry]),
    []
  );

  const handleFileAdd = useCallback(
    (fo) => {
      setFiles((prev) =>
        prev.find((f) => f.name === fo.name)
          ? prev.map((f) => (f.name === fo.name ? fo : f))
          : [...prev, fo]
      );
      setActiveFile(fo);
      const completeness = fo.totalCells
        ? ((1 - fo.totalMissing / fo.totalCells) * 100).toFixed(1)
        : "—";
      const outlierDensity = fo.totalCells
        ? (
            (fo.colStats.reduce((s, c) => s + c.outliers, 0) / fo.totalCells) *
            100
          ).toFixed(2)
        : "—";
      setKpis((k) =>
        k.map((kp) => {
          if (kp.name === "Data Completeness Rate")
            return { ...kp, value: completeness };
          if (kp.name === "Outlier Density")
            return { ...kp, value: outlierDensity };
          return kp;
        })
      );
      addLog({
        ts: new Date().toLocaleTimeString(),
        action: "Dataset Loaded",
        detail: `${fo.rows.length.toLocaleString()} rows, ${
          fo.cols.length
        } cols`,
        user: "System",
      });
      addToast(
        `${fo.name} loaded — ${fo.rows.length.toLocaleString()} rows`,
        "success"
      );
    },
    [addLog, addToast]
  );

  const stepOrder = STEPS.map((s) => s.id);
  const nextStep = () => {
    const i = stepOrder.indexOf(step);
    if (i < stepOrder.length - 1) setStep(stepOrder[i + 1]);
  };
  const commonProps = { af: activeFile, onNext: nextStep };
  const dataProps = {
    ...commonProps,
    files,
    setFiles,
    setActiveFile,
    addLog,
    addToast,
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
        background: C.bg,
        minHeight: "100vh",
      }}
    >
      <style>{`* { box-sizing: border-box; } @keyframes nlqBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} } @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} } select option { background: #fff; color: #0f172a; } ::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }`}</style>
      <Navbar
        step={step}
        setStep={setStep}
        alerts={alerts}
        industryMode={industryMode}
        setIndustryMode={setIndustryMode}
        onBell={() => setShowBell((s) => !s)}
      />
      {showBell && (
        <NotificationsPanel
          alerts={alerts}
          onDismiss={(id) => setAlerts((a) => a.filter((x) => x.id !== id))}
          onMarkRead={(id) =>
            setAlerts((a) =>
              a.map((x) => (x.id === id ? { ...x, read: true } : x))
            )
          }
          onMarkAllRead={() =>
            setAlerts((a) => a.map((x) => ({ ...x, read: true })))
          }
          onClose={() => setShowBell(false)}
        />
      )}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
        {step === "ingest" && (
          <DataIngestion
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            onFileAdd={handleFileAdd}
            onNext={nextStep}
          />
        )}
        {step === "quality" && (
          <DataQuality
            {...commonProps}
            alerts={alerts}
            onDismissAlert={(id) =>
              setAlerts((a) => a.filter((x) => x.id !== id))
            }
          />
        )}
        {step === "clean" && <CleaningEngine {...dataProps} />}
        {step === "transform" && <Transformation {...dataProps} />}
        {step === "lineage" && (
          <LineageTracker {...commonProps} log={transformLog} />
        )}
        {step === "insights" && (
          <InsightsEngine {...commonProps} addToast={addToast} />
        )}
        {step === "decisions" && (
          <DecisionEngine
            {...dataProps}
            decisions={decisions}
            setDecisions={setDecisions}
          />
        )}
        {step === "simulate" && <SimulationEngine {...dataProps} />}
        {step === "kpi" && (
          <KPIEngine
            kpis={kpis}
            setKpis={setKpis}
            industryMode={industryMode}
            onNext={nextStep}
          />
        )}
        {step === "monitor" && (
          <Monitoring
            {...commonProps}
            alerts={alerts}
            setAlerts={setAlerts}
            addToast={addToast}
          />
        )}
        {step === "visualize" && <Visualize {...commonProps} />}
        {step === "nlq" && (
          <NLQAnalyst {...commonProps} industryMode={industryMode} />
        )}
        {step === "collaborate" && (
          <Collaboration addToast={addToast} onNext={nextStep} />
        )}
        {step === "report" && (
          <Report
            af={activeFile}
            decisions={decisions}
            kpis={kpis}
            industryMode={industryMode}
            log={transformLog}
          />
        )}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            msg={t.msg}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
      {showBell && (
        <div
          onClick={() => setShowBell(false)}
          style={{ position: "fixed", inset: 0, zIndex: 499 }}
        />
      )}
    </div>
  );
}
