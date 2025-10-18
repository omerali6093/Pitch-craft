// app.js

import { GoogleGenAI } from 'https://esm.run/@google/genai';


const SUPABASE_URL = "https://eemagvauvidoqtzupiiz.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbWFndmF1dmlkb3F0enVwaWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODc2ODIsImV4cCI6MjA3NjM2MzY4Mn0.AMl3hItaUXl6nsecv3r8mljrlt79Bf-RU0aNAxW5XCI";

//  Gemini API Key 
const GEMINI_API_KEY = "AIzaSyCBzAAi3RxfejgBN7LNePCNVwGvMtdlcGM"; 


// Supabase Setup
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Gemini Setup
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash"; 


// DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const formContainer = document.getElementById("form-container");
const mainContainer = document.getElementById("main-content");
const launching = document.getElementById("launching");
const startupSection = document.getElementById("startup-section");
const logOut = document.getElementById("logout");

// Startup Idea Generation Elements
const keywordInput = document.getElementById('keyword-input');
const generateIdeaBtn = document.getElementById('generate-idea-btn');
const startupIdeaCard = document.getElementById('startup-idea-card');
const loadingSpinner = document.getElementById('loading-spinner');
const startupName = document.getElementById('startup-name');
const startupTagline = document.getElementById('startup-tagline');
const startupPitch = document.getElementById('startup-pitch');
const startupAudience = document.getElementById('startup-audience');
const generateLandingPageBtn = document.getElementById('generate-landing-page-btn');
const landingPagePreviewSection = document.getElementById('landing-page-preview-section');
const previewName = document.getElementById('preview-name');
const previewTagline = document.getElementById('preview-tagline');
const previewCallToActionText = document.getElementById('preview-call-to-action-text');


// Helper function to check auth state on load
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        formContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
    } else {
        formContainer.classList.remove("hidden");
        mainContainer.classList.add("hidden");
        startupSection.classList.add("hidden");
    }
}

// Initial check
checkAuth();


// --- Supabase Authentication Handlers ---

signupBtn.addEventListener("click", async ()=> {
   const {data , error} = await supabase.auth.signUp(
    {
        email: emailInput.value,
        password: passwordInput.value
    }
   )

   if(error) {
    alert(error.message)
    console.log(error);
    return;
   }

   alert("Successfully registered. Please check your email for confirmation.")
   console.log(data)
    
});


loginBtn.addEventListener("click", async () => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value
    })

    if(error) {
        alert(error.message)
        console.error(error);     
        return;     
    }

    if(data.user) {
        formContainer.classList.add("hidden");
        mainContainer.classList.remove("hidden");
        alert("Successfully logged in");
        console.log(data);
    }
})

launching.addEventListener("click", async(e) =>{
    e.preventDefault();
    mainContainer.classList.add("hidden");
    startupSection.classList.remove("hidden");
})

logOut.addEventListener("click", async()=>{
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout Error:", error);
        alert("Logout failed. Please try again.");
        return;
    }
    formContainer.classList.remove("hidden");
    startupSection.classList.add("hidden");
    emailInput.value = "";
    passwordInput.value = "";
    alert("Logged out successfully");
})


// --- Gemini API Idea Generation Logic ---

/**
 * Parses the model's text response into a structured JSON object.
 * @param {string} text - The raw text response from the Gemini model.
 * @returns {object|null} The parsed startup idea object or null on failure.
 */
// function parseGeminiResponse(text) {
//     try {
//         // Find the start and end of the JSON object in the text
//         const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
//         if (jsonMatch && jsonMatch[1]) {
//             return JSON.parse(jsonMatch[1]);
//         }
//         // Fallback for direct JSON output
//         return JSON.parse(text.trim());
//     } catch (e) {
//         console.error("Error parsing Gemini response:", e);
//         return null;
//     }
// }

// 💡 Main Idea Generation Handler
generateIdeaBtn.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim();
    if (!keyword) {
        alert("Please enter a keyword to generate a startup idea.");
        return;
    }

    loadingSpinner.classList.remove('hidden');
    startupIdeaCard.classList.add('hidden');
    landingPagePreviewSection.classList.add('hidden'); // Hide preview on new generation

    const prompt = `Generate a compelling startup idea based on the keyword: "${keyword}".
    The response MUST be a single JSON object (with no other text outside the JSON block) following this structure:
    {
      "name": "The unique name of the startup (1-3 words)",
      "tagline": "A short, catchy tagline (around 10 words)",
      "pitch": "A compelling 1-2 sentence elevator pitch.",
      "audience": "The specific target audience for this startup (e.g., Small business owners, Remote workers, Tech enthusiasts)",
      "cta_text": "A short, engaging call-to-action text for a landing page (e.g., Join the waitlist, Get started now, See a demo)"
    }`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        tagline: { type: "string" },
                        pitch: { type: "string" },
                        audience: { type: "string" },
                        cta_text: { type: "string" }
                    },
                    required: ["name", "tagline", "pitch", "audience", "cta_text"]
                }
            }
        });

        const idea = JSON.parse(response.text);

        if (idea && idea.name) {
            // Update the Idea Card
            startupName.textContent = idea.name;
            startupTagline.textContent = idea.tagline;
            startupPitch.textContent = idea.pitch;
            startupAudience.textContent = idea.audience;
            startupIdeaCard.classList.remove('hidden');

            // Store the idea data globally or on the button for later use
            generateLandingPageBtn.dataset.idea = JSON.stringify(idea);
        } else {
            alert("Could not generate a valid startup idea. Please try a different keyword.");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        alert("An error occurred while generating the idea. Check your API key and console.");
    } finally {
        loadingSpinner.classList.add('hidden');
    }
});


// 📄 Landing Page Generation Handler (Uses existing generated idea)
generateLandingPageBtn.addEventListener('click', () => {
    const ideaData = generateLandingPageBtn.dataset.idea;

    if (!ideaData) {
        alert("Please generate a startup idea first.");
        return;
    }

    try {
        const idea = JSON.parse(ideaData);

        // Update the Preview Section
        previewName.textContent = idea.name;
        previewTagline.textContent = idea.tagline;
        previewCallToActionText.textContent = idea.cta_text;

        landingPagePreviewSection.classList.remove('hidden');

    } catch (e) {
        console.error("Error setting up landing page preview:", e);
        alert("Error showing landing page preview.");
    }
});