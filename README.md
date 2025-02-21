How to setup local dev

1. install Ubuntu 22
2. sudo apt update && sudo apt upgrade -y
3. curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
4. sudo apt-get install nodejs -y
5. /bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
6. clone repo
7. check repo if on ubuntu, then type "code shield" to open VS code (Make sure WSL extension is installed on VS code)
8. composer update (install PHP backend)
9. npm install (install JS frontend)
10. create two terminal and run php artisan serve (backend) and npm run dev (frontend)
