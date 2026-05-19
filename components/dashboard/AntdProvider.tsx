"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import type { ReactNode } from "react";

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.compactAlgorithm,
        token: {
          colorPrimary: "#0F766E",
          colorInfo:    "#3F3FB3",
          colorSuccess: "#1F8A4E",
          colorWarning: "#C97A11",
          colorError:   "#B91C1C",
          fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
          fontSize: 13,
          fontSizeLG: 15,
          fontSizeSM: 12,
          fontSizeXL: 18,
          colorBgBase: "#FFFFFF",
          colorBgLayout: "#F5F4F1",
          colorBgContainer: "#FFFFFF",
          colorBorderSecondary: "#E7E5DF",
          borderRadius: 8,
          borderRadiusLG: 12,
          padding: 16,
          paddingLG: 20,
          paddingSM: 12,
          paddingXS: 8,
        },
        components: {
          Layout: { headerBg: "#FFFFFF", headerHeight: 56, headerPadding: "0 24px", siderBg: "#FFFFFF", bodyBg: "#F5F4F1", footerBg: "#FFFFFF" },
          Menu: { itemSelectedBg: "#F0EFEA", itemSelectedColor: "#0F172A", itemHoverBg: "#F5F4F1", iconSize: 16, collapsedIconSize: 18 },
          Card: { headerHeight: 48, headerFontSize: 14, headerFontSizeSM: 13, paddingLG: 20 },
          Statistic: { titleFontSize: 12, contentFontSize: 26 },
          Table: { headerBg: "#FAFAF8", rowHoverBg: "#F5F4F1", cellPaddingBlock: 12, cellPaddingInline: 16, fontSize: 13, headerColor: "#475569" },
          Tag: { defaultBg: "#F1F0EB", defaultColor: "#475569" },
          Button: { controlHeight: 32, controlHeightLG: 36, fontWeight: 500 },
          Progress: { defaultColor: "#0F766E" },
          Typography: { titleMarginBottom: "0.25em" },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
