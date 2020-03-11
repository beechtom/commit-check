/**
 * Imports
 */
import fs from 'fs'
import * as yaml from 'js-yaml'
import * as core from '@actions/core'
import * as github from '@actions/github'
import { Inputs, Pull, Commit, Ruleset } from './interfaces'

/**
 * Gets the inputs set by the user and the messages of the event.
 */
export async function getInputs(): Promise<Inputs> {
  const inputs = ({} as unknown) as Inputs

  // Get rules
  inputs.rulesets = loadRules()

  // Get commit messages for the PR
  inputs.commits = await getCommits()

  return inputs
}

/**
 * Gets all commits for the PR
 */
async function getCommits(): Promise<Commit[]> {
  const pull: Pull    = getPull()
  const token: string = core.getInput('token', { required: true })
  const octokit       = new github.GitHub(token)

  const { data: commits } = await octokit.pulls.listCommits({
    owner:       pull.owner,
    repo:        pull.repo,
    pull_number: pull.number
  });

  return commits
}

/**
 * Gets the repository information
 */
function getPull(): Pull {
  const pull = ({} as unknown) as Pull

  // Get the repository information from the default environment variable
  const result = process.env.GITHUB_REPOSITORY?.split('/')

  if (process.env.GITHUB_REPOSITORY) {
    const owner_repo = process.env.GITHUB_REPOSITORY.split('/')
    pull.owner = owner_repo[0]
    pull.repo  = owner_repo[1]
  } else {
    throw new Error(`${result} is not a valid repository`)
  }

  if (github.context.payload.pull_request?.number) {
    pull.number = github.context.payload.pull_request.number
  } else {
    throw new Error(`Event is not a pull request`)
  }

  return pull
}

/**
 * Loads a rules file, returning an array of rules
 * Returns an empty array if the rules file does not exist
 */
function loadRules(): Ruleset[] {
  const rulesets: Ruleset[] = []
  const file:     string    = core.getInput('rules')

  try {
    let fileContents = fs.readFileSync(file, 'utf8');
    let data         = yaml.safeLoad(fileContents);

    if (data.rules) {
      for (let rule_data of data.rules) {
        let rule = ({} as unknown) as Ruleset

        rule.rule  = rule_data.rule
        rule.range = rule_data.range
        rule.value = rule_data.value

        rulesets.push(rule)
      }
    }
  } catch (e) {
      console.log(e);
  }

  return rulesets
}
