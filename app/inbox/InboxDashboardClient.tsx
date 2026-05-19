"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, Col, Row, Statistic, Tabs, Button, Space, Tag, Typography, Alert } from "antd";
import { CheckCircleFilled, ClockCircleFilled, PlusOutlined, RiseOutlined, WarningFilled } from "@ant-design/icons";
import type { InboxItem } from "@/types/credit";
import type { Persona } from "@/lib/personas";
import type { QuickFilter, QuickFilterId } from "@/data/inboxMockData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EnquiriesTable } from "@/components/dashboard/EnquiriesTable";
import { PipelineChart, type PipelineSegment } from "@/components/dashboard/PipelineChart";
import { QuotaGauge } from "@/components/dashboard/QuotaGauge";
import { TopVendorsList } from "@/components/dashboard/TopVendorsList";

const { Text } = Typography;

type Kpi = { title: string; value: string | number; color: string; iconKey: "clock" | "warning" | "check" | "rise"; delta?: string; subtitle?: string };

const iconMap = {
  clock:   <ClockCircleFilled />,
  warning: <WarningFilled />,
  check:   <CheckCircleFilled />,
  rise:    <RiseOutlined />,
};

export function InboxDashboardClient({
  persona, filters, counts, visible, effectiveItems, pipelineSegments, kpis, active,
}: {
  persona: Persona; filters: QuickFilter[]; counts: Record<QuickFilterId, number>;
  visible: InboxItem[]; effectiveItems: InboxItem[];
  pipelineSegments: PipelineSegment[]; kpis: Kpi[]; active: QuickFilterId;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const forwarded = searchParams.get("forwarded");
    const sent      = searchParams.get("sent");
    const approved  = searchParams.get("approved");
    const returned  = searchParams.get("returned");
    if (forwarded) setToast({ title: "Forwarded to Underwriter", body: `Case ${forwarded.toUpperCase()} is now in Kushagra's queue.` });
    else if (sent)      setToast({ title: "Sent to Approver",         body: `Case ${sent.toUpperCase()} is now in Sukesh's queue.` });
    else if (approved)  setToast({ title: "Approved",                 body: `Case ${approved.toUpperCase()} has been approved.` });
    else if (returned)  setToast({ title: "Returned for revision",    body: `Case ${returned.toUpperCase()} is back with the underwriter.` });
    if (forwarded || sent || approved || returned) {
      const params = new URLSearchParams(searchParams.toString());
      ["forwarded", "sent", "approved", "returned"].forEach(k => params.delete(k));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("filter");
    else params.set("filter", key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const showNewRequest = persona.id === "sales";
  const hideOriginator = persona.id === "sales";

  return (
    <DashboardShell persona={persona} pageTitle="Credit Enquiries"
      breadcrumb={[{ label: "Underwrite", href: "/inbox" }, { label: "Credit Enquiries" }]}
      actions={showNewRequest ? <Button type="primary" icon={<PlusOutlined />} size="middle">New Request</Button> : undefined}
      activeKey="enquiries">
      {toast && (
        <Alert type="success" showIcon closable message={toast.title} description={toast.body} onClose={() => setToast(null)} style={{ marginBottom: 20 }} />
      )}
      <Row gutter={[16, 16]}>
        {kpis.map((k) => (
          <Col xs={24} sm={12} lg={6} key={k.title}>
            <Card variant="outlined" styles={{ body: { padding: "16px 20px" } }}>
              <Statistic
                title={
                  <Space size={6} align="center">
                    <span style={{ color: k.color, fontSize: 14, display: "inline-flex" }}>{iconMap[k.iconKey]}</span>
                    <span style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.title}</span>
                  </Space>
                }
                value={k.value}
                valueStyle={{ fontSize: 28, fontWeight: 600, color: "#0F172A", letterSpacing: "-0.015em", lineHeight: 1.1 }}
                suffix={k.delta ? (
                  <span style={{ fontSize: 12, color: k.delta.startsWith("+") ? "#1F8A4E" : "#B91C1C", marginLeft: 8 }}>{k.delta}</span>
                ) : undefined}
              />
              {k.subtitle && (<Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 6 }}>{k.subtitle}</Text>)}
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card variant="outlined" title="Pipeline this quarter" extra={<Text type="secondary" style={{ fontSize: 12 }}>Cases by stage</Text>}>
            <PipelineChart segments={pipelineSegments} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card variant="outlined" title="Approval quota" extra={<Text type="secondary" style={{ fontSize: 12 }}>This month</Text>}>
            <QuotaGauge approvedAmountDisplay="₹8.6 Cr" approvedPct={64} targetDisplay="₹13.5 Cr" />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card variant="outlined" styles={{ body: { padding: 0 } }}
            title={
              <Tabs size="small" activeKey={active} onChange={handleTabChange}
                items={filters.map((f) => ({
                  key: f.id,
                  label: (<Space size={6}><span>{f.label}</span><Tag style={{ margin: 0, fontVariantNumeric: "tabular-nums" }}>{counts[f.id]}</Tag></Space>),
                }))}
                tabBarStyle={{ marginBottom: 0 }}
              />
            }>
            <EnquiriesTable items={visible} hideOriginator={hideOriginator} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card variant="outlined" title="Top vendors" extra={<Text type="secondary" style={{ fontSize: 12 }}>By active limit</Text>}>
            <TopVendorsList items={effectiveItems} />
          </Card>
        </Col>
      </Row>
    </DashboardShell>
  );
}
