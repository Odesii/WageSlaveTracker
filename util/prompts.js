import inquirer from 'inquirer'
import dotenv from 'dotenv';
import pg from 'pg';
import chalk from 'chalk';
const { Pool } = pg;
dotenv.config();
const pool = new Pool({
    user: 'postgres',
    password:'123',
    host: 'localhost',
    port:'5432',
    database:'employees_db'
})


function displayMenu (){
    const questions =  [
        {
            type: 'list',
            name: 'menuOptions',
            message: 'Hello User what is your query?',
            choices: [
                'VIEW ALL EMPLOYEES',
                'ADD EMPLOYEE',
                'VIEW ALL ROLES',
                'UPDATE ROLES',
                'ADD ROLE',
                'VIEW ALL DEPARTMENTS',
                'ADD DEPARTMENTS', 
                'QUIT'
                
            ]
        }
    ]
    return inquirer.prompt(questions);
};


function viewEmp(){
    pool.query(`SELECT
employees.id, employees.last_name, 
employees.first_name,  
role.title, 
department.name,
role.salary,
CONCAT (employees.last_name,' ',employees.first_name) 
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
        console.log('Viewing Slave Data ......');
        console.table(result.rows);
        displayMenu();
    }
})
};

function addEmp(){
    console.clear();
const questions = [
    {
        type: 'input',
        name: 'firstName',
        message:'Whats their first name?'
        
    },
    {
        type: 'input',
        name: 'lastName',
        message:'Whats their last name?'
    },
    {
        type: 'list',
        name: 'role',
        message:'Whats their company role?',
        choices:[``],
        
    },
    {
        type: 'list',
        name: 'manager',
        message:`Who's their Controller ?`,
        choices:[``]
    },
];
inquirer.prompt(questions).then(answers => {
    console.log(answers,'WAGE SLAVE ADDED....')
    displayMenu();    
});
};

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
            console.log('VIEWING ROLES......')
            console.table(result.rows);
            displayMenu();
        };
    });

};

function updateRole(){
const questions = [
    {
        type:'list',
        name: 'employee',
        choices:[`${tbd}`]
    },
    {
        type:'list',
        name: 'newRole',
        choices:[`${tbd}`]
    }
]
return inquirer.prompt(questions);
};

function addRole(){
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
        choices:[`${tbd}`]
    }
]
return inquirer.prompt(questions)
};

function viewDep(){
    pool.query(`SELECT * FROM department`, (err, result) =>{
        if(err){
            console.error(err);
        } else{
            console.log('DEPARTMENT LIST.....')
            console.table(result.rows);
            displayMenu();
        }
    });
};

function addDep(){

};



function handleMenu (selection){
    switch (selection.menuOptions) {
        case 'VIEW ALL EMPLOYEES':
            viewEmp();
            break;
        
        case 'ADD EMPLOYEE':
            addEmp();
            break;
        
        case 'VIEW ALL ROLES':
            viewRole();
            break;
        
        case 'UPDATE ROLES':
            updateRole();
            break;
        
        case 'ADD ROLE':
            addRole();
            break;
        
        case 'VIEW ALL DEPARTMENTS':
            viewDep();
            break;
        
        case 'ADD DEPARTMENTS':
            addDep();
            break;
        
        case 'QUIT':
            console.log('EXITING.......')
        return true;
            
            default:
                console.log('BAD TOKEN. SECURITY DEPLOYED. GOODBYE USER.')
    }
    return false;
}

async function menu (){
    let exitApp = false;

    while (!exitApp) {
        const selection = await displayMenu();
        exitApp = await handleMenu(selection);
        }
    }


menu();