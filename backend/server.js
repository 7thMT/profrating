const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 8080;

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const professorSchema = new mongoose.Schema({
  name: String,
  rating: Number,
});

const Professor = mongoose.model("Professor", professorSchema);


app.get("/profs", async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/profs/:id", getProfessor, (req, res) => {
  res.json(res.professor);
});


app.post("/profs", async (req, res) => {
  const professor = new Professor({
    name: req.body.name,
    rating: req.body.rating,
  });

  try {
    const newProfessor = await professor.save();
    res.status(201).json(newProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.put("/profs/:id", getProfessor, async (req, res) => {
  if (req.body.name != null) {
    res.professor.name = req.body.name;
  }
  if (req.body.rating != null) {
    res.professor.rating = req.body.rating;
  }

  try {
    const updatedProfessor = await res.professor.save();
    res.json(updatedProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.delete("/profs/:id", getProfessor, async (req, res) => {
  try {
    await res.professor.remove();
    res.json({ message: "Professor gelöscht" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProfessor(req, res, next) {
  try {
    const professor = await Professor.findById(req.params.id);
    if (professor == null) {
      return res.status(404).json({ message: "Professor nicht gefunden" });
    }
    res.professor = professor;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});