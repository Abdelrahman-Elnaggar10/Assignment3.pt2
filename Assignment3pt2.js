// Q1

const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());


const readUsers = () => {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};


const writeUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};


app.post('/user', (req, res) => {
    const newUser = req.body;
    const users = readUsers();

    const checkEmail = users.find(u => u.email === newUser.email);

    if (checkEmail) {
        res.json({ message: "Email already exists." });
    } else {
       
        if (!newUser.id) {
            newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
        }
        users.push(newUser);
        writeUsers(users);
        res.json({ message: "User added successfully." });
    }
});

// Q2
app.patch('/user/:id', (req, res) => {
    const id = req.params.id;
    const { name, age, email } = req.body;
    const users = readUsers();

    const user = users.find(u => u.id == id);

    if (!user) {
        res.json({ message: "User ID not found." });
    } else {
        if (name) user.name = name;
        if (age) user.age = age;
        if (email) user.email = email;

        writeUsers(users);

        if (age && !name && !email) {
            res.json({ message: "User age updated successfully." });
        } else if (name && !age && !email) {
            res.json({ message: "User name updated successfully." });
        } else if (email && !name && !age) {
            res.json({ message: "User email updated successfully." });
        } else {
            res.json({ message: "User updated successfully." });
        }
    }
});

// Q3


app.delete(['/user', '/user/:id'], (req, res) => {
    const id = req.params.id || req.body.id;
    const users = readUsers();

    const userIndex = users.findIndex(u => u.id == id);

    if (userIndex === -1) {
        res.json({ message: "User ID not found." });
    } else {
        users.splice(userIndex, 1);
        writeUsers(users);
        res.json({ message: "User deleted successfully." });
    }
});

// Q4

app.get('/user/getByName', (req, res) => {
    const name = req.query.name;
    const users = readUsers();

    const user = users.find(u => u.name === name);

    if (user) {
        res.json(user);
    } else {
        res.json({ message: "User name not found." });
    }
});

// Q5

app.get('/user', (req, res) => {
    const users = readUsers();
    res.json(users);
});

// Q6

app.get('/user/filter', (req, res) => {
    const minAge = req.query.minAge;
    const users = readUsers();

    const filteredUsers = users.filter(u => u.age >= Number(minAge));

    if (filteredUsers.length > 0) {
        res.json(filteredUsers);
    } else {
        res.json({ message: "no user found" });
    }
});

// Q7

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const users = readUsers();

    const user = users.find(u => u.id == id);

    if (user) {
        res.json(user);
    } else {
        res.json({ message: "User not found." });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});