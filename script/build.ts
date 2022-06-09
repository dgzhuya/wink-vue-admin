import shell from 'shelljs'

shell.cd('packages/web/')
shell.exec('pnpm format')
// shell.cd('../../packages/api')
// shell.exec('pnpm build')
