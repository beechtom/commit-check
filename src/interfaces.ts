/**
 * Interfaces
 */
interface Inputs {
  rulesets: Ruleset[],
  commits:  Commit[]
}

interface Pull {
  owner:  string,
  repo:   string,
  number: number
}

interface Commit {
  [key: string]: any,
  commit: {[key: string]: any}
}

interface Ruleset {
  rule:   string,
  range:  string,
  value:  any,
  error?: string
}

interface RuleError {
  rule:    string,
  type:    string,
  message: string
}

interface RuleResult {
  status: string,
  error?: RuleError
}

interface Validator {
  type:     string,
  validate: Function
}

export {
  Inputs,
  Pull,
  Commit,
  Ruleset,
  RuleError,
  RuleResult
}
