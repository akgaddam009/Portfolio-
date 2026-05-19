"use client";

import { useState, useTransition } from "react";
import { Layout, Menu, Typography, Avatar, Button, Dropdown, theme, Breadcrumb } from "antd";
import { AppstoreOutlined, InboxOutlined, TeamOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined, BellOutlined, SearchOutlined, ThunderboltFilled } from "@ant-design/icons";
import type { ReactNode } from "react";
import type { Persona } from "@/lib/personas";
import { signOut } from "@/app/actions/persona";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const accentBg: Record<Persona["accent"], string> = {
  indigo:  "#3F3FB3",
  amber:   "#C97A11",
  emerald: "#1F8A4E",
  rose:    "#B91C1C",
};

export function DashboardShell({
  persona, pageTitle, breadcrumb, actions, children, activeKey = "enquiries",
}: {
  persona: Persona; pageTitle: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: ReactNode; children: ReactNode; activeKey?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { token } = theme.useToken();
  const handleSignOut = () => startTransition(() => signOut() as unknown as void);

  const menuItems = [
    { key: "overview",  icon: <AppstoreOutlined />, label: "Overview" },
    { key: "enquiries", icon: <InboxOutlined />,    label: "Credit Enquiries" },
    { key: "vendors",   icon: <TeamOutlined />,     label: "Vendors" },
    { key: "reports",   icon: <BarChartOutlined />, label: "Reports" },
    { key: "settings",  icon: <SettingOutlined />,  label: "Settings" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} collapsedWidth={64} collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg"
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "auto", borderRight: `1px solid ${token.colorBorderSecondary}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px", borderBottom: `1px solid ${token.colorBorderSecondary}`, height: 56 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#0F172A", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ThunderboltFilled style={{ fontSize: 16 }} />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 20, color: "#0F172A", letterSpacing: "-0.01em" }}>Underwrite</span>
          )}
        </div>
        <Menu mode="inline" selectedKeys={[activeKey]} items={menuItems} style={{ borderRight: 0, paddingTop: 8 }} />
      </Sider>
      <Layout>
        <Header style={{ position: "sticky", top: 0, zIndex: 10, borderBottom: `1px solid ${token.colorBorderSecondary}`, display: "flex", alignItems: "center", gap: 16 }}>
          {breadcrumb && breadcrumb.length > 0 ? (
            <Breadcrumb items={breadcrumb.map((b) => ({ title: b.href ? <a href={b.href}>{b.label}</a> : b.label }))} style={{ fontSize: 13 }} />
          ) : (
            <Text strong style={{ fontSize: 15 }}>{pageTitle}</Text>
          )}
          <div style={{ flex: 1 }} />
          <Button type="text" icon={<SearchOutlined />} aria-label="Search" />
          <Button type="text" icon={<BellOutlined />} aria-label="Notifications" />
          <Dropdown menu={{
            items: [
              { key: "info", label: (
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{persona.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>{persona.role}</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{persona.email}</div>
                </div>
              ), disabled: true },
              { type: "divider" },
              { key: "signout", icon: <LogoutOutlined />, label: "Switch persona", onClick: handleSignOut, disabled: isPending },
            ],
          }} placement="bottomRight" trigger={["click"]}>
            <button type="button" style={{ background: "transparent", border: 0, padding: 0, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }} aria-label="Account menu">
              <Avatar size={30} style={{ background: accentBg[persona.accent], color: "#FFFFFF", fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{persona.initials}</Avatar>
            </button>
          </Dropdown>
        </Header>
        <div style={{ padding: "20px 24px 0", background: token.colorBgLayout, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{persona.role}</Text>
            <div style={{ marginTop: 4 }}>
              <Text style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 32, color: "#0F172A", lineHeight: 1, letterSpacing: "-0.015em" }}>{pageTitle}</Text>
            </div>
          </div>
          {actions}
        </div>
        <Content style={{ padding: 24, background: token.colorBgLayout }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
