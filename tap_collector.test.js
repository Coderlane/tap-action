const fs = require('fs');
const path = require('path');
const os = require('os');
const collector = require('./tap_collector');

const TAP_CONTENTS = `
ok 1 - ../test_tap.c:test_tap:test_tap_successful: Passed
not ok 2 - ../test_tap.c:test_tap:test_tap_fails: Assertion '0 != 0' failed: 0 == 0, 0 == 0
1..2
`;

const TAP_RESULTS = {
  ok: false,
  count: 2,
  pass: 1,
  fail: 1,
  bailout: false,
  todo: 0,
  skip: 0,
  plan: {
    comment: '',
    end: 2,
    skipAll: false,
    skipReason: '',
    start: 1,
  },
  failures: [
    {
      fullname: '',
      id: 2,
      name: "../test_tap.c:test_tap:test_tap_fails: Assertion '0 != 0' failed: 0 == 0, 0 == 0",
      ok: false,
    },
  ],
  time: null,
};

describe('Collector Tests', () => {
  let testDirPath = '';
  let testFilePath = '';
  beforeAll(() => {
    testDirPath = fs.mkdtempSync(path.join(os.tmpdir(), 'tap-collector-test-'));
    const tapDir = path.join(testDirPath, 'tap');
    testFilePath = path.join(tapDir, 'tap.tap');
    fs.mkdirSync(tapDir);
    fs.writeFileSync(testFilePath, TAP_CONTENTS);
  });

  afterAll(() => {
    fs.rmSync(testDirPath, { recursive: true });
  });

  test('discovers tap files', () => expect(collector.discover(
    testDirPath, '.tap',
  )).resolves.toStrictEqual([testFilePath]));

  test('collects tap files', async () => {
    const results = await collector.collect([testFilePath]);
    const expectedResults = new Map();
    expectedResults.set(testFilePath, TAP_RESULTS);
    expect(results).toEqual(expectedResults);
  });
});
