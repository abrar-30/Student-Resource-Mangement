import express from "express";
const router = express.Router();

router.get("/resources", (req, res) => {
  res.send("Get all resources");
});

router.get("/resource/:id", (req, res) => {
  res.send(`Get resource with ID ${req.params.id}`);
});

router.post("/resources", (req, res) => {
  res.send("Create a new resource");
});

router.put("/resource/:id", (req, res) => {
  res.send(`Update resource with ID ${req.params.id}`);
});

router.delete("/resource/:id", (req, res) => {
  res.send(`Delete resource with ID ${req.params.id}`);
});

export default router;
