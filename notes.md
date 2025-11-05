## create the app using npx

npx create-react-app <name-of-app>

## start the project

- login to the directory
- npm start

## convert jsx file into component

- first intall the vscode extension: ES7+ React/Redux/React-Native/JS snippets
- then run: rafc
- for example, this logic was used in LoginSignup.jsx file

## to start the database

- create the superuser with the command: python manage.py createsuperuser
- complete the forms

## implemente RBAC

### user roles:

- Doctor: Can view, create, edit, and delete all patients
- **Nurse**: Can view and create patients, limited edit access
- **Admin**: Full access to all patients and user management

### access rules:

- Admins: Full access to everything
- Doctors: Full access to all patient records
- Nurses: Can view all patients, create new ones
- Others: Only see their own created records

### testing Roles:

1. Create users with different roles during registration
2. Login with different roles to test access levels
3. Use Django admin to change user roles if needed

## react variables & states explained

[stateVariable, setStateFunction] = useState(initialValue)

## eventListeners

listens and handle user events and changes when interracting with the application such as click, typing hovering

## react props

props stand for properties in react. they are used to pass data from a parent component

## react hooks

basically a function that allows you to "hook into" react's current state and update them. examples of react hooks: useState, useEffect,
useContext. basic usage of react hooks
const [{name of state}, {name of function to change state}] = useState({initial value of state})

## states

they are variables that basically keep tracks of important pieces of information that needs to be passed between components.
