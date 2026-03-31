const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.eslintConfig = {
  extends: ['react-app'],
  rules: {
    'react-hooks/exhaustive-deps': 'off'
  }
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');
console.log('✅ ESLint warnings u çaktivizuan!');