// Module-level cache for dynamic link utils discovery
const linkUtilsCache = new Map();
const fs = require('fs');
const path = require('path');
const urlFunctionNames = new Set(['url', 'link']); // For detecting URL-handling functions

/**
 * Dynamically discover link utilities files by analyzing project structure
 */
function discoverLinkUtilsFiles(projectRoot) {
  const cacheKey = `linkutils:${projectRoot}`;
  if (linkUtilsCache.has(cacheKey)) {
    return linkUtilsCache.get(cacheKey);
  }

  const linkUtilsFiles = new Set();

  function scanForLinkUtils(dir, relativePath = '') {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'coverage', '.expo'].includes(item)) {
          scanForLinkUtils(fullPath, path.join(relativePath, item));
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
          // Check if this file contains link utilities (window.open, Linking, etc.)
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('window.open') || content.includes('Linking.openURL') || content.includes('Actions.url')) {
              const normalizedPath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
              linkUtilsFiles.add(normalizedPath);
            }
          } catch (_error) {
            // Skip files that can't be read
          }
        }
      }
    } catch (_error) {
      // Skip directories that can't be read
    }
  }

  // Scan common locations for link utilities
  const commonLocations = ['lib', 'utils', 'src', 'app'];
  for (const location of commonLocations) {
    const fullLocation = path.join(projectRoot, location);
    if (fs.existsSync(fullLocation)) {
      scanForLinkUtils(fullLocation, location);
    }
  }

  linkUtilsCache.set(cacheKey, linkUtilsFiles);
  return linkUtilsFiles;
}

// Custom rule to enforce XAction with Actions.url() usage for all links
const enforceXActionLinksRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce use of XAction with Actions.url() instead of direct window.open, Linking.openURL calls, or old link components for centralized tracking',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create: function (context) {
    // Cache filename for reuse
    const filename = context.getFilename();
    const projectRoot = context.getCwd();
    const relativeFilename = path.relative(projectRoot, filename).replace(/\\/g, '/');

    // Dynamically discover link utils files instead of hardcoding
    const linkUtilsFiles = discoverLinkUtilsFiles(projectRoot);
    const isLinkUtilsFile = linkUtilsFiles.has(relativeFilename);

    return {
      // Detect direct window.open calls
      CallExpression: function (node) {
        // Early return: Allow window.open and Linking.openURL only in linkUtils.ts
        if (isLinkUtilsFile) {
          return;
        }

        // Check for window.open calls (optimized property access)
        if (node.callee?.object?.name === 'window' && node.callee?.property?.name === 'open') {
          context.report({
            node: node,
            message: 'Direct window.open calls are not allowed. Use XAction with Actions.url() instead for cross-platform compatibility and centralized tracking.',
          });
        }

        // Check for Linking.openURL calls (optimized property access)
        if (node.callee?.object?.name === 'Linking' && node.callee?.property?.name === 'openURL') {
          context.report({
            node: node,
            message: 'Direct Linking.openURL calls are not allowed. Use XAction with Actions.url() instead for consistent behavior and centralized tracking.',
          });
        }
      },

      // Detect TouchableOpacity with onPress that opens links or Link elements containing XAction
      JSXElement: function (node) {
        const elementName = node.openingElement?.name?.name;

        // Handle TouchableOpacity with onPress that opens links
        if (elementName === 'TouchableOpacity') {
          const onPressAttr = node.openingElement.attributes.find(attr => attr.name?.name === 'onPress');

          if (onPressAttr?.value?.expression?.body?.body) {
            const statements = onPressAttr.value.expression.body.body;

            // Combined check for all problematic patterns in single iteration
            let hasWindowOpen = false;
            let hasLinkingOpenURL = false;
            let hasUrlFunctionCall = false;

            for (const stmt of statements) {
              const callee = stmt.expression?.callee;
              if (!callee) continue;

              // Check for window.open
              if (callee.object?.name === 'window' && callee.property?.name === 'open') {
                hasWindowOpen = true;
                break;
              }

              // Check for Linking.openURL
              if (callee.object?.name === 'Linking' && callee.property?.name === 'openURL') {
                hasLinkingOpenURL = true;
                break;
              }

              // Check for URL-handling function calls (O(1) Set lookup)
              if (callee.name && urlFunctionNames.has(callee.name.toLowerCase())) {
                hasUrlFunctionCall = true;
                break;
              }

              if (callee.property?.name && urlFunctionNames.has(callee.property.name.toLowerCase())) {
                hasUrlFunctionCall = true;
                break;
              }
            }

            if (hasWindowOpen) {
              context.report({
                node: onPressAttr,
                message: 'TouchableOpacity with window.open in onPress should be replaced with XAction with Actions.url().',
              });
              return;
            }

            if (hasLinkingOpenURL) {
              context.report({
                node: onPressAttr,
                message: 'TouchableOpacity with Linking.openURL in onPress should be replaced with XAction with Actions.url().',
              });
              return;
            }

            if (hasUrlFunctionCall) {
              context.report({
                node: onPressAttr,
                message: 'TouchableOpacity with URL-handling function in onPress should be replaced with XAction with Actions.url().',
              });
              return;
            }

            // Check for link-like content (XText with bodylink variant)
            const hasLinkContent = node.children?.some(child => {
              if (child.type === 'JSXElement' && child.openingElement?.name?.name === 'XText') {
                const variantAttr = child.openingElement.attributes.find(attr => attr.name?.name === 'variant');
                return variantAttr?.value?.value === 'bodylink';
              }
              return false;
            });

            if (hasLinkContent) {
              context.report({
                node: node,
                message: 'TouchableOpacity containing link-like content (XText with bodylink variant) should be replaced with XAction with Actions.url().',
              });
            }
          }
        }
        // Handle Link elements containing XAction
        else if (elementName === 'Link') {
          // Check if Link has href attribute
          const hrefAttr = node.openingElement.attributes.find(attr => attr.name?.name === 'href');

          if (hrefAttr) {
            // Check if Link contains XAction children
            const hasXActionChild = node.children?.some(child => {
              return child.type === 'JSXElement' && child.openingElement?.name?.name === 'XAction';
            });

            if (hasXActionChild) {
              context.report({
                node: node,
                message: 'Use href prop on XAction instead of wrapping with Link',
              });
            }
          }
        }
      },
    };
  },
};

module.exports = { enforceXActionLinksRule };
