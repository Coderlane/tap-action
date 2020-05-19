const core = require('@actions/core');

async function run() {
  try {
    const directory = core.getInput('tap_directory');
    const extension = core.getInput('tap_extension');
    core.debug(directory);
    core.debug(extension);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
