"use client";

import { Typography } from "antd";

const { Text } = Typography;

export type PipelineSegment = {
  key: string;
  label: string;
  count: number;
  amountDisplay?: string;
  color: string;
};

export function PipelineChart({ segments }: { segments: PipelineSegment[] }) {
  const total = segments.reduce((s, x) => s + x.count, 0) || 1;
  let acc = 0;
  return (
    <div>
      <div className="relative h-3 rounded-full overflow-hidden bg-[#F1F0EB]">
        <svg viewBox="0 0 100 4" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {segments.map((seg) => {
            const x = (acc / total) * 100;
            const w = (seg.count / total) * 100;
            acc += seg.count;
            return <rect key={seg.key} x={x} y={0} width={w} height={4} fill={seg.color} />;
          })}
        </svg>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 mt-6">
        {segments.map((seg) => (
          <div key={seg.key} className="flex items-start gap-2.5 min-w-0">
            <span aria-hidden className="mt-1.5 h-2 w-2 rounded-full shrink-0" style={{ background: seg.color }} />
            <div className="min-w-0">
              <Text style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>{seg.label}</Text>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span style={{ fontSize: 20, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.01em" }}>{seg.count}</span>
                {seg.amountDisplay && <span style={{ fontSize: 12, color: "#64748B" }}>{seg.amountDisplay}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
