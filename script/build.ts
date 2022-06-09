import shell from 'shelljs'

shell.cd('packages/web')
shell.exec('npm run format')
shell.exec('npm run build')
shell.cd('../api')
shell.exec('npm run format')
shell.exec('npm run build')
shell.exec('pm2 restart wink-api')
