# Raspberry Pi 2 / Pi 3

Update the Pi and install Node.js (LTS) from the NodeSource APT repository.

```
apt-get update
apt-get upgrade
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install nodejs
```

Check NodeJs version

```
node -v
```

Install NEEO SDK

```
npm install git+https://github.com/NEEOInc/neeo-sdk.git
```

Install the latest PM2 stable version via NPM

```
npm install pm2@latest -g
```

Generate an active startup script (restarting process manager on server boot/reboot)

```
pm2 startup
```

Install the driver (logged as root)

```
cd /home
mkdir neeo-drivers
cd neeo-drivers
npm install neeo-fibaro-scenes-adapter
```

Edit and update settings file (create if not exists)

```
cd /home/neeo-drivers/node_modules/neeo-fibaro-scenes-adapter
nano settings.json
```

Start the driver with npm or with PM2 according your needs

NPM
```
npm server:fibaro-scenes
```

or

NPM
```
pm2 start lib/main.js
```