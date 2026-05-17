const express = require("express");
const cors = require("cors");
const multer = require("multer");

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
    const fakeFeedback = `
✅ ATS Score: 82/100

Suggestions:
- Add more AWS and Kubernetes keywords
- Improve DevOps project descriptions
- Include CI/CD and Terraform experience
- Add measurable achievements
`;

    res.json({
      message: "Resume analyzed successfully 🚀",
      feedback: fakeFeedback,
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
  console.log(`Server running on port ${PORT}`);
});