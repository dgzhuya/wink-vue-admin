import shell from 'shelljs'

shell.cd('./packages/api')
shell.exec('npm run build')
shell.exec('pm2 restart wink-api')
shell.cd('../web')
shell.exec('npm run build:prod')
