import { ThemeConfig } from "antd/es/config-provider/context";

export const theme:ThemeConfig = {
  cssVar: true,
  token: {
    colorPrimary: "var(--color-primary)",
    borderRadius: 2,
    colorBgContainer: "var(--color-bg-primary)",
    colorText: "var(--color-text)",
    colorTextSecondary: "var(--color-text-secondary)",
  },

  components: {
    Button: {
      colorPrimary: "var(--color-primary)",
      colorPrimaryHover: "var(--color-primary-light)",
    },
    Input: {
      colorPrimary: "var(--color-primary)",
      borderRadius: 5,
      colorPrimaryHover: "var(--color-primary-light)",
    },
  },
  
};
