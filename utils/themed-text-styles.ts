/**
 * ThemedText style mappings
 * Centralized styling logic for ThemedText component
 */

export const TEXT_TYPE_STYLES = {
  title: {
    fontSize: '$10',
    fontWeight: '$7',
    lineHeight: '$10',
  },
  subtitle: {
    fontSize: '$8',
    fontWeight: '$5',
    lineHeight: '$8',
  },
  defaultSemiBold: {
    fontSize: '$6',
    fontWeight: '$4',
    lineHeight: '$6',
  },
  default: {
    fontSize: '$6',
    fontWeight: '$2',
    lineHeight: '$6',
  },
  link: {
    fontSize: '$6',
    fontWeight: '$2',
    lineHeight: '$6',
  },
} as const;

/**
 * Get style properties for a text type
 */
export function getTextTypeStyles(type: keyof typeof TEXT_TYPE_STYLES) {
  return TEXT_TYPE_STYLES[type] || TEXT_TYPE_STYLES.default;
}

