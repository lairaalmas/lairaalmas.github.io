# iFractions

## About

**iFractions** is an online collection of games for teaching fractions currently being developed by LInE (Laboratório de Informática na Educação).

It can be used both on a server or as an activity inside Moodle.

Play iFractions online: http://www.usp.br/line/ifractions/

## How to use this code

Follow the description below based on in which platform you want to run iFractions:

#### 1) on a server

* Extract the content of **Ifraction-web.zip** inside the server directory

* Check that the variable **moodle** is set to **false** inside **/js/globals.js**

* It can now be accessed through the **browser** (e.g http://localhost/Ifractions-web)

* If you want to save the players information on your database:

  * you'll need to have **PHP** and **MySQL** installed on the machine

  * follow the steps on **/php/README.md** to setup the database and variables

* Otherwise you're good to go.

#### 2) on Moodle

iFractions is one of the iLM (Interactive Learning Modules) provided by the iAssign package for Moodle. 

* To download and setup iAssign access: http://200.144.254.107/git/LInE/iassign

* Be sure to check that the variable **moodle** is set to **true** inside **/js/globals.js**

* With iAssign installed, as a Moodle professor on you'll be able to:
  
  * create activities for your course that are customizable iFractions games
  
  * analyze the student's progress on the activities

  * get the automatic evaluation for the activities

