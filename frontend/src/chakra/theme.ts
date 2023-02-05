import { extendTheme, ThemeConfig } from "@chakra-ui/react"

export const theme = extendTheme(
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    }
  },
  {
    colors: {
      brand: {
        100: "#3d84f7",
      },
    },
    styles: {
      global: {
        body: {
          bg: 'whiteAlpha.200'
        }
      }
    }
  })