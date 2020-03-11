import { Rule } from '../rule'
import { RuleResult, Commit } from '../interfaces'

export class MatchesRule extends Rule {
  name: string =  'matches'
  type: string = 'string'

  protected run(value: string, commit: Commit): RuleResult {
    const regex = new RegExp(value)
    const pass  = regex.test(commit.commit.message)

    if (pass) {
      return this.pass()
    }
    else {
      return this.fail(
        'rule/matches-fail',
        `Commit ${commit.sha} did not match regular expression ${regex}`
      )
    }
  }
}