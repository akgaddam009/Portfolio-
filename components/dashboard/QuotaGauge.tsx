"use client";

import { Progress, Typography } from "antd";

const { Text } = Typography;

export function QuotaGauge({ approvedAmountDisplay, approvedPct, targetDisplay }: { approvedAmountDisplay: string; approvedPct: number; targetDisplay: string }) {
  return (
    <div className="flex items-center gap-6">
      <Progress
        type="dashboard"
        percent={approvedPct}
        size={150}
        strokeColor={{ "0%": "#0F766E", "100%": "#14B8A6" }}
        trailColor="#F1F0EB"
        strokeWidth={10}
        format={() => (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: "#0F172A" }}>{approvedPct}%</span>
            <span style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>of monthly quota</span>
          </div>
        )}
      />
      <div className="space-y-3 min-w-0">
        <Stat label="Approved this month" value={approvedAmountDisplay} />
        <Stat label="Monthly target" value={targetDisplay} muted />
      </div>
    </div>
  );
}

function Stat({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <Text style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</Text>
      <div style={{ fontSize: 20, fontWeight: 600, color: muted ? "#64748B" : "#0F172A", marginTop: 2 }}>{value}</div>
    </div>
  );
}
