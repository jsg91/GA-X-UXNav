/**
 * @fileoverview Tests for validate-icon-props ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./validate-xicon-name');

const ruleTester = createRuleTester();

describe('validate-xicon-name', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'validate-xicon-name' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in validate-xicon-name.js');
  }

  ruleTester.run('validate-xicon-name', ruleToTest, {
    valid: [
      // Valid Material Community Icon names (verified from glyphMap)
      {
        code: '<XIcon name="airplane" size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="account" color="$content" size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="account-circle" color="$content" size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="menu" color="$content" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="cog" color="$content" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="home" color="$primary" size={16} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="plus" color="$contentSecondary" size={32} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="file" color="$contentSecondary" size={32} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="download" color="$primary" size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="alert" color="$danger" size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="shield" color="$primary" size={16} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="chevron-down" size={16} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="information" color="$primary" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="magnify" color="$contentSecondary" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="close" color="$contentSecondary" size={16} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="check" color="$primary" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="refresh" color="$contentSubtle" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="map" color="$contentSecondary" size={48} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="camera" color="$surface" size={20} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="calendar" size={16} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="clock" size={16} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="lightbulb" color="$warning" size={18} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name="rocket" size={18} />',
        filename: 'test.tsx',
      },
      // Test with JSX expression containing string literal
      {
        code: '<XIcon name={"airplane"} size={24} />',
        filename: 'test.tsx',
      },
      // Test with template literal (single quasar)
      {
        code: '<XIcon name={`airplane`} size={24} />',
        filename: 'test.tsx',
      },
      // Test with other icon-related props
      {
        code: '<Button icon="home" />',
        filename: 'test.tsx',
      },
      {
        code: '<MenuItem iconName="account" />',
        filename: 'test.tsx',
      },
      {
        code: '<Navigation startIcon="menu" endIcon="chevron-right" />',
        filename: 'test.tsx',
      },
      // Test with ternary expression (all valid icons)
      {
        code: '<XIcon name={isActive ? "check" : "close"} size={24} />',
        filename: 'test.tsx',
      },
      // Test with nested ternary (all valid icons)
      {
        code: '<XIcon name={type === "success" ? "check" : type === "error" ? "alert" : "information"} size={24} />',
        filename: 'test.tsx',
      },
      // Test with logical expression (all valid icons)
      {
        code: '<XIcon name={showHome && "home" || "menu"} size={24} />',
        filename: 'test.tsx',
      },
      // Test dynamic values (now silently ignored - no warnings)
      {
        code: '<XIcon name={variableName} size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name={getIconName()} size={24} />',
        filename: 'test.tsx',
      },
      {
        code: '<XIcon name={obj.iconName} size={24} />',
        filename: 'test.tsx',
      },
      // Test dynamic values with other icon props (also silently ignored)
      {
        code: '<Button icon={variableName} />',
        filename: 'test.tsx',
      },
      {
        code: '<MenuItem iconName={getIconName()} />',
        filename: 'test.tsx',
      },
    ],
    invalid: [
      // Invalid icon names
      {
        code: '<XIcon name="invalid-icon-name" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "invalid-icon-name"\./,
          },
        ],
      },
      {
        code: '<XIcon name="not-a-real-icon" color="$primary" />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "not-a-real-icon"\./,
          },
        ],
      },
      // Test other icon-related props with invalid names
      {
        code: '<Button icon="invalid-icon-name" />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "invalid-icon-name"\./,
          },
        ],
      },
      {
        code: '<MenuItem iconName="not-a-real-icon" />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "not-a-real-icon"\./,
          },
        ],
      },
      {
        code: '<XIcon name="fake-icon-123" size={16} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "fake-icon-123"\./,
          },
        ],
      },
      // Test with JSX expression containing string literal
      {
        code: '<XIcon name={"invalid-icon-name"} size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "invalid-icon-name"\./,
          },
        ],
      },
      // Test with template literal (single quasar)
      {
        code: '<XIcon name={`invalid-icon-name`} size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "invalid-icon-name"\./,
          },
        ],
      },
      // Test with suggestion (similar icon name)
      {
        code: '<XIcon name="airplain" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "airplain"\. Did you mean: airplane\?/,
          },
        ],
      },
      {
        code: '<XIcon name="hom" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "hom"\. Did you mean:/,
          },
        ],
      },
      {
        code: '<XIcon name="clendar" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "clendar"\. Did you mean:/,
          },
        ],
      },
      // Test with icon names that were used in codebase but are invalid
      {
        code: '<XIcon name="file-text" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "file-text"\./,
          },
        ],
      },
      {
        code: '<XIcon name="alert-triangle" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "alert-triangle"\./,
          },
        ],
      },
      // shield-alert is actually valid, so removing this test
      // Test with no suggestions available
      {
        code: '<XIcon name="xyzabcdef" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "xyzabcdef"\. Use a valid Material Community Icon name\./,
          },
        ],
      },
      // Test with very long invalid name
      {
        code: '<XIcon name="this-is-a-very-long-invalid-icon-name-that-should-not-have-suggestions" size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "this-is-a-very-long-invalid-icon-name-that-should-not-have-suggestions"\. Use a valid Material Community Icon name\./,
          },
        ],
      },
      // Test other icon-related props with invalid names
      {
        code: '<Button icon="xyzabcdef" />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "xyzabcdef"\. Use a valid Material Community Icon name\./,
          },
        ],
      },
      // Test with ternary expression containing invalid icons
      {
        code: '<XIcon name={isActive ? "check-mark" : "close"} size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "check-mark"\./,
          },
        ],
      },
      // Test with nested ternary containing invalid icon
      {
        code: '<XIcon name={type === "card" ? "credit-card" : type === "paypal" ? "cash-multiple" : "building-2"} size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "cash-multiple"\./,
          },
          {
            message: /Invalid icon name "building-2"\./,
          },
        ],
      },
      // Test with logical expression containing invalid icon
      {
        code: '<XIcon name={showHome && "home-icon" || "menu"} size={24} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "home-icon"\./,
          },
        ],
      },
      // Test other icon-related props with ternary expressions
      {
        code: '<Button icon={isActive ? "check-mark" : "close"} />',
        filename: 'test.tsx',
        errors: [
          {
            message: /Invalid icon name "check-mark"\./,
          },
        ],
      },
      // Note: Dynamic values are now silently ignored - no warnings generated
      // Only statically analyzable string literals are validated
    ],
  });
});
