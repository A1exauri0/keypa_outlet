# keypa_outlet
npm run dev

codigo de la estructura del proyecto (en un archivo .bat):
mkdir db
mkdir src
cd src
mkdir controllers
mkdir views
mkdir public
mkdir routes

npm init --y

npm install express mysql express-myconnection morgan ejs nodemon
npm install  body-parser bcryptjs jsonwebtoken express-session multer

añadir al package:
"scripts": {
    "dev": "nodemon src/index.js"
  },