import { ThemeConfig } from "antd/es/config-provider/context";

export const theme:ThemeConfig = {
  cssVar: true,
  token: {
    colorPrimary: "var(--color-primary)",
    colorPrimaryHover: "var(--color-primary-light)",
    borderRadius: 5,
    colorBgContainer: "var(--color-bg-primary)",
    colorText: "var(--color-text)",
    colorTextSecondary: "var(--color-text-secondary)",
  },

  components: {
    Button: {
      colorPrimary: "var(--color-primary)",
      colorPrimaryHover: "var(--color-primary-light)",
    },
    Modal: {
      contentBg: "var(--color-bg-primary)",
      colorText: "var(--color-text)",
      titleColor: "var(--color-primary)",
    },
    Popconfirm: {
      fontSize:16,
      marginXS: 20,
    },
    Switch: {
      colorPrimary: "var(--color-primary)",
      colorBgBase: "var(--color-bg-primary)",
      colorPrimaryHover: "var(--color-primary-light)",
    },
    DatePicker: {
      cellActiveWithRangeBg: "var(--color-primary)",
    },
    Input: {
      colorPrimary: "var(--color-primary)",
      borderRadius: 5,
      colorPrimaryHover: "var(--color-primary-light)",
    },
  },
  
};
