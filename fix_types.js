const fs = require('fs');
let content = fs.readFileSync('lib/database.types.ts', 'utf8');

// The typical structure is:
// Update: {
//   ...
// }

content = content.replace(/Update: \{[\s\S]*?\n\s{8}\}/g, match => {
  return match + '\n        Relationships: any[]';
});

fs.writeFileSync('lib/database.types.ts', content);
