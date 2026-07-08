require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const starterProblems = [
  {
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "Easy",
    topicTags: ["Array", "Hash Table"],
    companies: ["Amazon", "Google", "Apple"],
    acceptanceRate: 52.3,
    order: 1
  },
  {
    title: "Valid Parentheses",
    titleSlug: "valid-parentheses",
    difficulty: "Easy",
    topicTags: ["String", "Stack"],
    companies: ["Amazon", "Microsoft", "Meta"],
    acceptanceRate: 40.5,
    order: 2
  },
  {
    title: "Best Time to Buy and Sell Stock",
    titleSlug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    topicTags: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Bloomberg", "Microsoft"],
    acceptanceRate: 54.4,
    order: 3
  },
  {
    title: "Contains Duplicate",
    titleSlug: "contains-duplicate",
    difficulty: "Easy",
    topicTags: ["Array", "Hash Table", "Sorting"],
    companies: ["Apple", "Amazon", "Microsoft"],
    acceptanceRate: 61.2,
    order: 4
  },
  {
    title: "Group Anagrams",
    titleSlug: "group-anagrams",
    difficulty: "Medium",
    topicTags: ["Array", "Hash Table", "String", "Sorting"],
    companies: ["Amazon", "Microsoft", "Goldman Sachs"],
    acceptanceRate: 68.3,
    order: 5
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems.");

    // Insert new problems
    await Problem.insertMany(starterProblems);
    console.log("Successfully seeded starter problems!");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedDB();
