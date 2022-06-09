import shell from 'shelljs'

shell.cd('packages/web/')
shell.exec('pnpm build')
