const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();

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

    res.json({
      message: "Resume analyzed successfully 🚀",
      feedback,
      atsScore,
      detectedSkills,
      missingSkills,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });

  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port 5000`);
});