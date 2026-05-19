"use client";

import { Table, Tag, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import type { InboxItem, CaseStatus } from "@/types/credit";

const { Text } = Typography;

const statusTagProps: Record<CaseStatus, { color: string; text: string }> = {
  "draft":                  { color: "default",  text: "Pending verification" },
  "cpa-verified":           { color: "processing", text: "CPA verified" },
  "underwriter-reviewing":  { color: "processing", text: "Underwriter review" },
  "approver-pending":       { color: "warning",  text: "Approver pending" },
  "approved":               { color: "success",  text: "Approved" },
  "rejected":               { color: "error",    text: "Rejected" },
};

export function EnquiriesTable({ items, hideOriginator = false }: { items: InboxItem[]; hideOriginator?: boolean }) {
  const columns: ColumnsType<InboxItem> = [
    {
      title: "Request", dataIndex: ["vendor", "name"], key: "vendor",
      render: (_, item) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <Link href={`/case/${item.id}`} style={{ color: "#0F172A", fontWeight: 500, fontSize: 13, lineHeight: 1.3 }}>{item.vendor.name}</Link>
          <Text type="secondary" style={{ fontSize: 11 }}>{item.id.toUpperCase()} · {item.vendor.constitution} · {item.vendor.bu} · {item.vendor.region}</Text>
        </div>
      ),
    },
    { title: "Amount", dataIndex: "requestedDisplay", key: "amount", width: 110, align: "right",
      render: (v: string) => <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 500, color: "#0F172A" }}>{v}</span> },
    ...(!hideOriginator ? [{ title: "Originator", dataIndex: "submittedBy", key: "submittedBy", width: 130, render: (v: string) => <Text style={{ fontSize: 12 }}>{v}</Text> } as ColumnsType<InboxItem>[number]] : []),
    { title: "Submitted", dataIndex: "submittedAtDisplay", key: "submittedAt", width: 120, responsive: ["lg"], render: (v: string) => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text> },
    { title: "Status", dataIndex: "status", key: "status", width: 180, render: (s: CaseStatus) => { const meta = statusTagProps[s]; return <Tag color={meta.color}>{meta.text}</Tag>; } },
    { title: "Prior approval", key: "prior", width: 200, responsive: ["xl"],
      render: (_, item) => item.priorApproval ? (
        <Space size={4} style={{ fontSize: 12, color: "#64748B" }}>
          <CheckCircleFilled style={{ color: "#1F8A4E", fontSize: 12 }} />
          <span style={{ color: "#0F172A" }}>{item.priorApproval.approvedAmountDisplay}</span>
          <span>· {item.priorApproval.approvedDateDisplay}</span>
          {item.priorApproval.needsReassessment && <ExclamationCircleFilled style={{ color: "#C97A11", fontSize: 12 }} />}
        </Space>
      ) : <Text type="secondary" style={{ fontSize: 12 }}>New vendor</Text>,
    },
  ];
  return (
    <Table<InboxItem> rowKey="id" dataSource={items} columns={columns} size="middle"
      pagination={items.length > 10 ? { pageSize: 10, showSizeChanger: false } : false}
      locale={{ emptyText: "No enquiries match this filter." }} />
  );
}
