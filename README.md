# tap-action
![CI](https://github.com/Coderlane/tap-action/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/Coderlane/tap-action/branch/master/graph/badge.svg?token=79MvETiYmF)](https://codecov.io/gh/Coderlane/tap-action)

A GitHub Action for parsing [TAP](https://testanything.org/) files and reporting on their output.

## Inputs

```
  tap_directory:
    description: Directory where TAP files are, relative to workspace
    required: false
    default: ./
  tap_extension:
    description: File extension of TAP files
    required: false
    default: .tap
```

## Outputs

```
  tap_count:
    description: The total number of TAP tests
  tap_pass:
    description: The total number of passing TAP tests
  tap_fail:
    description: The total number of failing TAP tests
```

## Examples

### Testing

This action is intended to be chained with other actions. For example, [a test for this project](https://github.com/Coderlane/tap-action/blob/master/.github/workflows/ci.yml) simply checks to see that the ouput count matches the count in the test data files.

```
    - name: Verify
      env:
        TAP_COUNT: ${{ steps.test.outputs.tap_count }}
      run: |
        if [ $TAP_COUNT -eq 2 ]
        then
          exit 0
        else
          echo "tap_count: $TAP_COUNT does not equal 2"
          exit 1
        fi
```

### CI

Similarly, you can create a comment on a pull request by [chaining the parser](https://github.com/Coderlane/c-tap-test/blob/master/.github/workflows/ci.yml) with `actions/github-script`.
```
    - uses: actions/github-script@v1
      if: always() && github.event_name == 'pull_request'
      with:
        github-token: ${{secrets.GITHUB_TOKEN}}
        script: |
          github.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: 'Total Tests: ${{ steps.parse.outputs.tap_count }} '
          })
```

This action adds a little context to [a pull request](https://github.com/Coderlane/c-tap-test/pull/2).

[![example](https://i.imgur.com/ANka0uk.png)](https://github.com/Coderlane/c-tap-test/pull/2)
