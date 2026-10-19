const { test } = require('node:test');
const assert = require('node:assert/strict');
const { student, createGreeting } = require('./hello.js');
test('greeting includes provided student identity and runtime', () => {
  assert.equal(student.studentId, '68543210068-1');
  assert.equal(createGreeting(student), 'Hello Wijitsin Fangyen (68543210068-1) | OS: ' + process.platform + ' | Node: ' + process.version);
});
