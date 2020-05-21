const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const process = require('process');

const TAP_CONTENTS = `
ok 1 - ../test_tap.c:test_tap:test_tap_successful: Passed
not ok 2 - ../test_tap.c:test_tap:test_tap_fails: Assertion '0 != 0' failed: 0 == 0, 0 == 0
1..2
`;

const TAP_RESULTS = `
::set-output name=tap_count::2
::set-output name=tap_pass::1
::set-output name=tap_fail::1`;

const EMPTY_RESULTS = `
::set-output name=tap_count::0
::set-output name=tap_pass::0
::set-output name=tap_fail::0`;

describe('Main Tests', () => {
  let testDirPath = '';
  let testFilePath = '';
  beforeAll(() => {
    testDirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'main-test-'));
    const tapDir = path.join(testDirPath, 'tap');
    testFilePath = path.join(tapDir, 'tap.tap');
    fs.mkdirSync(tapDir);
    fs.writeFileSync(testFilePath, TAP_CONTENTS);
  });

  afterAll(() => {
    fs.rmdirSync(testDirPath, { recursive: true });
  });

  test('parsing tap results', () => {
    const { env } = process;
    env.INPUT_TAP_DIRECTORY = testDirPath;
    env.INPUT_TAP_EXTENSION = '.tap';
    const ip = path.join(__dirname, 'main.js');
    const results = cp.execSync(`node ${ip}`, { env }).toString();
    expect(results.trim()).toStrictEqual(TAP_RESULTS.trim());
  });

  test('parsing no results', () => {
    const { env } = process;
    env.INPUT_TAP_DIRECTORY = '.';
    env.INPUT_TAP_EXTENSION = '.tap';
    const ip = path.join(__dirname, 'main.js');
    const results = cp.execSync(`node ${ip}`, { env }).toString();
    expect(results.trim()).toStrictEqual(EMPTY_RESULTS.trim());
  });
});
