import { Commit, RuleResult, RuleError } from "./interfaces"

export class Rule {
  name: string = 'default'
  type: string = 'undefined'

  rule(value: string, commit: Commit): RuleResult {
    if (this.matches(value)) {
      return this.run(value, commit)
    }
    else {
      return this.fail(
        'value/type-error',
        `Expected value for rule ${this.name} to be ${this.type}, received ${typeof value}`
      )
    }
  }

  protected matches(value: string): boolean {
    return typeof value == this.type
  }

  protected run(value: string, commit: Commit): RuleResult {
    return this.fail(
      'rule/unknown-rule',
      `Unknown rule ${this.name}`
    )
  }

  protected pass(): RuleResult {
    return {
      status: 'success'
    } as RuleResult
  }

  protected fail(type: string, message: string): RuleResult {
    return {
      status: 'fail',
      error: { 
        rule:    this.name,
        type:    type,
        message: message
       } as RuleError
    } as RuleResult
  }
}