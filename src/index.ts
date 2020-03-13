/**
 * Imports
 */
import * as core from '@actions/core'
import * as helpers from './helpers'
import { Engine } from './engine'

/**
 * Main function
 */
async function run(): Promise<void> {
  try {
    const inputs = await helpers.getInputs()
    await new Engine(inputs).run()
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

/**
 * Main entry point
 */
run()