🏝️ Pulse Miami Hackathon
Bridging the Gap from Therapy to Functionality
Intellectual disability (ID) affects millions of individuals, manifesting as challenges in verbal comprehension, working memory, and processing speed. In a world of increasing complexity, those with an IQ below 70 often face significant barriers to daily independence. The goal of this hackathon is not to "fix" ID, but rather to improve function. 
We are building a tool that translates a complex therapeutic world into simple, implementable, and repeatable actions that promote learning.
🚨 The Problem
Individuals with intellectual disability (ID) experience significantly higher rates of depression and anxiety than the general population. While adapted cognitive behavioral therapy (CBT) is the established intervention, outcomes vary because therapy assumes skills learned in-session will be independently practiced and retrieved during real-world distress. For those with ID, working memory limitations and difficulty with abstraction create a critical "between-session gap" where skills are learned but do not consistently transfer or endure in day to day life.
🎯 The Challenge: The Skill Reinforcer
Your mission is to design a technology-based reinforcement platform that strengthens the learning processes necessary for successfully practicing therapy skills outside of therapy sessions. 
You must promote:
Encoding: Clear initial learning of therapy skills.
i.e. Does the patient understand what the main therapy concept is and how it is relevant to your presenting problem?
Abstraction: Recognition of similar circumstances in which skills can be used. 
For example: The patient just learned the skill of self-advocacy-oriented communication. Now, can they recognize that this skill would not only be relevant to advocacy in a medical setting, but also in a vocational setting or social setting? 
Retrieval & Application: Remembering and using relevant skills
When the relevant situation presents itself in your real life, do you remember you learned a skill for this? Do you actually apply it successfully to improve the outcome? 
Tip: Use AI to better understand CBT (cognitive behavioral therapy) skills and build your application around them.
👤 User Profile: The Resilient Learner
Your users are adolescents and adults with mild to moderate intellectual disabilities who are also managing comorbid depression or anxiety while receiving adapted CBT. These users face:
Limited Working Memory: Difficulty holding multi-step instructions.
Concrete Thinking: Challenges with abstract concepts; they need simple, implementable instructions.
Processing Delays: Often need information repeated or delivered at a slower pace.
🛠️ Required Platforms
Participants must build a functional prototype addressing two perspectives:
1. Client-Facing Tool - Required
Interactive Practice: Micro-practice sessions for CBT skills.
Supportive UI: Simple, predictable interface with visual and audio supports.
Engagement: Prompt positive reinforcement and gamified elements to encourage habituation.
Safety: Built-in coping breaks and regulation tools (e.g., guided breathing).
2. Therapist-Facing Dashboard - Bonus
Customization: Ability to assign specific modules and adjust difficulty.
Tracking: Visualization of skill mastery and identification of where learning breaks down.
Continuity: Seamless linkage between in-session content and home practice.
🤲 Key Requirements: Accessible by Design
Reading Level: All text must be at or below a 6th-grade reading level.
Multilingual: Bonus points for support in both English and Spanish for the Miami community.
Design Principles: Prioritize concrete over abstract, repetition over novelty, and reinforcement over punishment.
🏆 Judging Criteria
Function Over Condition: Does the tool solve the practical problem of skill transfer rather than just teaching abstract concepts?
Cognitive Accessibility: How well does the UI accommodate users with visual-spatial or working memory challenges?
Smart Use of AI: Is AI meaningfully simplifying complex therapeutic skills into "block-design" style instructions?
Self-Efficacy: Does the tool provide the rewards and reinforcement necessary to build user confidence?
🛠️ Suggested Tech Stack
Reasoning (Simplification): Gemini 1.5 Flash. Use its long context window to ingest therapy manuals and output simplified, step-by-step practice modules.
Orchestration: LangGraph. Build state machines to track a user’s "Skill Mastery" and ensure the AI doesn't advance until encoding is confirmed.
Frontend: Vercel AI SDK. Use streaming to provide immediate visual feedback, showing the user the AI is "listening" to their needs.
