/** @type {import('pm2').StartOptions[]} */
module.exports = {
  apps: [
    {
      name: 'rui-web',
      cwd: __dirname,
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
        PORT: '3847',
      },
    },
  ],
}
