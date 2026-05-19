"use client";

import { List, Tag, Typography, Avatar } from "antd";
import type { InboxItem } from "@/types/credit";

const { Text } = Typography;

export function TopVendorsList({ items }: { items: InboxItem[] }) {
  const returning = items
    .filter((i) => i.priorApproval)
    .sort((a, b) => parseAmount(b.priorApproval!.approvedAmountDisplay) - parseAmount(a.priorApproval!.approvedAmountDisplay))
    .slice(0, 6);
  if (returning.length === 0) return <Text type="secondary" style={{ fontSize: 12 }}>No returning vendors yet.</Text>;
  const colorByIndex = ["#0F766E", "#3F3FB3", "#1F8A4E", "#C97A11", "#8B5CF6", "#0EA5E9"];
  return (
    <List
      dataSource={returning}
      split={false}
      renderItem={(item, idx) => (
        <List.Item style={{ padding: "10px 0", borderBottom: idx === returning.length - 1 ? "none" : "1px solid #F1F0EB" }}>
          <List.Item.Meta
            avatar={<Avatar size={32} style={{ background: colorByIndex[idx % colorByIndex.length], color: "#FFFFFF", fontSize: 12, fontWeight: 600 }}>{initialsFromName(item.vendor.name)}</Avatar>}
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{item.vendor.name}</Text>
                <Text style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>{item.priorApproval!.approvedAmountDisplay}</Text>
              </div>
            }
            description={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>{item.vendor.bu} · {item.vendor.region} · {item.priorApproval!.approverName}</Text>
                {item.priorApproval!.needsReassessment && <Tag color="warning" style={{ margin: 0, fontSize: 10 }}>Update</Tag>}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}

function parseAmount(d: string): number {
  const num = parseFloat(d.replace(/[^\d.]/g, "")) || 0;
  return /Cr/i.test(d) ? num * 1e7 : /L/i.test(d) ? num * 1e5 : num;
}
function initialsFromName(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}
