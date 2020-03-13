/**
 * Imports
 */
import * as rules from './rules'
import { Result } from './results'
import { Commit, Ruleset, Inputs, RuleError, RuleResult } from './interfaces'
import { CORE_SCHEMA } from 'js-yaml'

/**
 * Gets the inputs set by the user and the messages of the event.
 */
export class Engine {
  // Commits and Rulesets loaded as inputs
  commits:  Commit[]
  rulesets: Ruleset[]

  // List of errors created while running rules
  errors:   Result[] = []

  // Map of available rules
  rules:    { [key: string]: rules.Rule } = {
    'commit-message-matches':     new rules.CommitMessageMatches,
    'commit-message-length':      new rules.CommitMessageLength,
    'commit-message-line-length': new rules.CommitMessageLineLength
  }

  constructor(inputs: Inputs) {
    this.commits    = inputs.commits
    this.rulesets   = inputs.rulesets
  }

  public async run(): Promise<void> {
    for (let ruleset of this.rulesets) {
      switch (ruleset.range) {
        case 'all':
          this.validateAll(ruleset)
          break
        case 'any':
          this.validateAny(ruleset)
          break
        case 'none':
          this.validateNone(ruleset)
          break
        default:
          throw new Error(`Unknown range ${ruleset.range} in ruleset ${ruleset.rule}`)
      }
    }

    console.log(this.errors)

    if (this.errors.length > 0) {
      console.log('THIS FAILED')
    }
  }

  /**
   * Validates that all commits match the rule
   * @param rule 
   * @param commits 
   */
  private validateAll(ruleset: Ruleset) {
    const results = this.executeRuleOnCommits(ruleset)

    for (let result of results) {
      if (result.fail()) {
        this.errors.push(result)
      }
    }
  }

  /**
   * Validates that at least one commit matches the rule
   */
  private validateAny(ruleset: Ruleset) {
  }

  /**
   * Validates that none of the commits match the rule
   */
  private validateNone(ruleset: Ruleset) {
    const results = this.executeRuleOnCommits(ruleset)

    for (let result of results) {
      if (result.pass()) {
        this.errors.push(result)
      }
    }
  }

  private executeRuleOnCommits(ruleset: Ruleset): Result[] {
    const rule              = this.rules[ruleset.rule]
    const results: Result[] = []

    for (let commit of this.commits) {
      results.push(rule.rule(ruleset, commit))
    }

    return results
  }
}
