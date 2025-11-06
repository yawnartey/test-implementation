## install pipenv to create virtual environment to install all the required packages

pip install pipenv

## install django in virtual environment using pipenv

pipenv install django

## activate pipenv virtual environment

pipenv shell

## selecting and setting the right interpreter

pipenv --venv => returns the path
add: \Scripts\python.exe to the end of path and set that as the intepretor

## to start a django project

django-admin startproject <name-of-project>

## function of manage.py

django admin and manage.py can be used interchangeablly. to use manage.py, run the command below
python manage.py runserver

## creating an app

- in django, you can have multiple apps within a project
- to create an app within a project, navigate to the project directory and run the command below
- python manage.py startapp <name-of-app>

## MVT

- concept that explains how web applications work and interract with clients
- MVT => stands for: Model View Template
  - model => responsible for processing data
  - view => responsible for handling the user interraction with our application. where user response is taken, processed and response sent back. basically deals with the logic part of the application
  - template => deals with the user interface and what the user actually sees

## views

there are 2 ways to create a view in django

- function based view
- class based view

## next step after creating a view

- after creating a view, the next step will b, e to link the view functions and classes to addresses
- this is also referred to as url mappings
- the urls have to be mapped at the app level and they also has to be mapped at the project level
- app has to be added to the settings.py file. open the settings app and add the name of the app in it

## to accesss the view

http://<localhost>/app/<path_to_view_defined_in_url.view_file>

## to run the application

python manage.py runserver

## models

- responsible for processing data
- classes are mostly used in creating models\*\*
- models will create a database tables with their respective colomns and rows
- to create those table, you need to make what is called migrations
- migrations is a process that converts whatever changes is made in the model.py file into the database
- to make migrations, run the following commands
  - python manage.py makemigrations
  - python manage.py migrate

## forms

- forms are used to take input from user. which are then stored in the database
- these forms are created in the models (model.py)
- after the forms are created in the model, you have to create a forms file and call the model from that file

## django admin panel

- helps manage data and django projects easily
- for instance, the forms created up there can be used in the admin panel and can be used to populate the model
- to use the admin panel, you need to first create a superuser. to do that, run the command below in the project's root dir
  - python manage.py createsuperuser
  - creds created: (uaccount:yaw, email:yaw@yaw.com, pw:yaw@123)
- to access the admin panel
  - http://127.0.0.1:8000/admin/
- any changes like updating user creds in the admin panel can be made in the admin.py file
- after the changes in the admin file, you need to run the migrate command to register the changes
  - python manage.py makemigrations
  - python manage.py migrate

## MySQL

- django by default uses sqlite as its default database. this can be changed to use any database for instance mysql
- to use mysql:
  - first download mysql on your local system and complete the installation
  - verify you can be able to access the database
- to let your django app use your local mysql installation
  - you need to install a driver to use mysql. the driver's name is called mysql client
  - to install the driver, run the command below
    - pipenv install mysqlclient
  - in settings.py file, adjust the database list for mysql
- after the list is adjusted in the settings, run the command below to apply the changes
  - python manage.py makemigrations
  - python manage.py migrate

## templates

- from before we know templates deal with user interfaces and what the user sees
- basically used to design the user interface
- in the templates file, we can have the html file which will contains a form that when a user fills the forms, that forms will be sent to the database

## flow

create django project -> create djanog app -> create view within the app -> create models within the app ->
