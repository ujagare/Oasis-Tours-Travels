// Packages API Routes
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

// Get all packages
router.get("/", async (req, res) => {
  try {
    const packagesPath = path.join(__dirname, "../../../packages-data.json");
    const data = await fs.readFile(packagesPath, "utf8");
    const packages = JSON.parse(data);

    res.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("Error reading packages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load packages data",
    });
  }
});

// Get specific package by ID
router.get("/:packageId", async (req, res) => {
  try {
    const { packageId } = req.params;
    const packagesPath = path.join(__dirname, "../../../packages-data.json");
    const data = await fs.readFile(packagesPath, "utf8");
    const packages = JSON.parse(data);

    const package = packages.packages[packageId];

    if (!package) {
      return res.status(404).json({
        success: false,
        error: "Package not found",
      });
    }

    res.json({
      success: true,
      data: package,
    });
  } catch (error) {
    console.error("Error reading package:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load package data",
    });
  }
});

// Search packages
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const packagesPath = path.join(__dirname, "../../../packages-data.json");
    const data = await fs.readFile(packagesPath, "utf8");
    const packages = JSON.parse(data);

    const searchResults = Object.entries(packages.packages).filter(
      ([key, package]) => {
        return (
          package.title.toLowerCase().includes(query.toLowerCase()) ||
          package.description.toLowerCase().includes(query.toLowerCase()) ||
          package.overview.destinations
            .toLowerCase()
            .includes(query.toLowerCase())
        );
      }
    );

    const results = Object.fromEntries(searchResults);

    res.json({
      success: true,
      data: { packages: results },
      count: searchResults.length,
    });
  } catch (error) {
    console.error("Error searching packages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search packages",
    });
  }
});

module.exports = router;
