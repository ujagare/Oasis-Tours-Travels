// Bookings API Routes
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

// Create new booking
router.post("/", async (req, res) => {
  try {
    const bookingData = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Save booking to file (in production, use database)
    const bookingsPath = path.join(__dirname, "../data/bookings.json");

    let bookings = [];
    try {
      const data = await fs.readFile(bookingsPath, "utf8");
      bookings = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start with empty array
      bookings = [];
    }

    bookings.push(bookingData);

    // Ensure data directory exists
    await fs.mkdir(path.dirname(bookingsPath), { recursive: true });
    await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2));

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: bookingData,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create booking",
    });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookingsPath = path.join(__dirname, "../data/bookings.json");

    try {
      const data = await fs.readFile(bookingsPath, "utf8");
      const bookings = JSON.parse(data);

      res.json({
        success: true,
        data: bookings,
        count: bookings.length,
      });
    } catch (error) {
      // File doesn't exist
      res.json({
        success: true,
        data: [],
        count: 0,
      });
    }
  } catch (error) {
    console.error("Error reading bookings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load bookings",
    });
  }
});

// Get booking by ID
router.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookingsPath = path.join(__dirname, "../data/bookings.json");

    const data = await fs.readFile(bookingsPath, "utf8");
    const bookings = JSON.parse(data);

    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error reading booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load booking",
    });
  }
});

// Update booking status
router.patch("/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const bookingsPath = path.join(__dirname, "../data/bookings.json");
    const data = await fs.readFile(bookingsPath, "utf8");
    const bookings = JSON.parse(data);

    const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date().toISOString();

    await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2));

    res.json({
      success: true,
      message: "Booking status updated",
      data: bookings[bookingIndex],
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update booking",
    });
  }
});

module.exports = router;
