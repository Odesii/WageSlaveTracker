INSERT INTO department (name) VALUES
('Cybernetic Sales'),
('Neural Engineering'),
('Crypto-Finance'),
('Corporate Espionage');

-- Insert data into 'role'
INSERT INTO role (title, salary, department_id) VALUES
('Augmentation Broker', 220000, 1),
('Implant Specialist', 180000, 1),
('Chief Neural Architect', 300000, 2),
('AI Programmer', 250000, 2),
('Blockchain Strategist', 275000, 3),
('Cryptocurrency Analyst', 230000, 3),
('Infiltration Expert', 400000, 4);

-- Insert data into 'employee'
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Jax', 'Nova', 1, NULL),
('Zara', 'Flux', 1, 1),
('Kira', 'Storm', 2, 1),
('Orion', 'Steel', 3, NULL),
('Lyra', 'Hart', 4, 3),
('Rex', 'Quantum', 5, NULL),
('Ivy', 'Crypto', 6, 5),
('Ghost', 'Mancer', 7, NULL);