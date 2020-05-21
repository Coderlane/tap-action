const core = require('@actions/core');
const collector = require('./tap_collector');

async function run() {
  try {
    const directory = core.getInput('tap_directory');
    const extension = core.getInput('tap_extension');
    const files = await collector.discover(directory, extension);
    const results = await collector.collect(files);
    let count = 0;
    let pass = 0;
    let fail = 0;
    results.forEach((result) => {
      count += result.count;
      pass += result.pass;
      fail += result.fail;
    });
    core.setOutput('tap_count', count);
    core.setOutput('tap_pass', pass);
    core.setOutput('tap_fail', fail);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
