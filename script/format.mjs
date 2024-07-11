import shell from 'shelljs'

shell.cd('./server')
shell.exec('npm run format')
shell.cd('../web')
shell.exec('npm run format')
