#!/usr/bin/env node

import path from 'path'
import { existsSync, readdirSync, rmSync } from 'fs'
import prompts from 'prompts'
import degit from 'degit'

const showName = () => {
  console.log('\n ––––––––––––––––––––––––––––––––––––––––––––\n')
  console.log('\n| MPA Starter Template | made by timakaroche |\n')
  console.log('\n ––––––––––––––––––––––––––––––––––––––––––––\n')
}

const run = async () => {
  console.log(`Name your project or "." to use current directory:`)
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: '',
    initial: 'my-mpa',
    validate: name =>
      name.trim().length ? true : 'Please enter a valid project name.',
  })

  const targetDir = name.trim() === '.' ? process.cwd() : path.resolve(process.cwd(), name)

  console.log(`Project will be created in: ${targetDir}`)

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    const { action } = await prompts({
      type: 'select',
      name: 'action',
      message: `Directory "${name}" is not empty. How would you like to proceed?`,
      choices: [
        { title: 'Cancel installation', value: 'cancel' },
        { title: 'Remove all files and continue', value: 'clear' },
        { title: 'Keep files and continue', value: 'keep' },
      ],
    })

    switch (action) {
      case 'cancel': {
        console.log('Installation was cancelled.')
        process.exit(0)
      }

      case 'clear': {
        const filesInTargetDir = readdirSync(targetDir)
        for (const file of filesInTargetDir) {
          if (file === '.git') {
            continue
          }

          rmSync(path.join(targetDir, file), { recursive: true, force: true })
        }
        console.log('Target directory was cleared. Proceeding...\n')

        break
      }

      case 'keep': {
        console.log(`Keeping existing files. Proceeding...\n`)
        break
      }
      
      default: {
        console.log(`Proceeding...\n`)
      }
    }
  }

  console.log(`Downloading MPA Starter Template files into "${targetDir}"...`)
  const emitter = degit('timur-iliyev/mpa-starter-template', {
    cache: false,
    force: true,
    verbose: false,
  })

  try {
    await emitter.clone(targetDir)
    console.log(`MPA Starter Template was successfully applied to: ${targetDir}`)
  } catch (err) {
    console.error(`Something went wrong while applying MPA Starter Template: ${err.message}`)
    console.error(`Error: ${err.message}`)
    process.exitCode = 1
    return
  }

  console.log(`Now run the following commands:`)

  if (name.trim() !== '.') {
    console.log(`cd ${name}`)
  }
  console.log('npm i')
  console.log('npm start')
}

showName()
run()
