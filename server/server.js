const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const emergencySchema = new mongoose.Schema({
  contactNumber: String,
  emergencyType: String,
  description: String,
  filePath: String,
});

const Emergency = mongoose.model("Emergency", emergencySchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post("/api/emergency", upload.single("file"), async (req, res) => {
  try {
    const { contactNumber, emergencyType, description } = req.body;
    const filePath = req.file ? req.file.path : "";

    const emergency = new Emergency({ contactNumber, emergencyType, description, filePath });
    await emergency.save();

    res.status(201).json({ message: "Emergency report submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving data" });
  }
});


const EmergencyReportSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    imageUrl: String,
    timestamp: { type: Date, default: Date.now },
  });
  
  const EmergencyReport = mongoose.model("EmergencyReport", EmergencyReportSchema);
  

// Handle Emergency Alert
app.post("/api/emergencyreport", upload.single("image"), async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
      const emergencyReport = new EmergencyReport({ latitude, longitude, imageUrl });
      await emergencyReport.save();
  
      res.json({ message: "Emergency report saved successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });


// API: Fetch All Emergency Reports
app.get("/api/emergencyreports", async (req, res) => {
  try {
    const reports = await EmergencyReport.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


  
  // Serve uploaded images
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

