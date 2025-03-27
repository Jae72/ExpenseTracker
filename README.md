# ExpenseTracker
WSU CSC4996 Capstone Project

# Table of Contents
- [Description of app](#description)
- [Environment & Configuration](#environment)
- [Packages](#packages)
- [Installs](#installs)
- [Running the app](#run)
  
## Description 
ExpenseTracker is a fully functional web application that has the ability to scan and store receipts from any store, scrape the data, and put that data into a polynomial regression model that will predict your expenses for the next month!

## Environment
ExpenseTracker was created using ReactJS along with Vite and Nodejs for the front-end. Our back-end was created using Flask with Python and Firebase for our database. This IDE used for this project was Visual Studio Code which will be required for running the application.

- Versions:
•	React v18.3.1
•	Html 5
•	JavaScript vES6
•	CSS3
•	Vite v6.0.2
•	Node.js v20.17.0
•	Express.js v4.19.2
•	Mindee Expense Receipt API v5
•	Flask v3.1.0
•	Python v3.13.0

<a href="https://vite.dev/guide/"><img src="https://vetores.org/wp-content/uploads/vite-js-logo.png" /><a/>
<a href="https://react.dev/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1MndL-Xp1JcnqaB0YOqTp6zDjrwYyGKsPA&s" /><a/>
<a href="https://nodejs.org/en"><img src="https://spng.pngfind.com/pngs/s/168-1683198_node-js-logo-png-transparent-png.png" /><a/>
<a href="https://code.visualstudio.com/"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiJNnjZv36ijogi3aM_xcSMy26_QeOWrVmJQ&s" /><a/>
<a href="https://flask.palletsprojects.com/en/stable/"><img src="https://icon2.cleanpng.com/20180505/bcq/kisspng-python-programming-language-computer-programming-o-5aedbbe8d160f1.1997845115255295768576.jpg" /><a/>

## Packages 
Packages used in the ExpenseTracker application include:
- React-webcam
- Mindee API
- Ml-regression-polynomial
- React-dom
- Axios
- Recharts
- Regression
- CORS
- Firebase

## Installs
To install ExpenseTracker follow these steps.

1. Navigate to our main GitHub page
2. Click on the green 'Code' icon
3. Copy the url
4. Install git from the following link: <a href="https://git-scm.com/downloads">Git Installer<a/>
5. Install npm from the following link: <a href="https://nodejs.org/en/download/package-manager">Node.js Installer<a/>
6. Open any terminal on your device, change directory to desktop, and type:
   - cd Desktop
   - git clone <https://github.com/Jae72/ExpenseTracker.git>
7. After cloning the repository, open up VSCode and open the ExpenseTracker folder
8. Finally, to install all the dependencies and packages, run:
    - npm install
9. The newest version of Python is required to be installed on your device, this can be done by visiting the official <a href="https://www.python.org/downloads/"> Python <a/> site and installing it from there.
10. You will also need to install Python withing VSCode by going to 'Extentions' and looking up Python.

## Run
1. Open up a command line in VSCode and change directory to 'server' using this line:
    - cd server
2. You will also need to install Flask with this command in the main.py file:
    - pip install Flask
3. To run the backend, switch to a command line in VSCode and type:
    - .\venv\Scripts\activate.bat
    - python main.py
4. Open up a powershell line in VSCode and change directory to 'expensetracker' using this line:
    - cd expensetracker
5. To run the web application, in your powershell type:
    - npm run dev
6. You will see this link (http://localhost:5173/). Click on it to navigate to ExpenseTracker.
