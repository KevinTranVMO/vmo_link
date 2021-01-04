module.exports = {
  apps : [{
    name: 'ShortentLink', // application name
    script: 'index.js',
    args: 'one two', // string containing all arguments passed via CLI to script
    instances: 1, // number process of application
    autorestart: true, //auto restart if app crashes
    watch: false,
    max_memory_restart: '2G', // restart if it exceeds the amount of memory specified
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production: {
      host: '18.191.59.191',
      user: 'deploy',
      ssh_options: [
        'ForwardAgent=yes',
      ],
      ref: 'origin/develop',
      repo: 'git@github.com:tranvanmy/vmo-shortenlink.git',
      path: '/home/deploy/web-app',
        "post-setup": "cd /home/deploy/web-app/current && npm install; pm2 start ecosystem.config.js --env production",
        "post-deploy": "cd /home/deploy/web-app/current && npm install; pm2 restart ecosystem.config.js --env production",
      env: {
          NODE_ENV: 'production',
      },
  },
  }
};
