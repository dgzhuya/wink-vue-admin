import shell from 'shelljs'

shell.cd('./packages/api')
shell.exec('npm run build')
shell.cd('../web')
shell.exec('npm run build:prod')
shell.exec('pm2 restart wink-api')
