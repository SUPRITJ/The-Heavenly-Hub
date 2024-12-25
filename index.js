const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const dbUrl = "mongodb+srv://Admin69:root69@cluster0.0u2vw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbUrl)
  .then(() => {
    console.info("Connected to Database");
  })
  .catch((e) => {
    console.error("Database Connection Error:", e);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const { name, email, number, pass, cpass } = req.body;

  if (pass !== cpass) {
    return res.send(`
      <script>
        alert("Passwords do not match");
        window.location.href = "/register.html";
      </script>
    `);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send(`
        <script>
          alert("User already exists");
          window.location.href = "/login.html";
        </script>
      `);
    }

    const newUser = new User({
      name,
      email,
      number,
      password: pass,
    });

    await newUser.save();
    console.log("User Registered Successfully");
    return res.send(`
      <script>
        alert("Registration successful");
        window.location.href = "/home.html";
      </script>
    `);
  } catch (err) {
    console.error("Error Registering User:", err);
    return res.send(`
      <script>
        alert("Error registering user");
        window.location.href = "/register.html";
      </script>
    `);
  }
});

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send(`
        <script>
          alert("User not found");
          window.location.href = "/login.html";
        </script>
      `);
    }

    if (user.password !== pass) {
      return res.send(`
        <script>
          alert("Invalid password");
          window.location.href = "/login.html";
        </script>
      `);
    }

    console.log("User Logged In Successfully");
    return res.send(`
      <script>
        alert("Login successful");
        window.location.href = "/home.html"; // Redirect to home page or another page
      </script>
    `);
  } catch (err) {
    console.error("Error Logging In:", err);
    return res.status(500).send(`
      <script>
        alert("Error logging in. Please try again later.");
        window.location.href = "/login.html";
      </script>
    `);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
