import next from 'eslint-config-next';

const eslintConfig = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    rules: {
      // Idiomatic, safe patterns trip this v16 rule: the SSR-safe portal mount
      // gate (`useEffect(() => setMounted(true), [])`) and resetting state when
      // an effect's deps change (TypingTitle). Keep it as an advisory warning
      // rather than a hard error.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default eslintConfig;
