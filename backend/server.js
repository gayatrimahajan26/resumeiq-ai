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

    const detectedSkills = [];
    const missingSkills = [];

    let feedback = `
Suggestions:
`;

    if (resumeText.includes("aws")) {
      detectedSkills.push("AWS");
    } else {
      missingSkills.push("AWS");
      feedback += "\n- Add AWS skills";
    }

    if (resumeText.includes("docker")) {
      detectedSkills.push("Docker");
    } else {
      missingSkills.push("Docker");
      feedback += "\n- Add Docker experience";
    }

    if (resumeText.includes("kubernetes")) {
      detectedSkills.push("Kubernetes");
    } else {
      missingSkills.push("Kubernetes");
      feedback += "\n- Add Kubernetes projects";
    }

    if (resumeText.includes("terraform")) {
      detectedSkills.push("Terraform");
    } else {
      missingSkills.push("Terraform");
      feedback += "\n- Add Terraform knowledge";
    }

    const atsScore = detectedSkills.length * 25;

    feedback += "\n\n✅ Resume analyzed based on actual PDF content.";

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