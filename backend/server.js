require("dotenv").config();

const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.send("Backend Connected To Supabase 🚀");
});

app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password, role }]);

  if (error) {
    return res.json({ error });
  }

  res.json({ data });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error) {
    return res.json({
      success: false,
      message: "Invalid email or password"
    });
  }

  res.json({
    success: true,
    user: data
  });
});
app.post("/jobs", async (req, res) => {
  const {
    title,
    description,
    location,
    salary,
    recruiter_id
  } = req.body;

  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        title,
        description,
        location,
        salary,
        recruiter_id
      }
    ]);

  if (error) {
    return res.json({ error });
  }

  res.json({
    success: true,
    data
  });
});
app.get("/jobs", async (req, res) => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*");

  if (error) {
    return res.json({ error });
  }

  res.json(data);
});
app.post("/apply", async (req, res) => {
  const { job_id, user_id } = req.body;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        job_id,
        user_id
      }
    ]);

  if (error) {
    return res.json({ error });
  }

  res.json({
    success: true,
    data
  });
});
app.get("/applications", async (req, res) => {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      users (
        email,
        role
      ),
      jobs (
        title
      )
    `);

  if (error) {
    return res.json({ error });
  }

  res.json(data);
});
app.put("/applications/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) {
    return res.json({ error });
  }

  res.json({
    success: true,
    data
  });
});
app.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      res.json({
        success: true,
        file: req.file
      });
    } catch (error) {
      res.json({
        success: false,
        error
      });
    }
  }
);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});