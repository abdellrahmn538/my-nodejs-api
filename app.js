const { Client } = require("pg");
const express = require("express");

const app = express();
app.use(express.json());

// 🧩 إعداد الاتصال بقاعدة البيانات
const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "ahmed",
    database: "demopost"
});

// 🧠 الاتصال بقاعدة البيانات
con.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Connection error:", err));

// 📩 إضافة بيانات جديدة
app.post('/postData', (req, res) => {
    const { name, id } = req.body;

    if (!name || !id) {
        return res.status(400).json({ error: "Name and ID are required" });
    }

    const insert_query = 'INSERT INTO demotable (name, id) VALUES ($1, $2)';
    con.query(insert_query, [name, id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error inserting data");
        } else {
            res.send("✅ Data inserted successfully");
        }
    });
});

// 📤 جلب كل البيانات
app.get("/fetchData", (req, res) => {
    const fetch_query = "SELECT * FROM demotable";
    con.query(fetch_query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching data");
        } else {
            res.json(result.rows);
        }
    });
});

// 🔍 جلب بيانات حسب ID
app.get('/fetchbyID/:id', (req, res) => {
    const id = req.params.id;
    const fetch_query = "SELECT * FROM demotable WHERE id = $1";
    con.query(fetch_query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching data by ID");
        } else if (result.rows.length === 0) {
            res.status(404).send("No record found");
        } else {
            res.json(result.rows);
        }
    });
});

// ✏️ تحديث بيانات حسب ID
app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    const update_query = "UPDATE demotable SET name = $1 WHERE id = $2";
    con.query(update_query, [name, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error updating data");
        } else if (result.rowCount === 0) {
            res.status(404).send("No record found to update");
        } else {
            res.send("✅ Data updated successfully");
        }
    });
});

// ❌ حذف بيانات حسب ID
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const delete_query = "DELETE FROM demotable WHERE id = $1";
    con.query(delete_query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error deleting data");
        } else if (result.rowCount === 0) {
            res.status(404).send("No record found to delete");
        } else {
            res.send("✅ Data deleted successfully");
        }
    });
});

// 🚀 تشغيل السيرفر
app.listen(3000, () => {
    console.log("🚀 Server is running on port 3000...");
});

