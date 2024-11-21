# keypa_outlet
codigo de la estructura del proyecto (en un archivo .bat):
mkdir db
mkdir src
cd src
mkdir controllers
mkdir views
mkdir public
mkdir routes

npm init --y

npm install express mysql express-myconnection morgan ejs

npm install nodemon

añadir al package:
"scripts": {
    "dev": "nodemon src/index.js"
  },