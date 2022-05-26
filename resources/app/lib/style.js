export const getColor = varName => getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`)
