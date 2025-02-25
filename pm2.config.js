// this means if app restart {MAX_RESTART} times in 1 min then it stops
const NODE_ENV = process.env.NODE_ENV || 'development';
const CRON_RESTART = process.env.CRON_RESTART || 'false';
const MAX_RESTART = 3;
const MIN_UPTIME = 60000;


module.exports = {
  apps : [
    {
      name   : "core-api",
      script : `poetry run python -m snapshotter.gunicorn_core_launcher`,
      max_restarts: 1,
      min_uptime: MIN_UPTIME,
      error_file: "/dev/null",
      out_file: "/dev/null",
      env: {
        NODE_ENV: NODE_ENV,
        GUNICORN_WORKERS: 1,
      }
    },
    {
      name   : "snapshotter-lite",
      script : `poetry run python -m snapshotter.system_event_detector`,
      max_restarts: MAX_RESTART,
      min_uptime: MIN_UPTIME,
      error_file: "/dev/null",
      out_file: "/dev/null",
      env: {
        NODE_ENV: NODE_ENV,
      },
      ...(CRON_RESTART === 'true' ? { cron_restart: "0 * * * *" } : {}),
      autorestart: true,
      kill_timeout: 5000,
      stop_exit_codes: [0, 143],
      treekill: true,
      listen_timeout: 10000,
    },
  ]
}

