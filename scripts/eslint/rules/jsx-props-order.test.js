/**
 * @fileoverview Tests for jsx-props-order ESLint rule
 */

const { createRuleTester } = require('../configs/rule-tester.config');
const rule = require('./jsx-props-order');

const ruleTester = createRuleTester();

describe('jsx-props-order', () => {
  // Extract the rule from the module exports
  const ruleKey = Object.keys(rule).find(key => key === 'jsx-props-order' || key.includes('Rule') || key === 'default');
  const ruleToTest = rule[ruleKey] || rule[Object.keys(rule)[0]];

  if (!ruleToTest) {
    throw new Error('Could not find rule export in jsx-props-order.js');
  }

  ruleTester.run('jsx-props-order', ruleToTest, {
    valid: [
      // Single prop (no ordering needed)
      {
        code: '<div className="test" />',
        filename: 'test.tsx',
      },

      // Correctly ordered React reserved props first
      {
        code: '<div key="1" ref={ref} className="test" />',
        filename: 'test.tsx',
      },

      // Correctly ordered layout props after reserved
      {
        code: '<div key="1" style={{ color: "red" }} className="test" />',
        filename: 'test.tsx',
      },

      // Correctly ordered layout props before event handlers
      {
        code: '<button style={{ padding: 8 }} className="btn" onClick={handleClick} />',
        filename: 'test.tsx',
      },

      // Correctly ordered common props after event handlers
      {
        code: '<input onClick={handleClick} value={value} placeholder="Enter text" />',
        filename: 'test.tsx',
      },

      // Correctly ordered XAction props
      {
        code: '<XAction variant="primary" icon="check" action="submit" size="small">Submit</XAction>',
        filename: 'test.tsx',
      },

      // Correctly ordered XText props
      {
        code: '<XText variant="body">Hello world</XText>',
        filename: 'test.tsx',
      },

      // Correctly ordered XInput props
      {
        code: '<XInput onChangeText={setName} value={name} placeholder="Enter name" variant="default" />',
        filename: 'test.tsx',
      },

      // Correctly ordered XIcon props
      {
        code: '<XIcon name="user" color="$primary" size={24} />',
        filename: 'test.tsx',
      },

      // Alphabetical ordering for regular components
      {
        code: '<div alpha="first" beta="second" gamma="third" />',
        filename: 'test.tsx',
      },

      // Mixed props in correct order
      {
        code: '<div key="1" style={{ margin: 10 }} onClick={handleClick} data-testid="test" id="element" />',
        filename: 'test.tsx',
      },

      // XAction with event handlers before component-specific props
      {
        code: '<XAction onClick={handleClick} variant="primary">Click me</XAction>',
        filename: 'test.tsx',
      },

      // No props (should pass)
      {
        code: '<div />',
        filename: 'test.tsx',
      },
    ],
    invalid: [
      // Incorrectly ordered - layout after event handler
      {
        code: '<button onClick={handleClick} style={{ padding: 8 }} className="btn" />',
        filename: 'test.tsx',
        output: '<button style={{ padding: 8 }} className="btn" onClick={handleClick} />',
        errors: [
          {
            message: /Props in button should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },

      // Incorrectly ordered - common props before event handlers
      {
        code: '<input value={value} onClick={handleClick} placeholder="Enter text" />',
        filename: 'test.tsx',
        output: '<input onClick={handleClick} value={value} placeholder="Enter text" />',
        errors: [
          {
            message: /Props in input should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },

      // Incorrectly ordered - XAction props
      {
        code: '<XAction icon="check" variant="primary" action="submit" size="small">Submit</XAction>',
        filename: 'test.tsx',
        output: '<XAction variant="primary" icon="check" action="submit" size="small">Submit</XAction>',
        errors: [
          {
            message: /Props in XAction should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },

      // Incorrectly ordered - XInput props
      {
        code: '<XInput placeholder="Enter name" variant="default" value={name} onChangeText={setName} />',
        filename: 'test.tsx',
        output: '<XInput onChangeText={setName} value={name} placeholder="Enter name" variant="default" />',
        errors: [
          {
            message: /Props in XInput should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },

      // Incorrectly ordered - XIcon props
      {
        code: '<XIcon color="$primary" name="user" size={24} />',
        filename: 'test.tsx',
        output: '<XIcon name="user" color="$primary" size={24} />',
        errors: [
          {
            message: /Props in XIcon should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },

      // Incorrectly ordered - alphabetical props
      {
        code: '<div gamma="third" alpha="first" beta="second" />',
        filename: 'test.tsx',
        output: '<div alpha="first" beta="second" gamma="third" />',
        errors: [
          {
            message: /Props in div should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },

      // Regular component with incorrect alphabetical ordering
      {
        code: '<MyComponent zebra="last" alpha="first" beta="second" />',
        filename: 'test.tsx',
        output: '<MyComponent alpha="first" beta="second" zebra="last" />',
        errors: [
          {
            message: /Props in MyComponent should be ordered: key\/ref\/layout\/handlers first, then component-specific props, then alphabetical/,
          },
        ],
      },
    ],
  });
});
