Google Analytics demo project
====

****This project is intended to run on heroku.****

http://intense-ridge-2363.herokuapp.com/#/

***Local Instalation***

In order to install locally please run the following commands, assuming you have node installed.
*** FRONTEND ***

    git clone https://github.com/joeandrews/demo

    cd frontend
    
    npm install
    
    gulp

This will compile and build all the frontend code, JS, angular templates and the css into the index.html file and will also copy these files to the assets directory ../backend/assets. Finally this creates a live reload server running at localhost:9000 to see the changes as you make them.

*** BACKEND***

    cd backend
    
    npm install
    
    node app.js
    
This will start the sails app which will serve the minified frontend at localhost:1337.




    


