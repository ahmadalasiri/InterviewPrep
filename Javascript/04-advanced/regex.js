// Regular Expressions in JavaScript

console.log("=== Regular Expressions ===\n");

// 1. Creating Regular Expressions
console.log("--- Creating Regex ---");

const regex1 = /pattern/;
const regex2 = new RegExp('pattern');
const regex3 = new RegExp('pattern', 'gi'); // With flags

console.log(regex1.test('pattern')); // true
console.log(regex2.test('Pattern')); // false (case-sensitive)
console.log(regex3.test('Pattern')); // true (case-insensitive)

// 2. Basic Pattern Matching
console.log("\n--- Basic Patterns ---");

const text = 'The quick brown fox jumps over the lazy dog';

console.log(/quick/.test(text)); // true
console.log(/slow/.test(text)); // false
console.log(text.match(/fox/)); // ['fox']
console.log(text.search(/brown/)); // 10 (index)

// 3. Flags
console.log("\n--- Flags ---");

const str = 'Hello World Hello';

console.log(str.match(/hello/)); // null (case-sensitive)
console.log(str.match(/hello/i)); // ['Hello'] (case-insensitive)
console.log(str.match(/hello/gi)); // ['Hello', 'Hello'] (global + case-insensitive)
console.log(/^Hello/.test(str)); // true (^ = start of string)
console.log(/Hello$/.test(str)); // true ($ = end of string)

// m = multiline, u = unicode, y = sticky, s = dotAll

// 4. Character Classes
console.log("\n--- Character Classes ---");

console.log(/[abc]/.test('apple')); // true (contains a, b, or c)
console.log(/[^abc]/.test('abc')); // false (^ = not)
console.log(/[0-9]/.test('Room 123')); // true (digit)
console.log(/[a-z]/.test('ABC')); // false (lowercase only)
console.log(/[A-Za-z0-9]/.test('Test123')); // true

// 5. Metacharacters
console.log("\n--- Metacharacters ---");

console.log(/\d/.test('Room 5')); // true (\d = digit [0-9])
console.log(/\D/.test('ABC')); // true (\D = non-digit)
console.log(/\w/.test('hello')); // true (\w = word char [A-Za-z0-9_])
console.log(/\W/.test('!')); // true (\W = non-word char)
console.log(/\s/.test('hello world')); // true (\s = whitespace)
console.log(/\S/.test('hello')); // true (\S = non-whitespace)
console.log(/./.test('')); // false (. = any char except newline)

// 6. Quantifiers
console.log("\n--- Quantifiers ---");

console.log(/\d+/.test('123')); // true (+ = 1 or more)
console.log(/\d*/.test('abc')); // true (* = 0 or more)
console.log(/\d?/.test('abc')); // true (? = 0 or 1)
console.log(/\d{3}/.test('12')); // false ({3} = exactly 3)
console.log(/\d{3}/.test('123')); // true
console.log(/\d{2,4}/.test('12345')); // true ({2,4} = 2 to 4)
console.log(/\d{2,}/.test('123')); // true ({2,} = 2 or more)

// 7. Greedy vs Lazy Matching
console.log("\n--- Greedy vs Lazy ---");

const html = '<div>Content</div><div>More</div>';

console.log(html.match(/<div>.*<\/div>/)); // Greedy: matches entire string
console.log(html.match(/<div>.*?<\/div>/)); // Lazy: matches first <div>

// 8. Groups and Capturing
console.log("\n--- Groups ---");

const date = '2024-10-05';
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const match = date.match(dateRegex);

console.log(match[0]); // '2024-10-05' (full match)
console.log(match[1]); // '2024' (first group)
console.log(match[2]); // '10' (second group)
console.log(match[3]); // '05' (third group)

// Named groups
const dateRegex2 = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match2 = date.match(dateRegex2);
console.log(match2.groups); // { year: '2024', month: '10', day: '05' }

// 9. Non-Capturing Groups
console.log("\n--- Non-Capturing Groups ---");

const url = 'https://example.com';
const urlRegex1 = /(https?):\/\/(.+)/;
const urlRegex2 = /(?:https?):\/\/(.+)/; // Non-capturing (?:...)

console.log(url.match(urlRegex1)); // ['https://example.com', 'https', 'example.com']
console.log(url.match(urlRegex2)); // ['https://example.com', 'example.com']

// 10. Lookahead and Lookbehind
console.log("\n--- Lookahead and Lookbehind ---");

// Positive lookahead (?=...)
console.log('hello123'.match(/\w+(?=\d)/)); // ['hello'] (followed by digit)

// Negative lookahead (?!...)
console.log('hello'.match(/\w+(?!\d)/)); // ['hello'] (not followed by digit)

// Positive lookbehind (?<=...)
console.log('$100'.match(/(?<=\$)\d+/)); // ['100'] (preceded by $)

// Negative lookbehind (?<!...)
console.log('100'.match(/(?<!\$)\d+/)); // ['100'] (not preceded by $)

// 11. String Methods with Regex
console.log("\n--- String Methods ---");

const sentence = 'The rain in Spain falls mainly in the plain';

// match
console.log(sentence.match(/ain/g)); // ['ain', 'ain', 'ain', 'ain']

// matchAll
const matches = sentence.matchAll(/(\w+)ain/g);
for (const match of matches) {
  console.log(`Found ${match[0]} at index ${match.index}`);
}

// replace
console.log(sentence.replace(/ain/g, '***')); // Replace all

// replaceAll
console.log(sentence.replaceAll(/ain/g, '###'));

// search
console.log(sentence.search(/Spain/)); // 12

// split
console.log('a1b2c3'.split(/\d/)); // ['a', 'b', 'c', '']

// 12. Regex Object Methods
console.log("\n--- Regex Methods ---");

const pattern = /test/g;
const testStr = 'test test test';

// test
console.log(pattern.test(testStr)); // true

// exec
const execMatch = pattern.exec(testStr);
console.log(execMatch); // ['test', index: 0, ...]
console.log(pattern.lastIndex); // 4 (position after match)

// 13. Common Patterns
console.log("\n--- Common Patterns ---");

// Email validation (simple)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test('user@example.com')); // true
console.log(emailRegex.test('invalid.email')); // false

// Phone number (US format)
const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
console.log(phoneRegex.test('123-456-7890')); // true
console.log(phoneRegex.test('(123) 456-7890')); // true

// URL
const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/;
console.log(urlPattern.test('https://example.com')); // true

// Hex color
const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
console.log(hexRegex.test('#FF5733')); // true
console.log(hexRegex.test('#F57')); // true

// 14. Password Validation
console.log("\n--- Password Validation ---");

function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const hasLength = /.{8,}/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasLength && hasUpper && hasLower && hasNumber;
}

console.log(validatePassword('Password123')); // true
console.log(validatePassword('weak')); // false

// Using lookaheads (more elegant)
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
console.log(strongPassword.test('Password123')); // true

// 15. Practical Examples
console.log("\n--- Practical Examples ---");

// Extract hashtags
const tweet = 'Learning #JavaScript and #RegEx today! #coding';
const hashtags = tweet.match(/#\w+/g);
console.log(hashtags); // ['#JavaScript', '#RegEx', '#coding']

// Parse query string
const queryString = 'name=John&age=30&city=NYC';
const params = {};
queryString.replace(/([^&=]+)=([^&]*)/g, (match, key, value) => {
  params[key] = value;
});
console.log(params); // { name: 'John', age: '30', city: 'NYC' }

// Remove HTML tags
const htmlText = '<p>Hello <strong>World</strong>!</p>';
console.log(htmlText.replace(/<[^>]*>/g, '')); // 'Hello World!'

// Format phone number
const phoneNumber = '1234567890';
const formatted = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
console.log(formatted); // '(123) 456-7890'

// Validate credit card (Luhn algorithm not included)
const creditCardRegex = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;
console.log(creditCardRegex.test('1234-5678-9012-3456')); // true

// Extract numbers from string
const mixedText = 'Price: $25.99, Quantity: 3';
const numbers = mixedText.match(/\d+\.?\d*/g);
console.log(numbers); // ['25.99', '3']

// 16. Word Boundaries
console.log("\n--- Word Boundaries ---");

const text2 = 'The cat scattered the cats';
console.log(text2.match(/cat/g)); // ['cat', 'cat', 'cat'] (3 matches)
console.log(text2.match(/\bcat\b/g)); // ['cat'] (1 match - whole word only)

// 17. Escaping Special Characters
console.log("\n--- Escaping ---");

const specialChars = 'Price: $5.00';
console.log(/\$\d+\.\d{2}/.test(specialChars)); // true

// Escape function
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log(escapeRegex('$5.00')); // '\$5\.00'

console.log("\n--- Summary ---");
console.log("✓ /pattern/flags or new RegExp('pattern', 'flags')");
console.log("✓ Flags: g (global), i (case-insensitive), m (multiline)");
console.log("✓ \\d (digit), \\w (word), \\s (space), . (any)");
console.log("✓ Quantifiers: + (1+), * (0+), ? (0-1), {n,m}");
console.log("✓ Groups: (group), (?:non-capturing), (?<name>named)");
console.log("✓ Lookahead: (?=...), Lookbehind: (?<=...)");
console.log("✓ Methods: test, exec, match, replace, split");
