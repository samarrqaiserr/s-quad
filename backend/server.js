require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const mongoose = require("mongoose"); // Import Mongoose
require("./passportSetup"); // Import OAuth setup
const User = require("./models/User"); // User model
const Competition = require("./models/Competition");
const multer = require("multer");
const Submission = require("./models/Submission");

const app = express();
app.use(express.json());
app.use(cors());

// **Connect to MongoDB**
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// **Signup Route**
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// **Login Route**
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role }, // Include role in the token
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // ✅ Explicitly return role in the response
//     res.json({ token, role: user.role });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Error logging in" });
//   }
// });
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Include role in the token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful:", { token, role: user.role }); // Debug log

    res.json({ token, role: user.role }); // ✅ Always send response
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in" }); // ✅ Always send response
  }
});

// **Google Auth Route**
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

// **Facebook Auth Route**
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

app.get("/competitions", async (req, res) => {
  try {
    const competitions = await Competition.find();
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching competitions" });
  }
});

// Create a new competition
app.post("/competitions", async (req, res) => {
  try {
    const { competitionNumber, details, deadline } = req.body;

    if (!competitionNumber || !details || !deadline) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingCompetition = await Competition.findOne({
      competitionNumber,
    });
    if (existingCompetition) {
      return res
        .status(400)
        .json({ error: "Competition number must be unique" });
    }

    const newCompetition = new Competition({
      competitionNumber,
      details,
      deadline,
    });

    await newCompetition.save();
    res.status(201).json({ message: "Competition created successfully!" });
  } catch (error) {
    console.error("Error creating competition:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Configure Multer for MP3 uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Handle MP3 Submission

app.post("/submissions", upload.single("mp3AudioUpload"), async (req, res) => {
  try {
    // Extract the token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Decode token and get userId
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your secret key
    const userId = decoded.userId; // Extract user ID from token

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "MP3 file is required" });
    }

    const { competitionNumber } = req.body;

    const newSubmission = new Submission({
      competitionNumber,
      userId, // Now automatically assigned from the token
      mp3AudioUpload: req.file.path,
    });

    await newSubmission.save();
    res.status(201).json({ message: "Submission successful" });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// **Start Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
