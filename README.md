# employeeHRDatabase

## Description 
This is a command line application that creates an html file for the user, based on information they provide.  
When the application is run, the user is asked a series of questions about their team. Once they have finished 
answering the questions in the prompt, the user can navigate to the dist folder to find a GENERATED.html. Once opened
in browser, the user is shown a neat webpage populated with cards for all of the employees on the team.

## Table of contents
   * [Key Functions](#key-functions)
   * [Installation](#installation)
   * [Usage](#usage)
   * [License](#license)
   * [Contact/Questions](#questions)
   * [Summary](#summary-and-learning-points)
 
## Video Preview of Application 
This application is not deployed, please click the link below to view a video of the application functioning. 

Alternatively, you can [install](#installation) this application on your own machine and try it yourself.  

[Click to view the application video demo](https://drive.google.com/file/d/1CoI5aIWeRFVUyd7YhgFCUymYfin67l5H/view)

## Technologies Employed

| Techlogy                    | Implementation/Use       |
|-----------------------------|--------------------------|
|Node.js                      | JavaScript runtime       |
|NPM                          | Manage node packages     |
|inquirer                     | Prompt the user in CL    |
|mySQL2                       | mySQL Node Client        |
|mySQL                        | storage of data          |
|console.table                | formatting data in CL    |

## Key Functions
### engineerMenu
This was one of the promp menus that the user goes through while running the app. 
Once the user has answered all of the prompts, a new instance of the type they selected is created and then
pushed to the empArray. Once the user is finished adding employees, the empArray is passed to the generateCards function, explained below:

```javascript
function engineerMenu() {
    inquirer.prompt([
        {
            message: 'Please Enter Engineer Name:',
            name: 'name'
        },
        {
            message: 'Please Enter Engineer email:',
            name: 'email'
        },
        {
            message: 'Please Enter Engineer gitHub username:',
            name: 'github'
        }
    ]).then((answers)=> {
        let newEng = new Engineer(answers.name, answers.email, answers.github)
        empArray.push(newEng)
        console.log(`\nEngineer Successfully Added!\nEmployeeID : ${newEng.getID()}\n`)
        addEmpMenu()
    })
}
```

### generateCards

This was the function that generated cards, based on all of the employees added by the user through the prompt. 
It gets called from the index.js, and is passed an array of Employee Objects. It runs the getRole method
on each object, and based on the result, it adds to a template literal that will later be written to our 
GENERATED.html file.

```javascript
function generateCards(arr){
  arr.forEach(obj => {
    let role = obj.getRole()
    switch(role){
      case 'Manager':
        cardSectionLit += manCard.makeCard(obj)
        break;
      case 'Engineer':
        cardSectionLit += engCard.makeCard(obj) 
        break;
      case 'Intern':
        cardSectionLit += intCard.makeCard(obj)
        break;
    }
  })
}
```

## Installation
To install this application, clone the repository 
```
git@github.com:sharkby7e/employeeHRDatabase.git
```
navigate into the directory, and then run the following command 
```
npm install
```

## Usage
To use the program, first we need to create and seed our database. In mySQL shell, run 
```shell
source db/schema.sql 
source db/seeds.sql
```
Once we have done that, you need to edit the server.js file line 25 with your personal password

Then to start the application, run:
```
npm start
```
Follow the onscreen prompts and enjoy the extra time off you gained from all the time you saved using this program, 
instead of your old boring HRDatabase

## License
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Questions?
Please contact me at:

sgquin@gmail.com

Alternatively, visit my github: 

https://www.github.com/sharkby7e

## Summary and Learning Points
This application was my first attempt at using Test Driven Development(TDD). I really tried to stick to the spirit of TDD, and wrote all of my tests
first. I liken it to 'backwards design' method of lesson planning, which I used when I was a teacher. Basically, you start by figuring out
the features you actually want the application to have, and write tests to see if your code can do it. Once you have written the test, it should 
fail because you haven't written anything yet, but at that point, you are already familiar with the goal you are trying to achieve. This makes
the development run more smoothly, which I definitely experienced
