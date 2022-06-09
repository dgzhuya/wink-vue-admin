import shell from 'shelljs'

shell.cd('packages/web')
shell.exec('npm run format')
shell.cd('../api')
shell.exec('npm run format')
