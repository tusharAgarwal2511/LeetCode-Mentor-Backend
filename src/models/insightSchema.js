const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema({
    _id: { type: String, required: true },          // problemSlug from LeetCode URL as id for fast search
    problemNo: { type: Number, required: true },    // leetcode problem id of the problem
    pc: { type: String, required: true },           // ps: pseudocode of the solution
    concept: { type: String, required: true },      // what this problem teaches
    pre: { type: String },                          // prerequisites for solving
    uc: { type: String },                           // real world application
    createdAt: { type: Date, default: Date.now }    // optional timestamp
});

module.exports = mongoose.model("Insight", insightSchema);
