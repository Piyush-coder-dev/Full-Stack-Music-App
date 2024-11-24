# Full-Stack-Music-App
Music website using ReactJs and ExpressJs
# Open spotify folder in Vs Code
## 1. Please run these command lines in cmd before starting servers:
## 2. command lines for root (spotify) folder:
```cmd
spotify> npm i
```
* It will download all the necessary modules;

## 3. command lines for Backend folder which is inside root (spotify) folder:
```cmd
spotify> cd Backend
spotify/Backend> npm init -y
spotify/Backend> npm i express@latest
spotify/Backend> npm i --global nodemon
spotify/Backend> nodemon ./server.js
```

## 4. starting servers:
- for Root folder
```cmd
spotify> npm run dev
```
- for Backend folder
```cmd
spotify> cd Backend
spotify/Backend> nodemon ./server.js
```
