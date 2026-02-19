const express = require("express");
const router = express.Router();
const Insight = require("../models/insightSchema.js");

/**
 * POST /api/insights/bulk-add-insights
 * Body: Array of insight objects following the Insight schema
 * Adds each insight to the database, overwriting existing ones if _id exists
 */
router.post("/bulk-add-insights", async (req, res) => {
    const apiKey = req.header("x-api-key");
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        let insights = req.body;

        if (!Array.isArray(insights) || insights.length === 0) {
            return res.status(400).json({ error: "Request body must be a non-empty array" });
        }

        let processedCount = 0;

        for (let insightData of insights) {
            try {
                await Insight.findOneAndUpdate(
                    { _id: insightData._id },  // find by _id
                    { $set: insightData },     // overwrite all fields
                    { upsert: true }           // insert if not exists
                );
                processedCount++;
            } catch (err) {
                console.error("Error processing insight:", err);
            }
        }

        res.json({
            message: "Bulk insert/update completed",
            processedCount,
            totalReceived: insights.length,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


/**
 * GET /api/insights/missing/:maxNumber
 * Checks which problem numbers between 1 and maxNumber are missing in the database
 */
router.get("/missing/:maxNumber", async (req, res) => {
    try {
        const maxNumber = parseInt(req.params.maxNumber);
        if (isNaN(maxNumber) || maxNumber <= 0) {
            return res.status(400).json({ error: "Invalid number parameter" });
        }

        // Get all existing problem numbers up to maxNumber
        const existingInsights = await Insight.find(
            { problemNo: { $gte: 1, $lte: maxNumber } },
            { problemNo: 1, _id: 0 }
        );

        const existingNumbersSet = new Set(existingInsights.map(i => i.problemNo));

        // Loop from 1 to maxNumber to find missing ones
        const missingNumbers = [];
        for (let i = 1; i <= maxNumber; i++) {
            if (!existingNumbersSet.has(i)) {
                missingNumbers.push(i);
            }
        }

        res.json({
            maxNumber,
            missingNumbers,
            missingCount: missingNumbers.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * GET /api/insights/:problemSlug
 * Returns insight data for a given LeetCode problem slug
 */
router.get("/:problemSlug", async (req, res) => {
    try {
        const { problemSlug } = req.params;

        const insight = await Insight.findById(problemSlug);

        if (!insight) {
            return res.status(404).json({ error: "Insight not found" });
        }

        res.json(insight);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;

/*



[
  {
    "_id": "two-sum",
    "pc": "function twoSum(nums, target):\n    map = empty hash map\n    for i from 0 to length(nums) - 1:\n        complement = target - nums[i]\n        if map contains complement:\n            return [map[complement], i]\n        map[nums[i]] = i",
    "concept": "Hashing for constant-time lookup\nSingle-pass array optimization",
    "pre": "Arrays\nHash Maps",
    "uc": "Finding two transactions that sum to a given amount\nMatching complementary values in recommendation systems"
  },
  {
    "_id": "add-two-numbers",
    "pc": "function addTwoNumbers(l1, l2):\n    dummy = new ListNode(0)\n    current = dummy\n    carry = 0\n    while l1 is not null or l2 is not null or carry != 0:\n        sum = carry\n        if l1 is not null:\n            sum = sum + l1.val\n            l1 = l1.next\n        if l2 is not null:\n            sum = sum + l2.val\n            l2 = l2.next\n        carry = sum / 10\n        current.next = new ListNode(sum % 10)\n        current = current.next\n    return dummy.next",
    "concept": "Linked list traversal with carry handling\nSimulation of elementary addition",
    "pre": "Linked Lists\nBasic Math",
    "uc": "Adding large numbers beyond primitive data type limits\nImplementing arbitrary-precision arithmetic systems"
  }
]


*/


/*
prompt





[
  {
    "_id": "two-sum",
    "problemNo": 1,
    "pc": "function twoSum(nums, target):\n    map = empty hash map\n    for i from 0 to length(nums) - 1:\n        complement = target - nums[i]\n        if map contains complement:\n            return [map[complement], i]\n        map[nums[i]] = i",
    "concept": "Uses a hash map to store previously seen elements, enabling constant-time lookup for the required complement. This approach transforms a naive quadratic search into a linear-time single-pass algorithm by trading space for time.",
    "pre": "Arrays\nHash Maps",
    "uc": "Commonly used in financial systems to quickly identify two transactions whose amounts sum to a target value. Also appears in recommendation and matching systems where pairs must satisfy a numerical constraint efficiently."
  },
  {
    "_id": "add-two-numbers",
    "problemNo": 2,
    "pc": "function addTwoNumbers(l1, l2):\n    dummy = new ListNode(0)\n    current = dummy\n    carry = 0\n    while l1 != null or l2 != null or carry != 0:\n        sum = carry\n        if l1 != null:\n            sum += l1.val\n            l1 = l1.next\n        if l2 != null:\n            sum += l2.val\n            l2 = l2.next\n        carry = sum / 10\n        current.next = new ListNode(sum % 10)\n        current = current.next\n    return dummy.next",
    "concept": "Traverses two linked lists simultaneously while simulating manual digit-by-digit addition with carry propagation. This technique avoids converting the numbers into built-in numeric types, making it suitable for arbitrarily large values.",
    "pre": "Linked Lists\nBasic Math",
    "uc": "Used in systems that require arbitrary-precision arithmetic, such as cryptographic or scientific computation engines. It also models how big-number addition is handled internally in languages or libraries that support unlimited integer sizes."
  }
]



in an array
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


following this schema, 
_id is the problemSlug string (unique)
problemNo: is the number of the problem, like the leetcode id of the problem, like two sum is leetcode problem number 1
https://leetcode.com/problems/contains-duplicate/ suppose this the link
const problemSlug = url.split("/problems/")[1].split("/")[0];  use this logic
pc is the psuedo code of the most optimal approach, make sure to write actual psuedo code of the optimal approach and "not" just instructions, which includes tab indent and next line, which can be shown as code on a front end
concept is dsa concept this problem teaches, detailed, 2 lines max of 20 words
pre are the dsa patterns data structures algorithms prerequisites one should know before trying to solve this problem 2 lines max
uc is the real world use case of the given problem, like a situation where this dsa leetcode problem can be useful, detailed 2 lines max of 20 words
concept and uc should be detailed 2 lines of like 20 words
send me in json format  

generate data for these problems
like the above mentioned way








Give me the json data for all 50 of these, in one go, 50 exactly the ones i mentioned in one go please please please please please

*/




/*



You are generating data for a MongoDB collection using the following schema.

Rules are STRICT. If any rule cannot be satisfied, DO NOT generate output.

Schema fields:
- _id: problemSlug (string, unique, extracted from LeetCode URL)
- problemNo: LeetCode problem number (integer)
- pc: executable-grade pseudocode of the MOST OPTIMAL solution
- concept: what DSA concept this problem teaches (max 2 lines, ~20 words total)
- pre: prerequisites (DSA topics) needed before solving (max 2 lines)
- uc: real-world use case of this problem (max 2 lines, ~20 words total)

STRICT RULES FOR pc FIELD:
1. Must be REAL pseudocode, not instructions or summaries.
2. Must declare data structures explicitly (arrays, maps, stacks, etc.).
3. Must include control flow (loops, conditionals).
4. Must be line-by-line translatable to C++.
5. Must use proper indentation and newlines.
6. Must NOT contain English-only sentences like “do BFS” or “sort by”.
7. Must represent the most optimal time complexity solution.

STRICT RULES FOR OUTPUT:
- Output must be valid JSON only.
- Output must be an array of exactly N objects (N will be specified).
- No explanations, no markdown, no extra text.
- Each object must strictly follow the schema.

SELF-CHECK BEFORE OUTPUT:
Before generating the final JSON, verify internally that:
- Each pc block could be coded in C++ without inventing logic.
- concept, pre, and uc obey length limits.
- The count of problems is exactly N.

Now generate JSON data for the following EXACT problems:
[PASTE 25 PROBLEM SLUGS + PROBLEM NUMBERS HERE]



*/