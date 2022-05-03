# employeeHRDatabase

## Description

The employeeHRDatabase is meant to make your life as an HR professional much easier. View your departments, roles, and a list of all your employees. Update
your databases, with ease, and ensure that your company is running smoothly. This command line application has many tools for you to employ.

## Table of contents

- [Key Functions](#key-functions)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact/Questions](#questions)
- [Summary](#summary-and-learning-points)

## Video Preview of Application

This application is not deployed, please click the link below to view a video of the application functioning.

Alternatively, you can [install](#installation) this application on your own machine and try it yourself.

[Click to view the application video demo](https://drive.google.com/file/d/1GLroCZDuAj0cBaTNaoEnTCi9L4TkM_JA/view)

## Technologies Employed

| Techlogy      | Implementation/Use    |
| ------------- | --------------------- |
| Node.js       | JavaScript runtime    |
| NPM           | Manage node packages  |
| inquirer      | Prompt the user in CL |
| mySQL2        | mySQL Node Client     |
| mySQL         | storage of data       |
| console.table | formatting data in CL |

## Key Functions

### viewEmployees

This was the function that was the most difficult to form the query for. I had to join a table to itself
by creating a subtable, and then joining them together. This made it possible to reference a Manager, who is
also an employee within an Employee row

```javascript
function viewEmployees() {
  db.query( `
    SELECT CONCAT(e.first_name, ' ', e.last_name) AS Name,
      e.id AS ID,
      roles.title AS Title,
      roles.salary AS Salary,
      departments.dept_name AS Department,
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employees e
      LEFT JOIN employees m ON m.id = e.manager_id
      JOIN roles ON e.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id `,
```

### getRoleList

This was the function that allowed me to create an array of all of the roles. I also had clone functions for Employees, Managers, and Departments
that I used throughout the program. This allowed me to prompt the user with an updated list of any column from any table within the database. It was also
an opportunity for me to practice using async await, because in order to populate my arrays, i had to promisify the database query, and populate the array upon
return.

```javascript
async function getRoleList() {
  let list = [];
  const results = await db
    .promise()
    .execute("SELECT title FROM roles WHERE salary<1000");
  if (!results) {
    console.error("There was an error!");
  } else {
    results[0].forEach((elem) => {
      list.push(elem.title);
    });
  }
  return list;
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

This application was my first attempt at using mySQL, and the mySQL2 Node package. A tedious and meticulous attention to detail was
required for this one, and I found myself being quite frustrated at times, especially having to implement asynchonous code blocks in order
for the application to fully function. I would like to add more features in the future, and definitely would like to refactor the whole thing
to include classes.
