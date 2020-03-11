/**
 * Imports
 */
import * as rules from './rules'
import { Commit, Ruleset, Inputs, RuleError, RuleResult } from './interfaces'

/**
 * Gets the inputs set by the user and the messages of the event.
 */
export class Engine {
  // Commits and Rulesets loaded as inputs
  commits:  Commit[]
  rulesets: Ruleset[]

  // List of errors created while running rules
  errors:   RuleError[] = []

  // Map of available rules
  rules:    { [key: string]: any } = {
    matches: new rules.MatchesRule
  }

  constructor(inputs: Inputs) {
    this.commits    = inputs.commits
    this.rulesets   = inputs.rulesets
  }

  public run() {
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

    return 0
  }

  /**
   * Validates that all commits match the rule
   * @param rule 
   * @param commits 
   */
  private validateAll(ruleset: Ruleset) {
    const rule = this.rules[ruleset.rule]

    for (let commit of this.commits) {
      let result = rule.rule(ruleset.value, commit)

      if (result.status == 'fail' && result.error) {
        this.errors.push(result.error)
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
  }
}
