const Startup = require("../models/Startup");
const Review = require("../models/Review");
const User = require("../models/User");

exports.createStartup = async (req, res) => {
  try {

    const {
      title,
      description,
      founder,
      fundingRequired,
      techSupportRequired,
      mentorshipRequired,
      mentorReviewRequested
    } = req.body;

    const startup = new Startup({
      title,
      description,
      founder,
      fundingRequired,
      techSupportRequired,
      mentorshipRequired,
      mentorReviewRequested
    });

    await startup.save();

    res.status(201).json({
      message: "Startup created successfully",
      startup
    });

  } catch (error) {

    res.status(500).json({
      message: "Error creating startup",
      error
    });

  }
};
exports.getAllStartups = async (req, res) => {
  try {

    const startups = await Startup.find().populate("founder", "name email");

    res.status(200).json(startups);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching startups",
      error
    });

  }
};
exports.calculateStartupScore = async (req, res) => {
  try {
    const { startupId } = req.params;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found"
      });
    }

    const reviews = await Review.find({ startup: startupId });

    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    const progressScore = Math.min(startup.progress / 2, 40);

    const reviewScore = Math.min((averageRating / 5) * 30, 30);

    const teamScore = Math.min(startup.professionalsJoined.length * 5, 20);

    const investorScore = Math.min(startup.investorsInterested.length * 2, 10);

    const finalScore = Math.round(
      progressScore + reviewScore + teamScore + investorScore
    );

    startup.startupScore = finalScore;
    await startup.save();

    res.json({
      message: "Startup score calculated successfully",
      startupId: startup._id,
      progressScore,
      reviewScore,
      teamScore,
      investorScore,
      finalScore
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error calculating startup score",
      error: error.message
    });
  }
};
exports.updateStartupProgress = async (req, res) => {
  try {
    const { startupId } = req.params;
    const { progress, latestUpdate } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found"
      });
    }

    startup.progress = progress;
    startup.latestUpdate = latestUpdate;

    await startup.save();

    res.json({
      message: "Startup progress updated successfully",
      startup
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating startup progress",
      error: error.message
    });
  }
};
exports.addInvestorInterest = async (req, res) => {
  try {
    const { startupId } = req.params;
    const { investorId } = req.body;

    const startup = await Startup.findById(startupId);

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found"
      });
    }

    const investor = await User.findById(investorId);

    if (!investor) {
      return res.status(404).json({
        message: "Investor not found"
      });
    }

    if (investor.role !== "investor") {
      return res.status(403).json({
        message: "Only users with investor role can show interest"
      });
    }

    const alreadyInterested = startup.investorsInterested.some(
      (id) => id.toString() === investorId.toString()
    );

    if (!alreadyInterested) {
      startup.investorsInterested.push(investorId);
      await startup.save();
    }

    res.json({
      message: "Investor interest added successfully",
      investorsInterested: startup.investorsInterested.length
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error adding investor interest",
      error: error.message
    });
  }
};
exports.getStartupDetails = async (req, res) => {
  try {

    const { startupId } = req.params;

    const startup = await Startup.findById(startupId)
      .populate("founder", "name email role portfolio verified")
      .populate("professionalsJoined", "name email role skills portfolio verified")
      .populate("mentorsJoined", "name email role skills portfolio verified")
      .populate("investorsInterested", "name email role portfolio verified");

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found"
      });
    }

    const reviews = await Review.find({ startup: startupId })
      .populate("mentor", "name email");

    res.json({
      startup,
      reviews,
      investorCount: startup.investorsInterested.length,
      teamSize: startup.professionalsJoined.length
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching startup details",
      error: error.message
    });

  }
};
exports.searchStartups = async (req, res) => {
  try {
    const {
      techSupportRequired,
      mentorshipRequired,
      mentorReviewRequested,
      minScore,
      minProgress,
      title
    } = req.query;

    let filter = {};

    if (techSupportRequired !== undefined) {
      filter.techSupportRequired = techSupportRequired === "true";
    }

    if (mentorshipRequired !== undefined) {
      filter.mentorshipRequired = mentorshipRequired === "true";
    }

    if (mentorReviewRequested !== undefined) {
      filter.mentorReviewRequested = mentorReviewRequested === "true";
    }

    if (minScore !== undefined) {
      filter.startupScore = { $gte: Number(minScore) };
    }

    if (minProgress !== undefined) {
      filter.progress = { $gte: Number(minProgress) };
    }

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    const startups = await Startup.find(filter)
      .populate("founder", "name email")
      .select("-__v");

    res.json(startups);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error searching startups",
      error: error.message
    });
  }
};
exports.getFounderStartups = async (req, res) => {

  try {

    const startups = await Startup.find({
      founder: req.params.founderId
    }).populate("founder", "name email");

    res.json(startups);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching founder startups",
      error: error.message
    });

  }

};
exports.getMentorStartups = async (req, res) => {
  try {
    const startups = await Startup.find({
      mentorsJoined: req.params.mentorId
    })
      .populate("founder", "name email")
      .populate("mentorsJoined", "name email role");

    res.json(startups);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching mentor startups",
      error: error.message
    });
  }
};
exports.getInvestorStartups = async (req, res) => {
  try {

    const startups = await Startup.find({
      investorsInterested: req.params.investorId
    })
      .populate("founder", "name email")
      .populate("investorsInterested", "name email role");

    res.json(startups);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching investor startups",
      error: error.message
    });

  }
};