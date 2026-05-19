require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mongoose = require("mongoose");

const Resume = require("./models/Resume");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("ResumeIQ AI Backend Running 🚀");
});

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text.toLowerCase();

    const jobDescription =
      req.body.jobDescription.toLowerCase();

    const keywords = [
      "aws",
      "docker",
      "kubernetes",
      "terraform",
      "jenkins",
      "linux",
      "ci/cd",
    ];

    const matchedSkills = [];
    const missingSkills = [];

    keywords.forEach((skill) => {

      if (
        resumeText.includes(skill) &&
        jobDescription.includes(skill)
      ) {
        matchedSkills.push(skill);
      }

      if (
        jobDescription.includes(skill) &&
        !resumeText.includes(skill)
      ) {
        missingSkills.push(skill);
      }

    });

    const atsScore = Math.round(
      (matchedSkills.length / keywords.length) * 100
    );

    const feedback = `
Matched Skills:
${matchedSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

✅ Resume analyzed against job description.
`;

    // SAVE TO DATABASE
    await Resume.create({
      atsScore,
      matchedSkills,
      missingSkills,
      feedback,
    });

    // SEND RESPONSE
    res.json({
      message: "Resume analyzed successfully 🚀",
      atsScore,
      matchedSkills,
      missingSkills,
      feedback,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });

  }
});

// HISTORY API
app.get("/history", async (req, res) => {
  try {

    const resumes = await Resume.find().sort({
      createdAt: -1,
    });

    res.json(resumes);

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch history",
    });

  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});