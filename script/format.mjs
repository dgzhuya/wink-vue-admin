import shell from 'shelljs'

shell.cd('../packages/api')
shell.exec('npm run format')
shell.cd('../web')
shell.exec('npm run format')
