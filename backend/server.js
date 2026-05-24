require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

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

const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

app.get("/", (req, res) => {

  res.send("ResumeIQ AI Backend Running 🚀");

});

app.post("/upload", upload.single("resume"), async (req, res) => {

  try {

    console.log("UPLOAD API HIT");

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

    const detectedSkills = [];

    const missingSkills = [];

    keywords.forEach((skill) => {

      if (
        resumeText.includes(skill) &&
        jobDescription.includes(skill)
      ) {

        detectedSkills.push(skill);

      }

      if (
        jobDescription.includes(skill) &&
        !resumeText.includes(skill)
      ) {

        missingSkills.push(skill);

      }

    });

    const atsScore = Math.round(
      (detectedSkills.length / keywords.length) * 100
    );

    const feedback = `
Matched Skills:
${detectedSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

✅ Resume analyzed against job description.
`;

    await Resume.create({

      atsScore,

      matchedSkills: detectedSkills,

      missingSkills,

      feedback,

    });

    res.json({

      atsScore,

      matchedSkills: detectedSkills,

      missingSkills,

      feedback,

    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      error: error.message,
    });

  }

});

app.get("/history", async (req, res) => {

  const history = await Resume.find().sort({
    createdAt: -1,
  });

  res.json(history);

});

const PORT = 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});