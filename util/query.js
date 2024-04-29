import pool from "./databaseConfig.js";
import inquirer from "inquirer";
import { init } from "./menu.js";
import chalk from "chalk";

// a query to display a table of all employees
function viewEmp(){
    pool.query(`SELECT
employees.id, employees.first_name, 
employees.last_name,  
role.title, 
department.name AS department,
role.salary,
CONCAT (employees.first_name,' ',employees.last_name) 
AS employee_name, 
CONCAT(manager.first_name,' ',manager.last_name)AS manager_name
FROM department
JOIN role
ON department.id=role.department_id
JOIN employees
ON role.id=employees.role_id
LEFT JOIN employees manager 
ON employees.manager_id=manager.id;
`, (err, result) => {
    if (err){
        console.error(err);
    } else{
        console.log('\n');
        console.log(chalk.white.bgRed.bold('Viewing Corp Data ......'));
        console.table(result.rows);
        init();
    }
})
};

// a query to display employees by department 
function viewEmpDep(){
    pool.query(`SELECT id, name FROM department`,(err, res) => {
        if(err){
            console.error(err)
        }
        let department = res.rows.map(dep => ({
            name: dep.name,
            value: dep.id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name:'depName',
                message:'CHOOSE DEPARTMENT',
                choices: department
            }
        ]).then((answers) =>{
            pool.query (`SELECT
            employees.id, employees.last_name, 
            employees.first_name,  
            role.title, 
            department.name AS department,
            role.salary,
            CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
            FROM department
            JOIN role ON department.id = role.department_id
            JOIN employees ON role.id = employees.role_id
            LEFT JOIN employees manager ON employees.manager_id = manager.id
            WHERE department.id = $1;`, [answers.depName], (err, res) =>{
                if(err){
                    console.error(err)
                }
                console.log(chalk.white.bgRed.bold(`\nVIEWING EMPLOYEE DATA FOR DEPARTMENT: ${answers.depName}`));
                console.table(res.rows);
                init();
            })
        })
    })
}

// a query to display employees by manager
function viewByManage(){
    pool.query(`SELECT id, first_name, last_name FROM employees WHERE manager_id IS NULL`,(err, res) => {
        if(err){
            console.error(err)
        }
        let managers = res.rows.map(manager => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        }));

        const questions = [
            {
                type: 'list',
                name:'mgrName',
                message:'CHOOSE MANAGER',
                choices: managers
            }
        ]
    inquirer.prompt(questions).then((answers) =>{
        pool.query(`SELECT
        employees.id, employees.last_name, 
        employees.first_name,  
        role.title, 
        department.name AS department,
        role.salary,
        CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employees
        JOIN role ON employees.role_id = role.id
        JOIN department ON role.department_id = department.id
        JOIN employees manager ON employees.manager_id = manager.id
        WHERE employees.manager_id = $1;`, [answers.mgrName], (err, res) =>{
            if(err){
                console.error(err)
            }
            console.log(chalk.white.bgRed.bold(`\n VIEWING EMPLOYEES MANAGED BY: ${answers.mgrName} `))
            console.table(res.rows)
            init();
        });
    });
});
};

// a query to add a new employee
function addEmp(){
    pool.query(`SELECT id,
    CONCAT ( employees.first_name,' ',employees.last_name) 
    AS manager_name FROM employees `,(err, res) => {
        if (err){
            console.error(err)
        }
        let manager = res.rows.map((row) => ({
            name: row.manager_name,
            value: row.id
        }));
        pool.query(`SELECT id, title FROM role`, (err, res) => {
            if (err){
                console.error(err)
            }
            let role = res.rows.map((row) =>({
                name: row.title,
                value: row.id
            }));

            manager.push({name: 'NONE',value:null})
            
            const questions = [

                {
                    type: 'input',
                    name: 'firstName',
                    message:'WHAT IS THE FIRST NAME?'
                    
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message:'WHAT IS THE LAST NAME?'
                },
                {
                    type: 'list',
                    name: 'role',
                    message:'WHAT IS THE COMPANY SECTOR?',
                    choices:role,
                    
                },
                {
                    type: 'list',
                    name: 'manager',
                    message:`WHO IS THEIR CONTROLLER?`,
                    choices: manager
                },
            ];
            inquirer.prompt(questions).then((answers) =>{ 
                pool.query
                (`INSERT INTO employees
                (first_name, last_name, role_id, manager_id) 
                VALUES ($1, $2, $3, $4)`, 
                [answers.firstName, answers.lastName, answers.role, answers.manager])
                .then((res) => {
                    console.log(chalk.white.bgRed.bold('EMPLOYEE ADDED SUCCESSFULLY:'), res.rows[0])
                    init();
                })
                .catch((err) => {
                    console.error('Error adding employee:', err)
                });  
            });
        });
    });
};

// a query to view all current roles
function viewRole(){
    pool.query
    (`SELECT role.id, 
    role.title, 
    department.name, 
    role.salary 
    FROM department LEFT 
    JOIN role ON department.id=department_id`, (err, result) =>{
        if(err){
            console.error(err);
        } else{
            console.log(chalk.white.bgRed.bold('VIEWING ROLES......'))
            console.table(result.rows);
            init();
        };
    });

};
// a query to change an employees role
function updateRole(){
    pool.query(`SELECT id,
    CONCAT (employees.last_name,' ',employees.first_name) 
    AS employee_name FROM employees `,(err, res) => {
        if (err){
            console.error(err)
        }
        let employee = res.rows.map((row) => ({
            name: row.employee_name,
            value: row.id
        }));

        pool.query(`SELECT id, title FROM role`, (err, res) => {
            if (err){
                console.error(err)
            }
            let role = res.rows.map((row) =>({
                name: row.title,
                value: row.id
            }));

            const questions = [
                {
                    type:'list',
                    name: 'employee',
                    message:'SELECT EMPLOYEE',
                    choices: employee
                },
                {
                    type:'list',
                    name: 'newRole',
                    message:'SELECT THEIR NEW ROLE',
                    choices: role
                }
            ]
            inquirer.prompt(questions).then(answers => {
                pool.query(`UPDATE employees SET role_id = $1 WHERE id = $2`,
            [answers.newRole, answers.employee])
            .then((res) => {
                console.log(chalk.white.bgRed.bold('ROLES UPDATED'))
                init();
            });
            });
        })
    });
};


// a query to add a new role
function addRole(){
pool.query(`SELECT id, name FROM department`, 
(err, res) => {
    if (err){
        console.error(err)
    }
    let dep = res.rows.map((row) => ({
        name: row.name,
        value: row.id
    })

)
    
    const questions =[
        {
            type: 'input',
            name: 'role',
            message: 'Enter new role title.'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter wage cap.'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What company sector does this belong to?',
            choices:dep
        }
    ]
    inquirer.prompt(questions).then((answers) =>{
        pool.query(`INSERT INTO role (title, salary, department_id) 
        VALUES ($1, $2, $3)`,
        [answers.role, answers.salary, answers.department]).then(
            console.log(chalk.white.bgRed.bold('UPDATING')),
            init()
        );
    })
})
};

// a query to display all departments
function viewDep(){
    pool.query(`SELECT * FROM department`, (err, result) =>{
        if(err){
            console.error(err);
        } else{
            console.log(chalk.white.bgRed.bold('DEPARTMENT LIST.....'))
            console.table(result.rows);
            init();
        }
    });
};

// a query to add a new department.
function addDep(){
const question = [
    {
        type:'input',
        name:'newDep',
        message:'WHATS THE NEW CORPORATE DEPARTMENT'
    }
]
inquirer.prompt(question).then((answers) => {
    pool.query(`INSERT INTO department(name)
        VALUES($1)`, [answers.newDep])
        console.log(chalk.yellow.bgRed(`DEPARTMENT ADDED`))
        init();
})
};


function quit(){
    console.log(chalk.green('EXITING.......'))
}



export {
    viewEmp,
    viewEmpDep,
    viewByManage,
    addEmp,
    updateRole,
    viewRole,
    addRole,
    viewDep,
    addDep, 
    quit
};

















