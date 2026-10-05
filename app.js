import express from "express";
import pool from "./db.js";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());

// app.post("/users", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         const result = await pool.query(
//             "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
//             [name, email, password]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to create user" });
//     }
// });

// Create Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Login failed"
        });
    }
});

// put
app.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [name, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create user"
        });
    }
});

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get users" });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get user"
        });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, email, password } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET name = $1, email = $2, password = $3
             WHERE id = $4
             RETURNING *`,
            [name, email, password, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update user"
        });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete user"
        });
    }
});


// ==================== PROJECTS ====================

// CREATE PROJECT
app.post("/projects", async (req, res) => {
    try {
        const { name, description, user_id } = req.body;

        const result = await pool.query(
            `INSERT INTO projects (name, description, user_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, description, user_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create project"
        });
    }
});


// GET ALL PROJECTS
app.get("/projects", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM projects ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get projects"
        });
    }
});


// GET ONE PROJECT
app.get("/projects/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            "SELECT * FROM projects WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get project"
        });
    }
});


// UPDATE PROJECT
app.put("/projects/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description, user_id } = req.body;

        const result = await pool.query(
            `UPDATE projects
             SET name = $1, description = $2, user_id = $3
             WHERE id = $4
             RETURNING *`,
            [name, description, user_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update project"
        });
    }
});


// DELETE PROJECT
app.delete("/projects/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully",
            project: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete project"
        });
    }
});


// ==================== TASKS ====================

// // CREATE TASK
// app.post("/tasks", async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             status,
//             due_date,
//             project_id,
//             user_id
//         } = req.body;

//         const result = await pool.query(
//             `INSERT INTO tasks
//             (title, description, status, due_date, project_id, user_id)
//             VALUES ($1, $2, $3, $4, $5, $6)
//             RETURNING *`,
//             [
//                 title,
//                 description,
//                 status || "pending",
//                 due_date,
//                 project_id,
//                 user_id
//             ]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Failed to create task"
//         });
//     }
// });


// // GET ALL TASKS
// app.get("/tasks", async (req, res) => {
//     try {
//         const result = await pool.query(
//             "SELECT * FROM tasks ORDER BY id"
//         );

//         res.json(result.rows);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Failed to get tasks"
//         });
//     }
// });


// // GET ONE TASK
// app.get("/tasks/:id", async (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         const result = await pool.query(
//             "SELECT * FROM tasks WHERE id = $1",
//             [id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 error: "Task not found"
//             });
//         }

//         res.json(result.rows[0]);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Failed to get task"
//         });
//     }
// });


// // UPDATE TASK
// app.put("/tasks/:id", async (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         const {
//             title,
//             description,
//             status,
//             due_date,
//             project_id,
//             user_id
//         } = req.body;

//         const result = await pool.query(
//             `UPDATE tasks
//              SET title = $1,
//                  description = $2,
//                  status = $3,
//                  due_date = $4,
//                  project_id = $5,
//                  user_id = $6
//              WHERE id = $7
//              RETURNING *`,
//             [
//                 title,
//                 description,
//                 status,
//                 due_date,
//                 project_id,
//                 user_id,
//                 id
//             ]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 error: "Task not found"
//             });
//         }

//         res.json(result.rows[0]);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Failed to update task"
//         });
//     }
// });


// // DELETE TASK
// app.delete("/tasks/:id", async (req, res) => {
//     try {
//         const id = Number(req.params.id);

//         const result = await pool.query(
//             "DELETE FROM tasks WHERE id = $1 RETURNING *",
//             [id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 error: "Task not found"
//             });
//         }

//         res.json({
//             message: "Task deleted successfully",
//             task: result.rows[0]
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Failed to delete task"
//         });
//     }
// });


// ==================== TASKS ====================

// CREATE TASK
// app.post("/tasks", async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             status,
//             due_date,
//             project_id,
//             user_id
//         } = req.body;
//         if (!title) {
//             return res.status(400).json({
//                 error: "Task title is required"
//             });
//         }

//         const result = await pool.query(
//             `INSERT INTO tasks
//             (title, description, status, due_date, project_id, user_id)
//             VALUES ($1, $2, $3, $4, $5, $6)
//             RETURNING *`,
//             [
//                 title,
//                 description,
//                 status || "pending",
//                 due_date,
//                 project_id,
//                 user_id
//             ]
//         );

//         res.status(201).json(result.rows[0]);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             error: "Failed to create task"
//         });
//     }
// });

app.post("/tasks", async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            due_date,
            project_id,
            user_id
        } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Task title is required"
            });
        }

        const project = await pool.query(
            "SELECT id FROM projects WHERE id = $1",
            [project_id]
        );

        if (project.rows.length === 0) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        const user = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [user_id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks
            (title, description, status, due_date, project_id, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                title,
                description,
                status || "pending",
                due_date,
                project_id,
                user_id
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create task"
        });
    }
});


// GET ALL TASKS
app.get("/tasks", async (req, res) => {
    try {
        const { sort = "id", order = "asc" } = req.query;

        const allowedSortFields = [
            "id",
            "title",
            "status",
            "due_date",
            "created_at"
        ];

        if (!allowedSortFields.includes(sort)) {
            return res.status(400).json({
                error: "Invalid sort field"
            });
        }

        const sortOrder = order.toLowerCase() === "desc"
            ? "DESC"
            : "ASC";

        const result = await pool.query(
            `SELECT * FROM tasks
             ORDER BY ${sort} ${sortOrder}`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get tasks"
        });
    }
});



// GET TASK DETAILS - MUST COME BEFORE /tasks/:id
app.get("/tasks/details", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                tasks.id,
                tasks.title,
                tasks.description,
                tasks.status,
                tasks.due_date,
                projects.name AS project_name,
                users.name AS user_name
            FROM tasks
            JOIN projects
                ON tasks.project_id = projects.id
            JOIN users
                ON tasks.user_id = users.id
            ORDER BY tasks.id
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get task details"
        });
    }
});

// Task Search & Filtering
app.get("/tasks/search", async (req, res) => {
    try {
        const { title } = req.query;

        const result = await pool.query(
            "SELECT * FROM tasks WHERE title ILIKE $1",
            [`%${title}%`]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to search tasks"
        });
    }
});

// Filter Tasks by Status
app.get("/tasks/filter", async (req, res) => {
    try {
        const { status } = req.query;

        const result = await pool.query(
            "SELECT * FROM tasks WHERE status = $1",
            [status]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to filter tasks"
        });
    }
});


// Dashboard API
app.get("/dashboard", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) AS total_tasks,
                COUNT(*) FILTER (WHERE status = 'completed') AS completed_tasks,
                COUNT(*) FILTER (WHERE status = 'pending') AS pending_tasks
            FROM tasks
        `);

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get dashboard"
        });
    }
});

// Overdue Tasks
app.get("/tasks/overdue", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM tasks
            WHERE due_date < CURRENT_DATE
            AND status != 'completed'
            ORDER BY due_date
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get overdue tasks"
        });
    }
});

// GET ONE TASK
app.get("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get task"
        });
    }
});


// UPDATE TASK
app.put("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            title,
            description,
            status,
            due_date,
            project_id,
            user_id
        } = req.body;

        const result = await pool.query(
            `UPDATE tasks
             SET title = $1,
                 description = $2,
                 status = $3,
                 due_date = $4,
                 project_id = $5,
                 user_id = $6
             WHERE id = $7
             RETURNING *`,
            [
                title,
                description,
                status,
                due_date,
                project_id,
                user_id,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update task"
        });
    }
});


// DELETE TASK

app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete task"
        });
    }
});




// ==================== TASKS WITH PROJECT AND USER ====================

app.get("/tasks/details", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                tasks.id,
                tasks.title,
                tasks.description,
                tasks.status,
                tasks.due_date,
                projects.name AS project_name,
                users.name AS user_name
            FROM tasks
            JOIN projects
                ON tasks.project_id = projects.id
            JOIN users
                ON tasks.user_id = users.id
            ORDER BY tasks.id
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to get task details"
        });
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});