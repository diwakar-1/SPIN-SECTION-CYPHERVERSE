document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const teamNameInput = document.getElementById('team-name');
    const teamNumberInput = document.getElementById('team-number');
    const categorySelect = document.getElementById('category');
    const generateBtn = document.getElementById('generate-btn');
    const errorMessage = document.getElementById('error-message');

    const configPanel = document.getElementById('config-panel');
    const resultsArea = document.getElementById('results-area');
    const displayTeamName = document.getElementById('display-team-name');
    const cardsContainer = document.getElementById('cards-container');
    const actionFooter = document.getElementById('action-footer');

    const respinBtn = document.getElementById('respin-btn');
    const respinBtnText = document.getElementById('respin-btn-text');
    const confirmBtn = document.getElementById('confirm-btn');

    const successModal = document.getElementById('success-modal');
    const lockedTeam = document.getElementById('locked-team');
    const lockedTeamNumber = document.getElementById('locked-team-number');
    const lockedDomain = document.getElementById('locked-domain');
    const lockedProblem = document.getElementById('locked-problem');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const finalizeBtn = document.getElementById('finalize-btn');

    // Loading Screen DOM Elements
    const spideyLoadingScreen = document.getElementById('spidey-loading-screen');
    const loadingProgressBar = document.getElementById('loading-progress-bar');
    const loadingTargetText = document.getElementById('loading-target-text');
    const loadingStatusQuote = document.getElementById('loading-status-quote');

    // =========================================================================
    // SUPABASE DATABASE CONFIGURATION
    // =========================================================================
    const SUPABASE_URL = "https://ygsuucddqgyvvkhhsitw.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_bVKNCCqCnZGO0j2Q-nm0Lg_zfwxs_6w";

    // Initialize Supabase Client
    const supabaseClient = (window.supabase && SUPABASE_URL && SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL")
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : null;

    // Storage Key (Local cache fallback)
    const STORAGE_KEY = 'cypherverse_locked_teams';

    // State
    let state = {
        teamName: '',
        teamNumber: '',
        category: '',
        selectedCardId: null,
        currentCards: [],
        respinCount: 0,
        maxRespins: 3
    };

    // =========================================================================
    // DATABASE OF EXTRA-CREDIT ADD-ON DIRECTIVES (10 THEMES FROM GUIDE)
    // =========================================================================
    const problemDatabase = {
        // THEME 1: MACHINE LEARNING (ML)
        ml: [
            {
                id: 'ml-1',
                title: 'Client-Side Sentiment Indicator',
                concept: 'Dynamically analyze the sentiment of user input (e.g., product review, chat message, support ticket, blog comment) in real-time.',
                whyFits: 'Every app has user inputs. Adding a real-time sentiment color badge (green for positive, red for negative) makes the UI interactive.',
                implementation: 'Use sentiment or @tensorflow-models/toxicity in JS (no backend needed), or python\'s textblob / nltk.sentiment on the backend.',
                verification: 'Type "I absolutely love this product!" and see a positive/happy emoji or indicator. Type "This is the worst service ever" and see a negative indicator.'
            },
            {
                id: 'ml-2',
                title: 'Image Auto-Tagging',
                concept: 'When a user uploads an image (e.g., profile picture, product image, post cover), automatically generate descriptive tags.',
                whyFits: 'Enhances any user-upload flow with automated metadata.',
                implementation: 'Integrate the free-tier Google Cloud Vision API, Cloudinary Auto-Tagging, or a client-side library like TensorFlow.js with the MobileNet model.',
                verification: 'Upload an image of a dog or a cup. Verify that tags like "dog", "canine", or "coffee cup" are generated and saved as tags or input fields.'
            },
            {
                id: 'ml-3',
                title: 'Smart Search Autocomplete (TF-IDF/Vector-based)',
                concept: 'Go beyond standard exact-substring search. Suggest items from the search database based on semantic relevance or basic term-frequency.',
                whyFits: 'Almost all hackathon apps have a database search bar.',
                implementation: 'Use flexsearch or fuse.js in JavaScript, or scikit-learn\'s TfidfVectorizer / cosine_similarity in Python.',
                verification: 'Search for a synonym or partial query (e.g., searching "cell" should show "mobile phone") and see relevant suggestions rank higher.'
            },
            {
                id: 'ml-4',
                title: 'Lightweight Content-Based Recommender',
                concept: 'Recommend "Similar Items" or "People also liked..." based on tags/features of the current item.',
                whyFits: 'Fits any e-commerce, blogging, event-listing, or social networking platform.',
                implementation: 'Implement basic Cosine Similarity in JavaScript or Python between the feature vectors of database items.',
                verification: 'Open a specific product or post. See a section at the bottom showing 3-5 recommended items that share similar tags or descriptions.'
            },
            {
                id: 'ml-5',
                title: 'Automated TL;DR / Text Summarizer',
                concept: 'Add a "TL;DR" button next to long articles, product descriptions, or user forum posts to generate a one-sentence summary.',
                whyFits: 'Helps users quickly digest long pieces of text.',
                implementation: 'Use a free API endpoint (e.g., Hugging Face Inference API with a model like facebook/bart-large-cnn) or a simple extractive algorithm.',
                verification: 'Paste a 300-word article, click "Summarize", and verify a short, coherent 1-2 sentence summary is generated instantly.'
            },
            {
                id: 'ml-6',
                title: 'Client-Side Webcam Object Detection',
                concept: 'Feed a webcam video stream through a real-time object detector to identify items or gestures.',
                whyFits: 'Great for interactive check-ins, security screens, or visual shopping apps.',
                implementation: 'Embed TensorFlow.js loaded with the coco-ssd model.',
                verification: 'Point the webcam at a cell phone, book, or person, and see bounding boxes labeled with the detected object and confidence score.'
            },
            {
                id: 'ml-7',
                title: 'Form Autofill/Predictor',
                concept: 'Predict remaining form fields based on the first few inputs using a trained lightweight classifier.',
                whyFits: 'Saves user effort in filling onboarding or data entry forms.',
                implementation: 'Train a simple logistic regression or decision tree model locally (e.g., with scikit-learn in Python or simple-statistics in JS) on mock historic data.',
                verification: 'Select a user role or age bracket, and watch other options (like default category or tier) pre-populate based on probability.'
            },
            {
                id: 'ml-8',
                title: 'Spam & Phishing Comment Filter',
                concept: 'Automatically flag or hide user comments, reviews, or messages that contain spammy patterns or malicious links.',
                whyFits: 'Crucial for any platform that supports user-generated content.',
                implementation: 'Implement a basic Multinomial Naive Bayes classifier (using natural package in Node or scikit-learn in Python) trained on a small spam dataset.',
                verification: 'Type "Get cheap crypto now at shady-link.com!!!" and verify the post is flagged as spam or rejected.'
            },
            {
                id: 'ml-9',
                title: 'Voice-Activated Command Interface',
                concept: 'Allow users to navigate the app or trigger actions (e.g., "Add to Cart", "Go to Profile") using voice commands.',
                whyFits: 'Adds accessibility and hands-free capability to any UI.',
                implementation: 'Use the browser\'s native Web Speech API (SpeechRecognition interface) combined with a simple string matching layout.',
                verification: 'Say "dark mode" or "open cart" and watch the interface theme toggle or open the cart modal.'
            },
            {
                id: 'ml-10',
                title: 'Smart Value/Price Predictor',
                concept: 'Predict a value (e.g., estimate shipping costs, calculate house rental value, predict score) based on a few user-supplied variables.',
                whyFits: 'Fits dashboards, calculators, or marketplaces.',
                implementation: 'Use a multiple linear regression model built using Python\'s scikit-learn or JavaScript\'s ml-regression-multivariate-linear.',
                verification: 'Change input sliders (e.g., size, age, quantity) and verify the estimated value changes logically according to the model\'s coefficients.'
            },
            {
                id: 'ml-11',
                title: 'Language Detection & Dynamic Translation',
                concept: 'Detect the language of a text input and automatically display a translation button.',
                whyFits: 'Expands target audience reach and makes chat/forums globally accessible.',
                implementation: 'Use a lightweight library like languagedetect in Node/Python or a free translation API (like LibreTranslate).',
                verification: 'Enter "Bonjour, comment ça va?" and see the system output "Language: French" with a translated English overlay.'
            },
            {
                id: 'ml-12',
                title: 'Audio Pitch & Visualizer Overlay',
                concept: 'Capture microphone audio and show a live visualization plus dominant frequency/pitch values.',
                whyFits: 'Suitable for music, audio recording, games, or wellness apps.',
                implementation: 'Use the browser\'s AudioContext and AnalyserNode to capture frequency data, combined with a Canvas element for drawing.',
                verification: 'Hum or speak into the microphone and watch the frequencies bounce, displaying the estimated pitch note (e.g., A4, C5).'
            },
            {
                id: 'ml-13',
                title: 'Dynamic UI Theme Personalization',
                concept: 'Learn user preferences based on clicks/actions and dynamically rearrange elements.',
                whyFits: 'Demonstrates ML-based UX customization.',
                implementation: 'Implement a simple multi-armed bandit algorithm or weight system that shifts the positions of dashboard widgets based on click counts.',
                verification: 'Click on the "Analytics" tab 5 times, and verify it moves to the top/primary position on the next refresh.'
            },
            {
                id: 'ml-14',
                title: 'OCR Document/Receipt Parser',
                concept: 'Allow users to upload a document/receipt/image and automatically extract its textual details.',
                whyFits: 'Great for finance apps (receipt parser), identity portals (ID card parser), or note apps.',
                implementation: 'Integrate tesseract.js directly in the browser or use a Python backend with pytesseract.',
                verification: 'Upload an image of a simple receipt, and see the extracted total and date populated into form fields.'
            },
            {
                id: 'ml-15',
                title: 'User Churn Risk Indicator',
                concept: 'On an admin dashboard, show the probability of a user deleting their account or becoming inactive.',
                whyFits: 'B2B or SaaS applications benefit heavily from retention indicators.',
                implementation: 'Create a mock heuristic or run a simple logistic regression using features like days_since_last_login and features_used_count.',
                verification: 'View the user dashboard list. Users who haven\'t logged in for 10 days should display a high churn warning indicator.'
            },
            {
                id: 'ml-16',
                title: 'Smart Color Palette Generator from Image',
                concept: 'Extract the dominant color palette from an uploaded image to dynamically style the app\'s background or user card.',
                whyFits: 'Makes dynamic styling easy and visually stunning.',
                implementation: 'Use the colorthief library in JavaScript or kmeans clustering on image pixels in Python.',
                verification: 'Upload a sunset image. Verify the page\'s accent colors or theme automatically updates to warm orange and purple hues.'
            }
        ],

        // THEME 2: CYBERSECURITY (CYBER)
        cybersecurity: [
            {
                id: 'cyber-1',
                title: 'Two-Factor Authentication (2FA) with TOTP',
                concept: 'Allow users to enable 2FA on their accounts using standard authenticator apps (Google Authenticator, Authy).',
                whyFits: 'Any application with user signup needs secure authentication.',
                implementation: 'Use otplib or speakeasy in Node.js, or pyotp in Python to generate QR codes and verify 6-digit tokens.',
                verification: 'Scan the QR code using your phone\'s Authenticator app, type the 6-digit code, and check if login succeeds only with a valid code.'
            },
            {
                id: 'cyber-2',
                title: 'Password Strength Meter & Real-time Policy Enforcer',
                concept: 'Rate the strength of the user\'s password during signup/change using entropy analysis rather than simple length checks.',
                whyFits: 'Enhances the user registration experience and stops weak credentials.',
                implementation: 'Integrate the zxcvbn library on the frontend to get real-time feedback (score 0-4) and estimated crack times.',
                verification: 'Type "password123" (should show Weak/Unsafe warning). Type "Correct-Horse-Battery-Staple-2026!" (should show Strong/Safe).'
            },
            {
                id: 'cyber-3',
                title: 'API Rate Limiter (Brute-Force Protection)',
                concept: 'Protect critical endpoints (like /login, /register, /api/pay) from automated brute-force attacks.',
                whyFits: 'Protects the server from DDoS and credential stuffing.',
                implementation: 'Use express-rate-limit in Node, flask-limiter in Python, or an in-memory/Redis sliding window middleware.',
                verification: 'Write a quick script or click "Submit" rapidly 10+ times. Verify the server returns a 429 Too Many Requests status code.'
            },
            {
                id: 'cyber-4',
                title: 'Secure Session Management & Automated Timeout',
                concept: 'Automatically log out users after a period of inactivity, keeping sessions secure on public devices.',
                whyFits: 'Crucial for privacy and compliance.',
                implementation: 'Implement a frontend inactivity timer that triggers session destruction and redirects to /login after X minutes of no mouse/keyboard activity.',
                verification: 'Set the timeout to 10 seconds for demo purposes. Stop interacting with the page and verify that a warning appears, followed by automatic logout.'
            },
            {
                id: 'cyber-5',
                title: 'HTTP Security Headers (Helmet/CSP)',
                concept: 'Secure the application from Cross-Site Scripting (XSS), clickjacking, and mime-sniffing by sending secure HTTP headers.',
                whyFits: 'Essential configuration for any server-rendered or API-driven app.',
                implementation: 'Add the helmet package in Node/Express, or configure security middleware in Django/Flask. Set up a basic Content Security Policy (CSP).',
                verification: 'Inspect the network tab on load or run curl -I http://localhost:port and verify headers like Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security are present.'
            },
            {
                id: 'cyber-6',
                title: 'Role-Based Access Control (RBAC) Guard',
                concept: 'Define multiple user roles (Admin, Manager, Customer) and enforce access restrictions on pages and API endpoints.',
                whyFits: 'Most applications have distinct user roles or admin dashboards.',
                implementation: 'Write a basic middleware that checks user JWT scopes or DB role flags before serving restricted API paths.',
                verification: 'Log in as a "Customer" and attempt to access /api/admin/dashboard - verify it returns a 403 Forbidden response.'
            },
            {
                id: 'cyber-7',
                title: 'Tamper-Evident Audit Log',
                concept: 'Create an immutable system log that records sensitive user actions (such as email changes, logins, billing updates) including IP and User Agent.',
                whyFits: 'Vital for tracking down suspicious user activity.',
                implementation: 'Create an audit_logs DB table that is append-only (users cannot update or delete entries).',
                verification: 'Change your password in the app. Go to the DB or Admin panel and verify an entry is created recording the action, old/new hash indicator, IP, and time.'
            },
            {
                id: 'cyber-8',
                title: 'Sensitive Data Masking/Obfuscation',
                concept: 'Mask personal information (social security, credit cards, emails, phone numbers) on screen and in logs unless authorized.',
                whyFits: 'Prevents shoulder surfing and accidental exposure in application logs.',
                implementation: 'Write a simple utility function in JavaScript or Python to regex-replace parts of strings (e.g., xxxx-xxxx-xxxx-1234).',
                verification: 'View the profile settings page. The phone number should display as +1 (xxx) xxx-9999 until a "Reveal" button is clicked.'
            },
            {
                id: 'cyber-9',
                title: 'Secure Cookie Flag Configurations',
                concept: 'Prevent session token theft by configuring session cookies with secure browser flags.',
                whyFits: 'Best practice for storing auth tokens/JWTs.',
                implementation: 'Set your session cookies to be HttpOnly (stops JS access), Secure (HTTPS only), and SameSite=Strict (prevents CSRF).',
                verification: 'Open browser DevTools -> Application -> Cookies. Verify that the checkmarks for HttpOnly and Secure are active for the session identifier cookie.'
            },
            {
                id: 'cyber-10',
                title: 'Malicious File Upload Scanner (Mime/Magic Bytes)',
                concept: 'Reject file uploads that masquerade as safe extensions (e.g., uploading an executable file renamed to .png).',
                whyFits: 'Critical if users can upload profile pictures, documents, or attachments.',
                implementation: 'Use a library like file-type in JS or python-magic to check the actual byte signature (magic number) of files rather than trusting the extension.',
                verification: 'Rename a .txt file to .png and attempt to upload it. The app should reject the upload with an "Invalid File Type" error.'
            },
            {
                id: 'cyber-11',
                title: 'CAPTCHA Bot Mitigation',
                concept: 'Stop automated bots from submitting forms (contact forms, newsletter signups, password resets).',
                whyFits: 'Prevents spam registrations and resource exhaustion.',
                implementation: 'Integrate Cloudflare Turnstile or Google reCAPTCHA v3.',
                verification: 'Attempt to submit the form without solving the challenge (if manual) or show the token payload verification on the backend code.'
            },
            {
                id: 'cyber-12',
                title: 'Have I Been Pwned? Password Check',
                concept: 'During signup, check if the password the user chose has been exposed in public breaches.',
                whyFits: 'Prevents users from reusing compromised passwords.',
                implementation: 'Make a secure K-anonymity API query to the free Have I Been Pwned API (sending only the first 5 characters of the SHA-1 hash of the password).',
                verification: 'Try to register with password123. Verify the app says "This password has been seen in X leaks, please choose a different one."'
            },
            {
                id: 'cyber-13',
                title: 'IP Geo-Fencing / Anomalous Login Alert',
                concept: 'Alert the user or trigger a verification step if they log in from a new geographic location or device.',
                whyFits: 'Standard security measure for web applications.',
                implementation: 'Use a free IP geolocator API (like ip-api.com) to check the login country/region and compare it against the user\'s last recorded login.',
                verification: 'Mock a different IP address in the request header (e.g., X-Forwarded-For: 8.8.8.8). Check if the console/dashboard flags a "New location detected" alert.'
            },
            {
                id: 'cyber-14',
                title: 'Content Security Policy (CSP) Reporting Endpoint',
                concept: 'Capture and log CSP violations that occur on client browsers to spot potential XSS attacks in the wild.',
                whyFits: 'Gives the admin visibility into front-end script injection attempts.',
                implementation: 'Add the report-uri directive to the Content-Security-Policy header pointing to a /api/csp-report endpoint that writes to logs.',
                verification: 'Attempt to inject an inline <script> tag using the browser console, and verify the backend logs a CSP violation report.'
            },
            {
                id: 'cyber-15',
                title: 'Scoped API Token Expiry & Revocation',
                concept: 'If your app provides APIs, allow users to generate key tokens that have specific scopes and automatic expiration dates.',
                whyFits: 'Good for B2B dashboards or external integration features.',
                implementation: 'Create an api_keys table with columns: key_hash, scopes (e.g., ["read:profile"]), expires_at, and revoked (boolean).',
                verification: 'Generate a token, verify it works. Click "Revoke" on the UI, and verify subsequent API requests with that token fail immediately with a 401 Unauthorized response.'
            }
        ],

        // THEME 3: CHATBOTS AND AI
        chatbots_ai: [
            {
                id: 'chat-1',
                title: 'Smart FAQ Chatbot with Static Fallback',
                concept: 'A chat widget on the corner of the app that answers common questions using local patterns, reverting to an LLM or support form if unanswered.',
                whyFits: 'Every site (e-commerce, SaaS, portfolio) needs a customer support widget.',
                implementation: 'Create a static JSON dictionary of key-value Q&As. Check user input using fuzzy text matching (e.g., string-similarity or fuse.js).',
                verification: 'Ask "how do I refund my order?". Watch it fetch the correct step-by-step instructions. Type gibberish like "xyz123" and watch it offer to route to a live human.'
            },
            {
                id: 'chat-2',
                title: 'LLM-Based Search Query Expansion',
                concept: 'When searching the database, use an LLM API to clean, expand, or translate the query (e.g., converting "warm clothes" to "sweater, jacket, wool coat").',
                whyFits: 'Makes basic database search smart and semantically aware.',
                implementation: 'Before running the SQL/NoSQL query, send the input to a free-tier LLM API (like Google Gemini API or OpenAI API) with a system prompt: "Generate 5 search synonyms for: [input]".',
                verification: 'Search for "sleepy stuff" in a store. Verify that the app shows results for "pillows, mattresses, eye masks".'
            },
            {
                id: 'chat-3',
                title: 'Context-Aware Chatbot with Message History',
                concept: 'A chatbot interface that remembers what the user said in previous turns rather than treating each message as a single query.',
                whyFits: 'Improves user onboarding, feedback, or assistant flows.',
                implementation: 'Maintain an array of the last 6 messages ([{role: \'user\', content: \'...\'}, {role: \'model\', content: \'...\'}]) in browser local storage or session state and pass it in subsequent API requests.',
                verification: 'Say "My name is John". In the next message, ask "What is my name?". The chatbot should correctly reply "John".'
            },
            {
                id: 'chat-4',
                title: 'Dynamic Sentiment-Based Chatbot Persona',
                concept: 'The chatbot detects user emotion and alters its styling/tone (e.g., switching from friendly to formal/apologetic if the user is angry).',
                whyFits: 'Greatly improves customer service dashboards and user interactions.',
                implementation: 'Run a local sentiment script on the user\'s message. If sentiment is negative, pass a system prompt to the LLM: "The user is upset. Be extremely polite, apologetic, and concise."',
                verification: 'Type "Your website is broken, this is terrible!". Verify the chatbot replies with an apologetic tone and the chat window header changes color to a subtle warning/support color.'
            },
            {
                id: 'chat-5',
                title: 'AI-Powered Writing/Reply Assistant',
                concept: 'Add a "Draft Reply" or "Improve Writing" button to textareas where users compose content (emails, comments, profile bios).',
                whyFits: 'Enhances content-creation features.',
                implementation: 'Add a dropdown with options: "Professional", "Casual", "Shorten". Send the current text area value + selected option to an LLM API.',
                verification: 'Type "yeah ok i will send it tomorrow" in the text box, select "Professional", click the button, and watch it rewrite to: "Sure, I will send the requested document by tomorrow."'
            },
            {
                id: 'chat-6',
                title: 'Interactive Text-to-Speech (TTS) Reader',
                concept: 'Allow users to click a "Listen" icon next to any text content (articles, product cards, messages) to hear it read aloud.',
                whyFits: 'Enhances accessibility.',
                implementation: 'Use the browser\'s built-in SpeechSynthesis API. No external API keys or server components required.',
                verification: 'Click the speaker button and verify the browser reads the text aloud, highlighting the words or changing the speaker icon to a "playing" animation.'
            },
            {
                id: 'chat-7',
                title: 'Voice-to-Text Speech Dictation',
                concept: 'Allow users to dictate text fields, search queries, or chat messages instead of typing them.',
                whyFits: 'Speeds up form entry on mobile-responsive layouts.',
                implementation: 'Integrate the browser\'s SpeechRecognition API.',
                verification: 'Click the microphone icon, say "T-shirts under twenty dollars", and watch the words populate the search bar automatically.'
            },
            {
                id: 'chat-8',
                title: 'AI-Powered Dynamic Quiz/Flashcard Generator',
                concept: 'Generate flashcards, multiple-choice questions, or study guides dynamically from a body of text.',
                whyFits: 'Fits educational platforms, blog sites, or onboarding portals.',
                implementation: 'Send the article text to an LLM asking for a JSON output containing a list of questions, options, and correct answers. Parse the JSON and render a dynamic card quiz.',
                verification: 'Paste a text description of photosynthesis, click "Generate Quiz", and play through the 3 generated multiple-choice questions.'
            },
            {
                id: 'chat-9',
                title: 'AI Feedback/Comment Auto-Categorization',
                concept: 'Automatically label and route incoming user feedback into specific category folders (e.g., Bug, Feature Request, Billing, Spam) using LLM zero-shot classification.',
                whyFits: 'Standard operations enhancement for admin dashboards.',
                implementation: 'When feedback is submitted, send the text to a lightweight classifier or LLM asking to output exactly one of the defined labels. Save the label in the database.',
                verification: 'Submit feedback: "The payment page keeps freezing when I click submit". View the admin portal and verify it is automatically tagged as "Bug".'
            },
            {
                id: 'chat-10',
                title: 'AI Chatbot UI Typing Indicator & Smooth Message Streaming',
                concept: 'Create a typing indicator (animated three dots) and stream LLM responses word-by-word (Server-Sent Events) rather than waiting for the entire text block to load.',
                whyFits: 'Makes the chatbot feel alive and responsive.',
                implementation: 'Use ReadableStream read cycles on the client fetching from an LLM API that supports stream responses.',
                verification: 'Ask the chatbot a long question. See the response appear smoothly letter-by-letter or word-by-word with a pulsing loading state beforehand.'
            },
            {
                id: 'chat-11',
                title: 'Custom Code/Recipe Explainer',
                concept: 'Add a widget that explains complex steps, formulas, code, or ingredients in simple terms (explain like I\'m 5).',
                whyFits: 'Useful for developer portals, cooking websites, finance estimators, or math calculators.',
                implementation: 'Capture the card\'s data and prompt an LLM: "Explain this step-by-step in extremely simple words for a kid."',
                verification: 'Highlight a block of text/code, click "Explain", and view the simple bulleted explanation in a sidebar.'
            },
            {
                id: 'chat-12',
                title: 'Smart AI-Generated Product Name/Bio Generator',
                concept: 'Help users fill out their profile or product selling listings by generating catchy titles or bios based on a few keywords.',
                whyFits: 'Fits any listing, marketplace, or blogging platform.',
                implementation: 'Add an "AI Suggestions" button next to inputs. Feed keywords to a prompt asking for 3 brief title suggestions.',
                verification: 'Type "leather jacket black vintage", click "Suggest", and see options like "Vintage Black Leather Moto Jacket" populate as options.'
            },
            {
                id: 'chat-13',
                title: 'Interactive Multi-Choice AI Storyteller',
                concept: 'A chatbot that guides users through a scenario (e.g., troubleshooting steps, onboarding options) by offering 3 clickable option cards at the end of each turn.',
                whyFits: 'Excellent for gamified user onboarding or support.',
                implementation: 'Prompt the LLM to structure its output as: {"story": "...", "options": ["Option A", "Option B", "Option C"]}. Parse the response and display buttons.',
                verification: 'Click "Start Setup". Choose "Personal Use", then watch the AI generate a customized next step with 3 new choices.'
            },
            {
                id: 'chat-14',
                title: 'Chatbot Command Shortcut Menu (Slash Commands)',
                concept: 'Trigger specific app shortcuts or quick prompt templates by typing / in the chat window.',
                whyFits: 'Standard power-user feature in modern messaging interfaces.',
                implementation: 'Detect when the first character in the chat input is /, show a floating autocomplete overlay containing items like /clear, /help, /summarize.',
                verification: 'Type / and select /clear from the dropdown. Verify the chat history clears immediately.'
            },
            {
                id: 'chat-15',
                title: 'AI Agent UI Actions (Natural Language Command Execution)',
                concept: 'Allow the user to command the website\'s interface using natural language (e.g., "switch to dark mode", "add 5 shirts to cart").',
                whyFits: 'High-end UX showcase of NLP.',
                implementation: 'Use an LLM or simple keyword parsing to map the user prompt to an internal JS function call (e.g. setDarkMode(true) or addToCart(5)).',
                verification: 'Type "change background to dark" in the chatbot input and watch the application theme toggle instantly.'
            }
        ],

        // THEME 4: BLOCKCHAIN & WEB3
        web3: [
            {
                id: 'web3-1',
                title: 'Web3 Wallet Connection & Header Overlay',
                concept: 'Connect a user\'s browser wallet (MetaMask, Coinbase Wallet) and display their wallet address, active network, and native token balance.',
                whyFits: 'The baseline feature of any Web3-enabled application.',
                implementation: 'Use ethers.js or viem libraries. Detect the window.ethereum provider.',
                verification: 'Click "Connect Wallet" in the header. Authorize MetaMask, and verify the button changes to show a truncated address (e.g., 0x1a2b...3c4d) and your current ETH/MATIC balance.'
            },
            {
                id: 'web3-2',
                title: 'Crypto Micro-Donation / Tip Jar',
                concept: 'A simple tipping button that lets visitors send a small amount of cryptocurrency directly to the creator\'s wallet address.',
                whyFits: 'Fits portfolios, blogs, social networks, or e-commerce apps.',
                implementation: 'Use ethers.js to create a simple transaction object: signer.sendTransaction({ to: tipAddress, value: ethers.parseEther("0.01") }).',
                verification: 'Click "Tip 0.01 ETH". Verify that your browser wallet prompts a transaction window with the correct destination address and amount.'
            },
            {
                id: 'web3-3',
                title: 'Sign-In With Ethereum (SIWE) / Crypto Authentication',
                concept: 'Authenticate a user to a Web2 backend session by proving ownership of their private key (wallet address) rather than asking for a password.',
                whyFits: 'Secure, passwordless authentication option.',
                implementation: 'Request the wallet to sign a custom nonce message on the frontend (personal_sign), and verify the signature on the backend using ethers.verifyMessage.',
                verification: 'Click "Sign In with Wallet", sign the signature request in MetaMask, and verify you are logged in to the dashboard without typing any credentials.'
            },
            {
                id: 'web3-4',
                title: 'Interactive Gas Price Tracker',
                concept: 'Display live transaction cost estimates (Safe Low, Standard, Fast) to help users time their interactions.',
                whyFits: 'Useful widget for any transaction-focused app.',
                implementation: 'Fetch gas price data from a public API (like Etherscan API or gas station endpoints) every 15 seconds.',
                verification: 'View the widget. Verify that the gas numbers update periodically, displaying prices in Gwei.'
            },
            {
                id: 'web3-5',
                title: 'NFT Profile Picture (PFP) Selector',
                concept: 'Allow users to browse their wallet\'s NFTs and set one as their application avatar.',
                whyFits: 'Social networking, forums, or profile-driven apps.',
                implementation: 'Use a free API (like OpenSea API or Alchemy NFT API) to query owned ERC-721/1155 tokens for the connected address.',
                verification: 'Connect a wallet holding NFTs. Verify the profile settings panel displays thumbnails of the NFTs and clicking one updates the profile picture.'
            },
            {
                id: 'web3-6',
                title: 'Transaction State Toast Notifications',
                concept: 'Display rich, animated Toast notifications that follow the lifecycle of a blockchain transaction (Pending, Success, Failed).',
                whyFits: 'Essential for explaining transaction delays to Web2 users.',
                implementation: 'Listen to the transaction hash response: const receipt = await tx.wait(); and update a state-based toast overlay.',
                verification: 'Initiate a transaction. A toast should appear stating "Transaction Pending". Once confirmed in the block, it should change to green with a "Success" message and a block explorer link.'
            },
            {
                id: 'web3-7',
                title: 'Token-Gated Feature Access',
                concept: 'Restrict access to a page, feature, or database resource unless the user\'s connected wallet holds a specific ERC-20 token or NFT.',
                whyFits: 'Good for premium content, private forums, or loyalty reward features.',
                implementation: 'Call the balanceOf(userAddress) method of a smart contract on the blockchain. If the result is greater than 0, grant access.',
                verification: 'Log in with a wallet containing 0 tokens. Try to access the page (verify it says "Access Denied"). Connect a wallet containing the token and verify the page loads.'
            },
            {
                id: 'web3-8',
                title: 'IPFS/Pinata File Storage',
                concept: 'Store user-uploaded files (like images, documents) on a decentralized file system (IPFS) rather than a local server folder.',
                whyFits: 'Showcases decentralized media hosting.',
                implementation: 'Use a service like Pinata or Web3.storage to upload files via their SDK/API, and store the resulting IPFS CID (Hash) in your database.',
                verification: 'Upload a profile photo. Copy the generated link, verify it points to an IPFS gateway (e.g., https://ipfs.io/ipfs/<hash>) and renders the image.'
            },
            {
                id: 'web3-9',
                title: 'Multi-Network Switcher Widget',
                concept: 'Detect if the user is connected to an unsupported network (e.g., Ethereum Mainnet instead of Polygon) and prompt them to automatically switch networks.',
                whyFits: 'Essential for multi-chain support.',
                implementation: 'Use window.ethereum.request({ method: \'wallet_switchEthereumChain\', params: [{ chainId: \'0x89\' }] }).',
                verification: 'Connect to Ethereum Mainnet. Click a button to switch to Polygon. Verify MetaMask pops up asking to switch chains.'
            },
            {
                id: 'web3-10',
                title: 'Read-Only Contract Viewer Dashboard',
                concept: 'Fetch and display public data from a deployed third-party smart contract (like the total supply of a token, or the owner of a contract).',
                whyFits: 'Shows data transparency.',
                implementation: 'Instantiate a read-only provider (e.g., public RPC URL) and use a standard ABI to fetch contract variables.',
                verification: 'View the stats dashboard. Verify it shows the current, live blockchain value of the target contract property.'
            },
            {
                id: 'web3-11',
                title: 'Decentralized ENS Name Resolver',
                concept: 'Allow users to input an ENS name (like nick.eth) in any input field (like recipient email/address) and resolve it to the raw 0x... hex address.',
                whyFits: 'Greatly improves UX in form inputs.',
                implementation: 'Use the built-in ENS lookup method of your Web3 provider: await provider.resolveName("name.eth").',
                verification: 'Type vitalik.eth into a recipient field. Watch the field resolve and show 0xd8da6bf26964af9d7eed9e03e53415d37aa96045 underneath.'
            },
            {
                id: 'web3-12',
                title: 'Smart Contract Event Log Reader',
                concept: 'Stream and display a live feed of events emitted by a specific smart contract in real-time.',
                whyFits: 'Creates interactive live feeds of global activity.',
                implementation: 'Use contract.on("EventName", (args) => { ... }) in ethers.js to push events to a UI notification list.',
                verification: 'Trigger a contract event (or watch a highly active contract like USDC). Verify the UI feeds updates dynamically without refreshing the page.'
            },
            {
                id: 'web3-13',
                title: 'Decentralized E-Signature / Document Hash Signer',
                concept: 'Generate a SHA-256 hash of a text document or contract, and sign it using a private key to prove approval.',
                whyFits: 'Useful for document workflows, terms of service agreements, or receipt signing.',
                implementation: 'Hash the document content using a cryptographic library, then request the user to sign that hash via signer.signMessage(documentHash).',
                verification: 'Paste a contract text, click "Sign Contract". See the signature hash output. Verify you can download a text file containing the contract text, the public address, and the signature payload.'
            },
            {
                id: 'web3-14',
                title: 'Etherscan Transaction Link Generator',
                concept: 'Automatically generate and display clickable links to block explorers for all user-initiated blockchain transactions.',
                whyFits: 'Standard navigation practice in Web3 apps.',
                implementation: 'Append the returned transaction hash string to the network\'s explorer URL (e.g., https://polygonscan.com/tx/${txHash}).',
                verification: 'Perform a mock transaction or view transaction history; click the link and verify it opens the correct transaction page on Etherscan/Polygonscan.'
            },
            {
                id: 'web3-15',
                title: 'Token Price Feed Widget (Uniswap/Chainlink API)',
                concept: 'Display the current exchange rate of popular cryptocurrencies (e.g., ETH to USD) pulled directly from decentralized oracle queries or DEX APIs.',
                whyFits: 'Keeps users updated on currency values.',
                implementation: 'Fetch from Uniswap\'s subgraph API or a price feed aggregator API like CoinGecko.',
                verification: 'View the exchange rate widget. Verify the prices correspond with current market value.'
            }
        ],

        // THEME 5: INTERNET OF THINGS (IOT)
        iot: [
            {
                id: 'iot-1',
                title: 'Real-time Telemetry Dashboard (WebSockets/MQTT)',
                concept: 'Display live, fluctuating data streams (like temperature, humidity, or power) updating every 1-2 seconds without page refreshes.',
                whyFits: 'Core interface of any smart home, logistics, or industrial monitoring app.',
                implementation: 'Use WebSockets (via socket.io in JS) or an MQTT client connecting to a public broker (like HiveMQ or EMQX) to push random mock readings to a client-side chart.',
                verification: 'Open the dashboard and watch the temperature sensor dial/graph update in real-time.'
            },
            {
                id: 'iot-2',
                title: 'Interactive Virtual Device Controller',
                concept: 'A panel containing toggle switches or sliders that control a virtual device state (e.g., turning on a smart light bulb or adjusting fan speed) and save the status to a database.',
                whyFits: 'Demonstrates command/control capability in an IoT ecosystem.',
                implementation: 'Create an API endpoint (/api/device/state) that updates a database field, and push the state update via WebSockets to change a virtual device graphic on screen.',
                verification: 'Click the "Turn On" toggle for Virtual Light 1. Verify the light bulb graphic turns yellow, and the database status updates to active.'
            },
            {
                id: 'iot-3',
                title: 'Out-of-Bounds Sensor Alert System',
                concept: 'Trigger visual, audio, or email alerts when simulated sensor values cross defined safety thresholds (e.g., temperature exceeds 80 degC).',
                whyFits: 'Safety monitoring is a standard feature for operations dashboards.',
                implementation: 'Write a client-side or server-side comparison helper. If the telemetry value exceeds the limit, display a warning banner, flash the screen red, and play a warning sound.',
                verification: 'Use a simulated slider to increase "Boiler Pressure" past 90%. Verify that a toast alert pops up warning of critical pressure and a warning log is generated.'
            },
            {
                id: 'iot-4',
                title: 'Interactive Historical Telemetry Graphs',
                concept: 'Plot past sensor logs using a charting library, allowing users to toggle time intervals (e.g., Last 1 hour, Last 24 hours, Last 7 days).',
                whyFits: 'Essential for analyzing trends over time.',
                implementation: 'Use Chart.js or ApexCharts on the frontend. Fetch historical logs from the database, group them, and display them on a line chart.',
                verification: 'Click "Last 24 Hours". Verify the graph redraws showing historical data points with timestamped tooltips.'
            },
            {
                id: 'iot-5',
                title: 'Web geofencing Simulation Map',
                concept: 'Display an interactive map showing a virtual GPS tracker and trigger alerts if it leaves or enters a custom circle boundary.',
                whyFits: 'Fits delivery tracking, pet tracking, or fleet management apps.',
                implementation: 'Use leaflet.js or Google Maps API. Draw a circle representing the safe zone, and a marker representing the device. Write a simple distance calculator in JS.',
                verification: 'Drag the GPS marker outside the green circle. Verify a popup alert says "Device has left the safe zone".'
            },
            {
                id: 'iot-6',
                title: 'Public MQTT Broker Console',
                concept: 'A developer sandbox in the app allowing users to publish messages directly to a public MQTT broker or listen to custom topics.',
                whyFits: 'Great developer-focused diagnostic panel.',
                implementation: 'Use the mqtt.js library in the browser to connect to a broker over websockets (e.g., wss://broker.hivemq.com:8000/mqtt).',
                verification: 'Subscribe to my-hackathon/test in one tab. Publish a message to that topic from another tab, and verify it appears instantly in the console log.'
            },
            {
                id: 'iot-7',
                title: 'Device Heartbeat / Online Status Tracker',
                concept: 'Show green/red badges indicating if a device is online based on whether it has reported data in the last 60 seconds.',
                whyFits: 'Essential diagnostics for distributed hardware networks.',
                implementation: 'Compare the current time with the last_updated_at timestamp in the device database record. If the difference is > 60 seconds, display "Offline".',
                verification: 'Stop the mock telemetry script. Watch the device status badge turn from green "Online" to red "Offline" after 60 seconds.'
            },
            {
                id: 'iot-8',
                title: 'Smart Meter Energy & Cost Calculator',
                concept: 'Convert simulated energy consumption values (Watts) into estimated monetary costs in real-time based on local rates.',
                whyFits: 'Fits utility trackers, smart home integrations, or green energy dashboards.',
                implementation: 'Multiply the simulated power usage (kW) * duration (Hours) * local rate (e.g., $0.15/kWh) and display the running total cost.',
                verification: 'Adjust the virtual heater level to High. Watch the "Real-time Cost per Hour" prediction increase proportionally.'
            },
            {
                id: 'iot-9',
                title: 'Virtual RFID Badge Logger',
                concept: 'A logger display showing access logs (Time, Name, Card ID, Access Granted/Denied) from a simulated card scanner.',
                whyFits: 'Security, employee time tracking, or check-in portals.',
                implementation: 'Create an admin dashboard panel showing a list of transactions. Create a button to "Swipe card of User X".',
                verification: 'Click "Scan Guest Badge". Verify a log entry appears in the list saying "Guest (ID: 0891) - Access Denied at Server Room".'
            },
            {
                id: 'iot-10',
                title: 'Motion Detection Trigger via Webcam',
                concept: 'Use the computer\'s camera feed to detect movement and trigger an action in the application.',
                whyFits: 'Mimics physical motion sensor events (like PIR sensors).',
                implementation: 'Use HTML5 canvas to compare pixel differences between consecutive video frames. If difference exceeds a threshold, fire a "Motion Detected" event.',
                verification: 'Wave your hand in front of the camera. The app should increment a "Motion Events Log" counter.'
            },
            {
                id: 'iot-11',
                title: 'Over-The-Air (OTA) Config Editor',
                concept: 'Allow dashboard users to change device operational parameters (like logging frequency, sensor sensitivity, or rebooting the device).',
                whyFits: 'Core configuration interface for hardware.',
                implementation: 'Provide input fields on the UI that update database configurations, which the simulated device polls periodically or receives via WebSockets.',
                verification: 'Change "Telemetry Interval" from 2 seconds to 10 seconds. Verify that the incoming data feed slows down accordingly.'
            },
            {
                id: 'iot-12',
                title: 'Smart Theme Sync (Ambient Light Sensor)',
                concept: 'Synchronize the application theme (light/dark mode) automatically based on simulated or real ambient light levels.',
                whyFits: 'Interactive user interface showcase.',
                implementation: 'Use the browser\'s Generic Sensor API AmbientLightSensor (where supported) or a mock light level slider.',
                verification: 'Slide the "Ambient Light" slider to zero. Watch the application smoothly transition to dark mode.'
            },
            {
                id: 'iot-13',
                title: 'Interactive Device Map Pins',
                concept: 'Display interactive icons representing sensors on an uploaded image plan (like a building floorplan) that change color based on status.',
                whyFits: 'Excellent visual overlay for smart offices or factories.',
                implementation: 'Render a floorplan image inside a relative container. Position absolute coordinate divs on top representing sensors.',
                verification: 'Trigger a warning state on "Living Room Smoke Detector". Verify the corresponding pin on the floorplan image turns red and pulses.'
            },
            {
                id: 'iot-14',
                title: 'Battery Level & Cellular Signal Quality Indicator',
                concept: 'Display signal bars and battery icons with colors (green/yellow/red) based on simulated remote hardware battery and RSSI readings.',
                whyFits: 'Standard requirements for managing remote battery-operated hardware.',
                implementation: 'Render custom SVGs/CSS battery bars that update from simulated dataset inputs.',
                verification: 'Check the device list. Verify a battery level of 12% displays in red with a low-battery charging warning symbol next to it.'
            },
            {
                id: 'iot-15',
                title: 'Scheduled Automation Cron Editor',
                concept: 'Allow users to schedule when virtual devices should execute tasks (e.g., turn on sprinkler at 6:00 AM daily).',
                whyFits: 'Enhances simple dashboards into automated control systems.',
                implementation: 'Create a scheduler form on the UI that saves cron expressions to the database. Use a server-side cron scheduler (like node-cron or celery-beat) to trigger events.',
                verification: 'Set a virtual event for "1 minute from now". Wait and verify the device state changes automatically when the time is reached.'
            }
        ],

        // THEME 6: DATA SCIENCE
        datascience: [
            {
                id: 'ds-1',
                title: 'Interactive CSV/JSON File Uploader & Data Grid',
                concept: 'Allow users to upload a spreadsheet (CSV/JSON), auto-parse it, and render it in a clean web table with pagination and searching.',
                whyFits: 'Every data app needs a way to ingest custom files.',
                implementation: 'Use PapaParse library in JS to parse CSV strings on the client side, and render the output in a clean HTML table.',
                verification: 'Upload a CSV file containing user info. Verify that a table appears immediately showing the headers and rows with paginated controls.'
            },
            {
                id: 'ds-2',
                title: 'Dynamic Chart Generator Selector',
                concept: 'Let users select columns from their dataset using dropdowns and dynamically plot Bar, Line, or Scatter charts based on their choices.',
                whyFits: 'Empowers users to customize their data reports.',
                implementation: 'Combine Chart.js, ApexCharts, or Plotly.js with dropdown inputs pointing to keys in the parsed data array.',
                verification: 'Select "Age" for X-axis and "Salary" for Y-axis. Verify that a scatter plot automatically renders to reflect the relationship.'
            },
            {
                id: 'ds-3',
                title: 'Real-Time Numerical Filter and Range Slider',
                concept: 'Filter data tables and charts in real-time using double-ended range sliders (e.g., filter products by price between $10 and $500).',
                whyFits: 'Standard feature for searching databases, catalog listings, or directories.',
                implementation: 'Use standard Javascript array filters (data.filter(item => item.value >= min && item.value <= max)) bound to input sliders.',
                verification: 'Drag the minimum price slider up. Watch the table and charts dynamically hide items that fall outside the range.'
            },
            {
                id: 'ds-4',
                title: 'Automated Summary Statistics Card',
                concept: 'Display key metrics (Mean, Median, Mode, Variance, Standard Deviation, Min/Max) for any numeric column selected.',
                whyFits: 'Gives users an instant summary of their dataset without manual calculations.',
                implementation: 'Write simple helper functions in JavaScript or Python (mathjs or pandas can be used) to calculate basic statistical indicators.',
                verification: 'Select the "Order Value" column and verify cards show the correct Mean (e.g., $45.50) and Standard Deviation.'
            },
            {
                id: 'ds-5',
                title: 'Missing Data Highlighter & Imputation Panel',
                concept: 'Identify and highlight empty or null cells in an uploaded dataset, giving users options to drop rows, fill with zero, or replace with mean.',
                whyFits: 'Core data cleaning interface showing understanding of data preprocessing.',
                implementation: 'Loop through rows. Style empty cells with a soft red background. Add buttons that apply operations to the dataset in memory.',
                verification: 'Upload a table with blank fields. Empty cells should glow red. Click "Impute with Mean" and verify the blank cells fill with the average value.'
            },
            {
                id: 'ds-6',
                title: 'Interactive Correlation Matrix Heatmap',
                concept: 'Generate a grid showing the correlation coefficients between all numerical columns in a dataset, colored by strength.',
                whyFits: 'Standard visualization in exploratory data analysis (EDA).',
                implementation: 'Compute Pearson correlation coefficients between column pairs. Render a colored grid where positive correlation is dark blue and negative is dark red.',
                verification: 'View the matrix. Verify that columns correlated with themselves show 1.0 along the diagonal, and other relationships show correct colors.'
            },
            {
                id: 'ds-7',
                title: 'IQR Outlier Detector',
                concept: 'Automatically highlight anomalous data points in a column using the Interquartile Range (IQR) method (below Q1 - 1.5*IQR or above Q3 + 1.5*IQR).',
                whyFits: 'Vital for fraud detection, quality assurance, or telemetry logs.',
                implementation: 'Calculate Q1 (25th percentile), Q3 (75th percentile), and IQR. Flag data entries outside these bounds.',
                verification: 'View a list of transaction amounts. An extremely high transaction (e.g. $10,000 when average is $50) should display an alert badge: "Outlier Detected".'
            },
            {
                id: 'ds-8',
                title: 'Interactive Pivot Table Builder',
                concept: 'A drag-and-drop style builder allowing users to aggregate rows and columns to cross-tabulate data.',
                whyFits: 'Excellent reporting tool for dashboards.',
                implementation: 'Use an open-source JS pivot table utility (like pivottable.js) or implement a basic group-by logic script.',
                verification: 'Select "Country" as rows and "Sum of Sales" as values. Verify it renders a summary table grouped by country.'
            },
            {
                id: 'ds-9',
                title: 'Client-Side High-Volume Chart Downsampler',
                concept: 'Implement a downsampling algorithm (e.g., LTTB - Largest Triangle Three Buckets) to render high-volume sensor or market data smoothly on charts.',
                whyFits: 'Critical for chart performance when dealing with 50,000+ data points.',
                implementation: 'Integrate a lightweight LTTB helper function to reduce data points to 500 before passing them to the charting library.',
                verification: 'Load a file containing 10,000 rows. Verify that the chart renders instantly and stays responsive when scrolling/zooming.'
            },
            {
                id: 'ds-10',
                title: 'Stop-Word Filtered Word Cloud Generator',
                concept: 'Generate a word cloud from an uploaded text block or document, filtering out common filler words (the, is, and, at).',
                whyFits: 'Perfect for customer review analysis, survey answers, or blog tags.',
                implementation: 'Use a library like d3-cloud or wordcloud2.js. Create an array of English stop words to filter out before generating the cloud.',
                verification: 'Paste a long text about product feedback. Verify the word cloud displays key terms like "fast" and "easy" in large text, and hides words like "and".'
            },
            {
                id: 'ds-11',
                title: 'Trend Line Fitter (Linear Regression)',
                concept: 'Fit and display a line of best fit over a scatter plot, along with the R-squared accuracy value.',
                whyFits: 'Essential for making predictions and identifying general directions in datasets.',
                implementation: 'Calculate slope and intercept using the least squares method in JS or Python. Draw the line on the chart.',
                verification: 'Hover over the line of best fit on the scatter plot and read the formula: y = mx + c along with the R2 value.'
            },
            {
                id: 'ds-12',
                title: 'Interactive Distribution Histogram',
                concept: 'Render a histogram showing the distribution of values in a column, with a slider to dynamically change the number of bins.',
                whyFits: 'Displays data density and distribution shape (e.g., normal distribution).',
                implementation: 'Write a function to bin numbers into ranges and update a bar chart accordingly.',
                verification: 'Move the "Number of Bins" slider from 5 to 20. Watch the histogram bars splits into narrower, more detailed columns.'
            },
            {
                id: 'ds-13',
                title: 'Data Export Wizard',
                concept: 'Allow users to download their filtered, cleaned, or aggregated data tables into multiple formats (CSV, JSON, PDF).',
                whyFits: 'Essential utility for any user who wants to work with their app data externally.',
                implementation: 'Convert your data object to a CSV string and trigger a browser download using a data URI: data:text/csv;charset=utf-8.',
                verification: 'Apply a filter to your data, click "Export CSV", open the downloaded file, and verify it contains only the filtered rows.'
            },
            {
                id: 'ds-14',
                title: 'Interactive Leaflet Geo-Plotter',
                concept: 'If the dataset contains latitude and longitude columns, automatically plot them as markers on an interactive map.',
                whyFits: 'Great for location data, retail stores, real estate, or shipping.',
                implementation: 'Parse coordinate columns and load them into leaflet.js Map markers.',
                verification: 'Upload a list of offices with coordinates. Verify a map loads displaying markers indicating each location.'
            },
            {
                id: 'ds-15',
                title: 'Transformation History Log',
                concept: 'Keep a history trail of transformations applied to the current session dataset (e.g., "Imputed 3 missing values", "Filtered by age > 25") with an "Undo" button.',
                whyFits: 'Promotes safe exploration of datasets.',
                implementation: 'Maintain an array of past state snapshots in memory. Clicking "Undo" pops the last state from the stack.',
                verification: 'Delete a column. Verify that the log shows "Deleted Column: Salary". Click "Undo" and verify the column returns.'
            }
        ],

        // THEME 7: AUGMENTED & VIRTUAL REALITY (AR/VR)
        arvr: [
            {
                id: 'arvr-1',
                title: 'Interactive 3D Product Viewer',
                concept: 'Embed an interactive 3D model viewer on a page that allows users to rotate, pan, and zoom in on an object (like a product or design).',
                whyFits: 'Enhances catalogs, portfolio items, or e-commerce pages with rich visual media.',
                implementation: 'Use Google\'s <model-viewer> web component (loads GLTF/GLB files in one line of code) or a basic Three.js canvas.',
                verification: 'Drag your mouse over the 3D canvas and verify the object rotates smoothly in all directions.'
            },
            {
                id: 'arvr-2',
                title: 'AR Placement Overlay via QR/WebXR',
                concept: 'A button that launches a mobile camera view to place a 3D model in the user\'s real-world room (Augmented Reality).',
                whyFits: 'Excellent for showing how an object (furniture, art, equipment) looks in a physical room.',
                implementation: 'Add the ar attribute to the <model-viewer> component. It automatically handles launching AR Quick Look (iOS) or Scene Viewer (Android).',
                verification: 'Click "View in AR" on a smartphone. Scan the floor, and verify the 3D model appears anchored to the ground at real scale.'
            },
            {
                id: 'arvr-3',
                title: 'Interactive 360 deg Panorama Tour',
                concept: 'Let users look around a 360-degree panoramic image (representing a room, virtual workspace, or event hall).',
                whyFits: 'Fits real estate, travel guides, virtual event hubs, or company introductions.',
                implementation: 'Use A-Frame (<a-sky src="image.jpg"></a-sky>) or a library like Pannellum in standard HTML/JS.',
                verification: 'Click and drag on the image. Verify that the view pans a full 360 degrees horizontally and vertically.'
            },
            {
                id: 'arvr-4',
                title: 'Real-time 3D Customizer',
                concept: 'Provide buttons or color swatches next to a 3D model viewer to dynamically change its color, texture, or parts.',
                whyFits: 'Showcases interactive customization workflows.',
                implementation: 'Query the model material nodes using Three.js or <model-viewer> APIs: modelViewer.model.materials[0].pbrMetallicRoughness.setBaseColorFactor([r, g, b, a]).',
                verification: 'Click the "Blue" button. Verify the 3D model\'s paint color changes to blue instantly.'
            },
            {
                id: 'arvr-5',
                title: 'Hotspot Tooltips in 3D Space',
                concept: 'Anchor clickable points directly onto a 3D model that display details when hovered or clicked.',
                whyFits: 'Great for explaining complex machinery, anatomy, or product features.',
                implementation: 'Use the <button slot="hotspot-..." data-position="..."> tags inside <model-viewer>, or project coordinates in Three.js.',
                verification: 'Click a pulsing target on a 3D engine. Verify a tooltip dialog box pops up containing specifications.'
            },
            {
                id: 'arvr-6',
                title: 'Interactive Virtual Reality Gallery (A-Frame)',
                concept: 'A first-person VR room where users can navigate (WASD or VR controllers) to view images hanging on walls.',
                whyFits: 'Perfect for virtual art galleries, museum showcases, or portfolio displays.',
                implementation: 'Write a simple A-Frame HTML template with <a-plane> walls, loaded images, and default WASD control scripts.',
                verification: 'Open the gallery page, press the arrow keys/WASD, and navigate around the room to look at the framed images.'
            },
            {
                id: 'arvr-7',
                title: 'Gesture-Controlled 3D Rotator',
                concept: 'Allow users to rotate a 3D object on the screen by waving their hands in front of their webcam.',
                whyFits: 'Showcases touchless interaction design.',
                implementation: 'Integrate Google\'s MediaPipe Hands library on the frontend. Translate hand X-axis coordinate changes to the 3D model\'s rotation property.',
                verification: 'Hold up your hand. Move it left-to-right. Verify the 3D model on screen rotates matching your hand motion.'
            },
            {
                id: 'arvr-8',
                title: 'AR Marker Business Card (WebAR)',
                concept: 'Show a camera feed. When a specific print/screen marker is shown to the camera, overlay interactive links or 3D animations.',
                whyFits: 'Interactive marketing, onboarding, or contact info cards.',
                implementation: 'Use AR.js with a default Hiro marker (<a-marker preset="hiro">).',
                verification: 'Hold a printed "Hiro" marker in front of your webcam. Verify a 3D logo or interactive text floats on top of the marker.'
            },
            {
                id: 'arvr-9',
                title: 'VR Mode Cardboard Toggle',
                concept: 'A button that splits the screen into stereoscopic view (left/right eyes) for use with simple VR headsets (Google Cardboard).',
                whyFits: 'Low-cost entry point into immersive virtual environments.',
                implementation: 'Use the built-in VR button in A-Frame or a split-screen WebXR emulator.',
                verification: 'Click "Enter VR". Verify the screen splits into two duplicate side-by-side circular views that react to phone orientation.'
            },
            {
                id: 'arvr-10',
                title: 'Dynamic Lighting controls in 3D Viewer',
                concept: 'Sliders that allow the user to change the lighting direction, intensity, and shadow properties in a 3D showcase.',
                whyFits: 'Standard tools for 3D designers and configurators.',
                implementation: 'Map HTML input range sliders to ambient and directional light objects in Three.js.',
                verification: 'Move the "Shadow Intensity" slider down. Verify that the shadow beneath the 3D model fades out.'
            },
            {
                id: 'arvr-11',
                title: 'Audio-Reactive 3D Object',
                concept: 'A 3D geometric shape that dynamically pulses, scales, or changes color based on the volume and frequency of user voice input.',
                whyFits: 'Interactive audio recorders, music players, or gaming interfaces.',
                implementation: 'Combine the Web Audio API AnalyserNode with a Three.js render loop, mapping frequency bytes to mesh scale factors.',
                verification: 'Shout or whistle into your microphone. Watch the 3D object distort or grow larger in response.'
            },
            {
                id: 'arvr-12',
                title: '3D Scatterplot Visualizer',
                concept: 'Plot coordinates in 3D space, letting users zoom in and move around clusters of data.',
                whyFits: 'Data analysis helper for 3D datasets.',
                implementation: 'Use plotly.js 3D scatter plot configurations or custom Three.js particles.',
                verification: 'Drag the graph to rotate. Hover over a point in the 3D space and verify it displays coordinate values.'
            },
            {
                id: 'arvr-13',
                title: 'Virtual Try-On (Webcam Overlay)',
                concept: 'Use the webcam to overlay simple assets (like glasses, hats, or mustaches) on the user\'s face in real-time.',
                whyFits: 'Fun social filters or commerce portals (eyewear, accessories).',
                implementation: 'Use MediaPipe FaceMesh or Jeeliz FaceFilter to track facial anchor coordinates on a canvas overlaying the video tag.',
                verification: 'Look at the camera. Verify the virtual glasses align with your eyes and follow your head tilt.'
            },
            {
                id: 'arvr-14',
                title: '3D Physics Simulator',
                concept: 'A 3D room containing objects that react to gravity and collides with each other (e.g., throwing balls to collapse a wall).',
                whyFits: 'Gamification and interactive physics showcase.',
                implementation: 'Use cannon.js or ammo.js integrated with a Three.js rendering cycle.',
                verification: 'Click the canvas to launch a sphere. Verify it hits a stack of boxes, causing them to fall realistically.'
            },
            {
                id: 'arvr-15',
                title: 'AR Location Pointer (Camera Compass)',
                concept: 'Overlay floating labels on the smartphone camera screen indicating the direction and distance of landmarks.',
                whyFits: 'Tour guides, navigation, or event locators.',
                implementation: 'Use AR.js location-based components that read the device\'s GPS and compass sensors.',
                verification: 'Rotate your phone. Verify the target label moves off-screen when you look away, and comes back when you face the target\'s bearing.'
            }
        ],

        // THEME 8: ROBOTICS AND AUTOMATION
        robotics: [
            {
                id: 'robotics-1',
                title: 'Interactive Virtual Joystick',
                concept: 'A touch-responsive on-screen analog joystick that outputs real-time X/Y coordinates (from -1 to 1) for controlling a simulated robot or vehicle.',
                whyFits: 'Core navigation controller for manual robotics operations.',
                implementation: 'Integrate the nipplejs library in the browser or build a simple custom touch/drag event listener.',
                verification: 'Drag the joystick knob. Verify the UI updates continuously to show coordinate values (e.g., X: 0.75, Y: -0.22) and prints them to a developer log.'
            },
            {
                id: 'robotics-2',
                title: 'Robot Sequence Planner (Drag-and-Drop)',
                concept: 'A visual list editor where users stack instruction blocks (e.g., "Move Forward 2m", "Turn Left 90 deg", "Wait 5s") to build an automated action routine.',
                whyFits: 'Demonstrates task scheduling and automation logic.',
                implementation: 'Combine SortableJS or dragula with a JSON list structure that updates on drag events.',
                verification: 'Drag the "Turn Left" block above "Move Forward". Click "Run Sequence" and watch the dashboard simulate each action sequentially with a highlight.'
            },
            {
                id: 'robotics-3',
                title: 'State Machine Visualizer',
                concept: 'Display a flow diagram of the system\'s operational states (Idle, Moving, Charging, Emergency Stop) highlighting the active state.',
                whyFits: 'Crucial for tracking multi-step automated processes.',
                implementation: 'Use mermaid.js inside the web app or styled CSS nodes. Highlight the active state node by adding a dynamic class (e.g., .active { border: 2px solid green; }).',
                verification: 'Trigger a simulated action (e.g., click "Dock"). Verify the highlighted circle on the state diagram shifts from "Moving" to "Charging".'
            },
            {
                id: 'robotics-4',
                title: 'Telemetric Console with Log Level Filtering',
                concept: 'A fast-scrolling terminal-like output window displaying automated system alerts, with checkboxes to filter by level (Info, Warn, Error).',
                whyFits: 'Standard developer/operator debugging view.',
                implementation: 'Append log messages to an array in state, and render them in a styled code block. Filter the render loop based on active filter buttons.',
                verification: 'Toggle the "Error" filter. Verify the log console hides all "Info" and "Warning" lines, displaying only errors.'
            },
            {
                id: 'robotics-5',
                title: 'Waypoint Path Editor on Map Image',
                concept: 'Let users click on an image map (like a grid or room layout) to place markers, drawing lines between them to define a robot path.',
                whyFits: 'Path-planning interface for automated guided vehicles (AGVs) or vacuum robots.',
                implementation: 'Capture click coordinates on a Canvas element, draw circle nodes, and connect them with lines.',
                verification: 'Click three points on the room map. Verify that numbered waypoint tags appear, connected by a path line, and the coordinates list outputs: [[120, 240], [200, 310], [50, 400]].'
            },
            {
                id: 'robotics-6',
                title: 'Emergency Stop (E-Stop) Button',
                concept: 'A prominent, styled button that instantly cancels all running automated routines, locks the UI, and requires manual confirmation to reset.',
                whyFits: 'Mandatory safety mechanism in all physical robotics and automation.',
                implementation: 'Create a global application state variable isEstopActive. If true, block all API commands and render a red warning screen overlay.',
                verification: 'Click the E-Stop button. Verify the app locks, a warning sound plays, and buttons become unclickable until you check "I confirm it is safe to reset" and click "Reset".'
            },
            {
                id: 'robotics-7',
                title: 'Obstacle Detection Radar HUD',
                concept: 'A radar-like visualization displaying distances to simulated obstacles surrounding the robot (Front, Rear, Left, Right).',
                whyFits: 'Core safety monitor showing environmental awareness.',
                implementation: 'Draw a circular radar grid using Canvas or custom CSS arcs. Map sensor distances (e.g. 10cm to 200cm) to color-coded indicator bars (red for close, green for far).',
                verification: 'Adjust a simulated slider for "Front Distance" to 15cm. Verify the front sector of the radar HUD turns red and starts flashing.'
            },
            {
                id: 'robotics-8',
                title: 'Robotics Payload & Balance Calculator',
                concept: 'Allow users to drag items onto a grid representing a robot platform, calculating the total mass and estimating the center of gravity (CoG).',
                whyFits: 'Essential for physical stability calculations in load-bearing robotics.',
                implementation: 'Calculate the centroid coordinate using weight values and position offsets relative to the center of the grid.',
                verification: 'Drag a heavy battery to the far left. Verify the center-of-gravity crosshair on the diagram shifts left, showing a "Stable / Unstable" warning indicator.'
            },
            {
                id: 'robotics-9',
                title: 'Motor Calibration & PID Slider Panel',
                concept: 'A tuning panel containing sliders to adjust motor constants (Proportional, Integral, Derivative gains) and view the resulting stabilization curve.',
                whyFits: 'Standard calibration screen for drone controls, heating loops, or motor controllers.',
                implementation: 'Map sliders (Kp, Ki, Kd) to a mathematical simulation function that plots a chart showing overshoot and settling time.',
                verification: 'Slide Kp (Proportional) high. Verify that the line graph shows large oscillations and overshoot before settling.'
            },
            {
                id: 'robotics-10',
                title: 'Voice Triggered Automation Commands',
                concept: 'Allow users to trigger complex automation macros (e.g. "Shut down all systems", "Initiate scan") using custom voice commands.',
                whyFits: 'Enhances control access.',
                implementation: 'Use the browser\'s SpeechRecognition API. Compare the transcript with a lookup list of command regexes.',
                verification: 'Click the mic icon, say "Run Diagnostic Scan". Verify the diagnostic bar on screen starts running and log outputs "Command recognized: scan".'
            },
            {
                id: 'robotics-11',
                title: 'Battery Cycle & Health Dashboard',
                concept: 'A detailed panel displaying battery parameters: Voltage, Current, Temperature, Cycle Count, and State of Charge (SoC).',
                whyFits: 'Vital for estimating runtime and scheduling battery swaps.',
                implementation: 'Create an active telemetry card that flags warnings if temperature exceeds 45 degC or voltage drops below safety margins.',
                verification: 'View the battery panel. A cell temperature of 50 degC should display an orange warning: "High Battery Temperature alert".'
            },
            {
                id: 'robotics-12',
                title: 'Remote Diagnostics Report Generator (PDF)',
                concept: 'A button that compiles the current system logs, telemetry states, and battery charts into a clean, print-ready PDF report.',
                whyFits: 'Essential for operators to hand off shift reports or document failures.',
                implementation: 'Integrate jspdf or html2pdf.js on the client side to capture the dashboard DOM and export it.',
                verification: 'Click "Export Report". Open the downloaded PDF and verify it contains the layout, charts, and table logs.'
            },
            {
                id: 'robotics-13',
                title: 'Camera Overlay with Gridlines & HUD',
                concept: 'Overlay coordinate grids, yaw/pitch indicators, and crosshairs on top of a camera stream (real or simulated).',
                whyFits: 'Mimics drone pilot or teleoperation video feeds.',
                implementation: 'Render a video tag or a mock canvas stream, and layer absolute-positioned SVG overlays on top.',
                verification: 'View the feed. Verify a center crosshair remains aligned while pitch and roll sliders adjust floating horizon lines.'
            },
            {
                id: 'robotics-14',
                title: 'Smart Maintenance Alert Notifier',
                concept: 'Automatically display alerts when a simulated motor\'s operating hours exceed maintenance limits (e.g. recommend lubricating joints after 100 hours).',
                whyFits: 'Standard operational efficiency monitor.',
                implementation: 'Store operational hours in the database, run a check against threshold rules, and push warnings to a dashboard notification drawer.',
                verification: 'Check the notification bell. An alert should say "Motor 3: Exceeded 100 hours of operations. Lubrication recommended."'
            },
            {
                id: 'robotics-15',
                title: 'G-Code / Instruction Parser Sandbox',
                concept: 'A simple code text editor where users can input lines of movement codes (like G-code) and watch a 2D canvas draw the path step-by-step.',
                whyFits: 'CNC machines, 3D printers, or robotic cutters.',
                implementation: 'Read text input line-by-line using JS. Parse codes (e.g., G1 X10 Y20 as draw line to 10,20) and run drawing loops on a Canvas element.',
                verification: 'Paste G1 X100 Y50 followed by G1 X50 Y100 and click "Run". Verify a triangle or shape is drawn in real-time.'
            }
        ],

        // THEME 9: CLOUD COMPUTING & DEVOPS
        cloud_devops: [
            {
                id: 'cloud-1',
                title: 'Application Health Check Endpoint (/healthz)',
                concept: 'Build an API endpoint that queries the status of external services (like databases, Redis, or API integrations) and returns a structured health report.',
                whyFits: 'Vital for container orchestrators (like Kubernetes or Cloud Run) to monitor service status.',
                implementation: 'Create a /api/healthz endpoint that tests connectivity (e.g. queries SELECT 1 in SQL, checks system memory, and calculates uptime) returning a JSON status block.',
                verification: 'Query the endpoint via curl or browser. Verify it returns 200 OK with JSON fields showing database connection: "healthy", CPU usage, and memory availability.'
            },
            {
                id: 'cloud-2',
                title: 'Prometheus Metrics Exporter (/metrics)',
                concept: 'Expose an endpoint that outputs metrics in the Prometheus format, allowing tracking of active requests, memory, and database connection pools.',
                whyFits: 'Standard monitoring practice in microservice infrastructures.',
                implementation: 'Use prom-client in Node.js, prometheus-client in Python, or build a simple text builder outputting keys in the format http_requests_total{method="GET"} 42.',
                verification: 'Visit /metrics and verify it serves raw plaintext metrics formatted with # HELP and # TYPE tags.'
            },
            {
                id: 'cloud-3',
                title: 'Admin Environment Diagnostics Panel',
                concept: 'A secure, admin-only panel in the UI displaying server configurations, memory usage, environment variables (with secrets masked), and database connections.',
                whyFits: 'Extremely helpful for troubleshooting issues in staging and production environments.',
                implementation: 'Fetch server stats (e.g., using os module in Node/Python) and map them to a clean admin card. Ensure variables like DB_PASSWORD or JWT_SECRET are replaced with [REDACTED].',
                verification: 'Log in as admin, navigate to Diagnostics, and check server uptime, node memory bar, and verify secrets are successfully masked.'
            },
            {
                id: 'cloud-4',
                title: 'Multi-Stage Dockerfile (Build Optimization)',
                concept: 'Write a multi-stage Dockerfile that builds and packages the application inside a minimal runtime environment (e.g. Alpine/Distroless), shrinking image size and reducing security vulnerabilities.',
                whyFits: 'Core standard for containerizing applications.',
                implementation: 'Use a build container (e.g. node:alpine AS builder) to compile dependencies, then copy only the production files to a clean final image (FROM node:alpine).',
                verification: 'Run docker build -t app . followed by docker images. Verify the final image size is significantly smaller than a standard non-multistage build image.'
            },
            {
                id: 'cloud-5',
                title: 'Automated CI Lint and Test Pipeline (GitHub Actions)',
                concept: 'Configure a workflow that automatically runs format checkers, code style linters, and unit tests on every pull request or commit.',
                whyFits: 'The baseline automation for any modern software project.',
                implementation: 'Add a .github/workflows/ci.yml file using actions to check out code, cache packages, run npm run lint, and run test scripts.',
                verification: 'Open a pull request or push code, and watch the GitHub Actions workflow successfully pass all checks with green indicators on the PR page.'
            },
            {
                id: 'cloud-6',
                title: 'Structured JSON Logging Middleware',
                concept: 'Format all server console logs as structured JSON objects containing log levels, timestamps, request routes, and error traces.',
                whyFits: 'Essential for routing logs to aggregators (like Datadog, ELK, or Google Cloud Logging).',
                implementation: 'Integrate a logging library like winston / pino in Node.js, or structlog in Python.',
                verification: 'Make a request to the backend. View the server console output and verify it prints a clean JSON string (e.g., {"level":"info","timestamp":"...","path":"/login","statusCode":200}).'
            },
            {
                id: 'cloud-7',
                title: 'API Response Cache Middleware (Redis/In-Memory)',
                concept: 'Cache the response of heavy or frequent database query endpoints, returning cached results instantly with a Time-To-Live (TTL).',
                whyFits: 'Drastically improves performance and database load on lookup-heavy routes.',
                implementation: 'Write a middleware that checks if the request URL exists in a local Node-Cache or Redis instance. If it does, return the JSON immediately; if not, query the DB and save it to cache.',
                verification: 'Call a heavy listing API. The first request takes 300ms. Subsequent loads within the next minute should take under 10ms.'
            },
            {
                id: 'cloud-8',
                title: 'Config-Driven Feature Flags',
                concept: 'Build a system that toggles features on or off instantly without requiring code changes or redeployments, controlled by a JSON file or database table.',
                whyFits: 'Allows progressive rollouts and instant rollback of buggy code.',
                implementation: 'Create a backend utility that reads configuration parameters (enable_new_checkout_flow: true/false). Bind UI visibility or backend routes to these flags.',
                verification: 'Change the feature flag to false in the JSON config or database. Refresh the page and verify that the target feature component instantly disappears.'
            },
            {
                id: 'cloud-9',
                title: 'Database Migrations Pipeline',
                concept: 'Manage database schemas using migration version scripts rather than running manual SQL queries on tables.',
                whyFits: 'Best practice for managing database consistency across team members and environments.',
                implementation: 'Use tools like knex, prisma, flyway, alembic, or sequelize migration generators.',
                verification: 'Run a terminal command (e.g., npx knex migrate:latest or python manage.py migrate). Verify that tables are created automatically on a fresh database.'
            },
            {
                id: 'cloud-10',
                title: 'Automated Database Backup Runner',
                concept: 'A script or automated cron job that dumps the application database and uploads it to an object storage bucket (e.g., Google Cloud Storage or AWS S3).',
                whyFits: 'Crucial disaster recovery feature for any stateful application.',
                implementation: 'Write a bash script or Python utility that triggers pg_dump/mysqldump, compresses it, and uses cloud SDKs to upload the file to storage.',
                verification: 'Run the backup function. Check your cloud storage bucket and verify a .sql.gz backup file appears named with the current timestamp.'
            },
            {
                id: 'cloud-11',
                title: 'Custom Sentry/Error Reporting Integration',
                concept: 'Track runtime exceptions that happen in user browsers or on servers, reporting detailed call stacks to a central logging console.',
                whyFits: 'Allows developers to find and fix client-side bugs that are invisible to server logs.',
                implementation: 'Add the Sentry SDK to your frontend/backend code. Provide a test button that triggers a reference error (e.g., calling an undefined function).',
                verification: 'Click the "Trigger Test Error" button. Open your Sentry/GlitchTip dashboard and verify the error report appears detailing the browser, OS, and file line number.'
            },
            {
                id: 'cloud-12',
                title: 'Graceful Shutdown Handler',
                concept: 'Program the backend to handle termination signals (SIGINT, SIGTERM), ensuring active requests are finished, database connections close cleanly, and the process exits.',
                whyFits: 'Prevents dropping active user connections during rolling deployments or restarts.',
                implementation: 'Add event listeners to the process (process.on(\'SIGTERM\', ...) in Node) to close servers and release resources.',
                verification: 'Run the server, make a request that takes 5 seconds, and send a Ctrl+C signal. Verify the server logs that it is finishing active connections before shutting down.'
            },
            {
                id: 'cloud-13',
                title: 'Multi-Environment Configuration Manager (.env)',
                concept: 'Manage project configuration variables cleanly across Development, Staging, and Production environments using .env files and automated loaders.',
                whyFits: 'Standard security boundary to keep development machines isolated from production databases.',
                implementation: 'Use dotenv or pydantic-settings to load configurations. Throw an error on startup if required production environment variables are missing.',
                verification: 'Temporarily rename your .env file to hide it and start the server. Verify the server crashes immediately, notifying you of missing configurations.'
            },
            {
                id: 'cloud-14',
                title: 'Static Asset Cache-Control Header Optimization',
                concept: 'Configure the web server to send long-term caching headers (Cache-Control: max-age=31536000, immutable) for static assets (images, CSS, JS).',
                whyFits: 'Boosts website loading speed on returning visits.',
                implementation: 'Set middleware settings in Express (e.g., express.static(..., { maxAge: \'1y\' })) or configure asset delivery rules in Nginx/Apache.',
                verification: 'Refresh the website. Open Chrome DevTools Network Tab and verify that the "Size" column for static assets reads (from disk cache) or (from memory cache).'
            },
            {
                id: 'cloud-15',
                title: 'Serverless Asset Transcoder/Generator',
                concept: 'Move heavy, resource-intensive operations (such as resizing images, compiling PDF invoices, or transcoding videos) to an isolated serverless function structure.',
                whyFits: 'Prevents heavy tasks from clogging the main application server.',
                implementation: 'Create a standalone script or Cloud Function (e.g., AWS Lambda, GCP Cloud Functions) that resizes images on upload using the sharp library.',
                verification: 'Upload a 5MB image. Verify that the thumbnail renders fast and the main server logs show no CPU spikes during processing.'
            }
        ],

        // THEME 10: CRYPTOGRAPHY
        cryptography: [
            {
                id: 'crypto-1',
                title: 'Client-Side Text Encryptor/Decryptor (AES-GCM)',
                concept: 'A secure textbox utility allowing users to encrypt private text (e.g. notes, passwords) using a custom password before saving it to a database.',
                whyFits: 'Adds true privacy to note-taking apps, secret diaries, or client profile dashboards.',
                implementation: 'Use the browser\'s native Web Crypto API (window.crypto.subtle) to derive a key from a password and encrypt/decrypt using AES-GCM.',
                verification: 'Type "My secret bank PIN is 1234" and password "secret123". Click encrypt. See base64 cipher output. Save. Refresh page. Enter correct password to decrypt and view the secret. Type incorrect password and verify it throws a decryption failure error.'
            },
            {
                id: 'crypto-2',
                title: 'Digital Signature Creator & Verifier',
                concept: 'Generate public/private key pairs and sign messages to prove origin authenticity (non-repudiation) without exposing keys.',
                whyFits: 'Useful for document validation, online voting, or tamper-proof comment feeds.',
                implementation: 'Use standard libraries like elliptic or the Web Crypto API to generate RSA/ECDSA keypairs, sign a text string, and verify signatures.',
                verification: 'Sign a message. Modify a single letter in the signed message (e.g., from "Pay $10" to "Pay $100"). Attempt verification and check that the application flags the signature as "Invalid / Tampered".'
            },
            {
                id: 'crypto-3',
                title: 'Password Hashing Sandbox Dashboard',
                concept: 'An educational visual dashboard illustrating the execution time differences and security benefits of hashing algorithms (MD5 vs SHA-256 vs Bcrypt/Argon2).',
                whyFits: 'Excellent administrative helper page or developer learning sandbox.',
                implementation: 'Hash user input through multiple algorithms on the frontend or backend, measuring execution times in milliseconds.',
                verification: 'Type "hello". Watch MD5 hash in < 1ms, SHA-256 in < 1ms, while Bcrypt (with work factor 10) takes ~100ms, illustrating why Bcrypt is resistant to brute-force attacks.'
            },
            {
                id: 'crypto-4',
                title: 'Interactive Diffie-Hellman Key Exchange Simulator',
                concept: 'A visual walkthrough showing two users establishing a shared secret key over an insecure channel using public/private calculations.',
                whyFits: 'Perfect educational overlay for chat, messaging, or security applications.',
                implementation: 'Map the mathematical equations: g^a mod p and g^b mod p using a simple JavaScript calculator, changing colors or icons to show how the keys match at the end.',
                verification: 'Set custom sliders for Alice\'s private key a and Bob\'s private key b. Watch the step-by-step math update and verify both sides calculate the exact same final shared secret.'
            },
            {
                id: 'crypto-5',
                title: 'Steganography Image Decoder',
                concept: 'Hide a secret text message inside the pixels of an uploaded PNG image file, and extract the secret from the image file on another page.',
                whyFits: 'Fun feature for profiles, messaging, or scavenger hunt apps.',
                implementation: 'Use a lightweight JS library (like steganography.js or write a basic LSB pixel color manipulator using HTML Canvas).',
                verification: 'Upload an image, type a secret note, and download the encoded image. Upload the downloaded image back into the "Decode" box and verify the secret message appears.'
            },
            {
                id: 'crypto-6',
                title: 'HMAC Message Authenticator (Integrity Check)',
                concept: 'Compute and verify Hash-based Message Authentication Codes (HMAC) to ensure messages have not been altered in transit.',
                whyFits: 'Critical for validating webhooks, payment responses, or session payloads.',
                implementation: 'Use a library like crypto-js or Node\'s native crypto module to generate HMAC-SHA256 signatures using a shared key.',
                verification: 'Generate an HMAC signature for a transaction data string. Change a variable in the data string, and verify the verification check fails because the HMAC signature no longer matches the payload.'
            },
            {
                id: 'crypto-7',
                title: 'JSON Web Token (JWT) Inspector & Validator',
                concept: 'A diagnostics screen allowing admins or developers to paste a JWT token, decode its header/payload, and check its signature and expiration validity.',
                whyFits: 'Helpful diagnostic widget for applications using token-based authentication.',
                implementation: 'Split the JWT by . characters, base64-decode the first two segments, and verify the third segment using the server\'s public key.',
                verification: 'Paste an active JWT. The app should display the JSON payload (user, scopes) and show a green "Valid" indicator. Paste an expired token and check that it alerts "Token Expired".'
            },
            {
                id: 'crypto-8',
                title: 'Secure Passphrase Generator (Diceware)',
                concept: 'Generate highly secure, memorable passphrases by simulating rolling physical dice to select words from a standard Diceware list.',
                whyFits: 'Excellent onboarding tool to help users create strong passwords.',
                implementation: 'Load the EFF long wordlist in JavaScript. Use crypto.getRandomValues() to generate secure random indices, combining 4-6 random words together.',
                verification: 'Click "Generate Passphrase". Verify the system outputs a passphrase (e.g. correct-horse-battery-staple) and states its entropy value in bits.'
            },
            {
                id: 'crypto-9',
                title: 'Shamir\'s Secret Sharing Scheme Calculator',
                concept: 'Split a single password or secret phrase into N unique shares such that any threshold K of shares is required to rebuild the secret.',
                whyFits: 'Great for joint custody vaults, backup recovery keys, or multi-admin portals.',
                implementation: 'Integrate a lightweight Shamir\'s Secret Sharing library (like secrets.js-grempe) on the client side.',
                verification: 'Split a secret into 5 shares with a threshold of 3. Enter any 2 shares (verify it fails to decrypt). Enter a 3rd share and verify the secret string successfully reconstructs.'
            },
            {
                id: 'crypto-10',
                title: 'BIP39 Mnemonic Seed Generator',
                concept: 'Generate a standard 12 or 24-word seed phrase and derive hierarchical keys, explaining how modern wallets work.',
                whyFits: 'Standard setup for cryptocurrency wallets or offline keys.',
                implementation: 'Integrate the bip39 library on the frontend to generate random mnemonics and derive public/private keys from seed bytes.',
                verification: 'Click "Generate Seed". Verify a grid of 12 words appears and can be copied. Paste it into a validator to view the derived root key.'
            },
            {
                id: 'crypto-11',
                title: 'Secure File Shredder Simulation',
                concept: 'Visually simulate secure deletion by overwriting a file multiple times with random noise before deleting it from local storage.',
                whyFits: 'Shows data privacy best practices.',
                implementation: 'Create a UI button where a file is overwritten with random bytes (via crypto.getRandomValues) 3 times (Guttmann or DoD standard simulation) before removing its reference.',
                verification: 'Click "Secure Shred". A progress bar should show the overwrite passes (Pass 1: Random data, Pass 2: Zeros, Pass 3: Random data) before deleting the file.'
            },
            {
                id: 'crypto-12',
                title: 'One-Time Pad Cipher Sandbox',
                concept: 'Encrypt a message using a key pad that is completely random and is the exact same length as the message itself.',
                whyFits: 'Perfect educational utility for demonstrating theoretically unbreakable encryption.',
                implementation: 'Generate a random key string of the same length as the input, and perform a bitwise XOR (⊕) between the message and key characters.',
                verification: 'Input "hello" (5 characters). The app should generate a random 5-character key (e.g. ax7fg) and output the XOR ciphertext.'
            },
            {
                id: 'crypto-13',
                title: 'Zero-Knowledge Proof (ZKP) Interactive Demo',
                concept: 'A simple interactive visual simulation of a ZKP (like the Ali Baba Cave or Graph Three-Coloring) to explain proof of knowledge without disclosure.',
                whyFits: 'Engaging tutorial widget for security dashboards.',
                implementation: 'Create a visual canvas puzzle where the user acts as the prover and the computer acts as the verifier, picking random checks to verify knowledge.',
                verification: 'Play through the 3 validation steps. The system should grant verification confirmation after 3 successful checks without the user revealing their password/path.'
            },
            {
                id: 'crypto-14',
                title: 'SSL Certificate Parser & Inspector',
                concept: 'Paste a website domain name and retrieve/parse its SSL certificate details: Issuer, Valid From/To Dates, Fingerprint, and Subject Alternative Names.',
                whyFits: 'Admin dashboards, website trackers, or security monitoring portals.',
                implementation: 'Fetch the certificate details using Node\'s native tls module: tls.connect(...) and parse the socket certificate object.',
                verification: 'Enter "google.com" and click parse. Verify the panel displays the certificate\'s issuer (e.g. Google Trust Services) and expiration date.'
            },
            {
                id: 'crypto-15',
                title: 'Simple Caesar & Vigenère Classical Cipher Playground',
                concept: 'A learning widget showing how classical ciphers work (shift cipher and polyalphabetic key cipher), illustrating early cryptography history.',
                whyFits: 'Great for coding challenge sites, puzzles, or educational modules.',
                implementation: 'Implement basic modular arithmetic shifting (C = (P + K) mod 26) in JavaScript.',
                verification: 'Input "hello" with Caesar shift 3. Verify output is "khoor". Switch to Vigenère, enter key "abc", and verify the shifted output.'
            }
        ]
    };

    // =========================================================================
    // SUPABASE DATABASE SYNC & STORAGE HELPERS
    // =========================================================================

    // Helper: Sync all locked teams from Supabase database into local memory/cache
    const syncLockedTeamsFromSupabase = async () => {
        if (!supabaseClient) {
            console.log('ℹ️ Supabase client not initialized. Using browser localStorage.');
            return;
        }

        try {
            console.log('🕷️ Connecting to Supabase database...');
            const { data, error } = await supabaseClient
                .from('locked_teams')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('⚠️ Supabase sync notice:', error.message);
                return;
            }

            if (data && Array.isArray(data)) {
                const mappedRecords = data.map(item => ({
                    teamName: item.team_name,
                    teamNumber: String(item.team_number).trim(),
                    domain: item.domain,
                    domainName: item.domain_name,
                    problemId: item.problem_id,
                    problemTitle: item.problem_title,
                    problemDesc: item.problem_desc,
                    lockedAt: item.locked_at || item.created_at
                }));

                localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedRecords));
                console.log(`✅ Synced ${mappedRecords.length} locked teams from Supabase.`);
            }
        } catch (err) {
            console.warn('⚠️ Supabase connection error:', err);
        }
    };

    // Helper: Save new locked mission record to Supabase database
    const saveRecordToSupabase = async (record) => {
        if (!supabaseClient) {
            console.log('ℹ️ Supabase credentials not set. Saved to local storage.');
            return { success: true, localOnly: true };
        }

        try {
            console.log('📤 Inserting mission record into Supabase...', record);
            const { data, error } = await supabaseClient
                .from('locked_teams')
                .insert([
                    {
                        team_name: record.teamName,
                        team_number: String(record.teamNumber).trim(),
                        domain: record.domain,
                        domain_name: record.domainName,
                        problem_id: record.problemId,
                        problem_title: record.problemTitle,
                        problem_desc: record.problemDesc,
                        locked_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                console.error('❌ Supabase insert error:', error);
                return { success: false, error };
            }

            console.log('✅ Mission record saved to Supabase table `locked_teams`!');
            return { success: true, data };
        } catch (err) {
            console.error('❌ Failed to save to Supabase:', err);
            return { success: false, error: err };
        }
    };

    // Helper: Retrieve all locked teams from LocalStorage
    const getLockedTeams = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading localStorage:', e);
            return [];
        }
    };

    // Helper: Check if team number is a valid integer between 1 and 175
    const isValidTeamNumber = (val) => {
        if (val === null || val === undefined || val === '') return false;
        const num = Number(val);
        return Number.isInteger(num) && num >= 1 && num <= 175;
    };

    // Helper: Synchronous check from local cache (allowed only 1 time per team number)
    const isTeamNumberLocked = (teamNum) => {
        if (!teamNum) return false;
        const normalizedNum = String(teamNum).trim();
        const lockedList = getLockedTeams();
        const count = lockedList.filter(item => String(item.teamNumber).trim() === normalizedNum).length;
        return count >= 1;
    };

    // Helper: Real-time Live Supabase Database Check (allows exactly 1 selection per team)
    const checkTeamNumberIsTaken = async (teamNum) => {
        if (!teamNum) return false;
        const normalizedNum = String(teamNum).trim();

        // 1. Query Supabase database in real-time with safety timeout
        if (supabaseClient) {
            try {
                const queryPromise = supabaseClient
                    .from('locked_teams')
                    .select('team_number')
                    .eq('team_number', normalizedNum);

                const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 1500));
                const result = await Promise.race([queryPromise, timeoutPromise]);

                if (result && !result.timeout && !result.error && Array.isArray(result.data)) {
                    if (result.data.length >= 1) {
                        return true;
                    }
                    return false;
                }
            } catch (err) {
                console.warn('Real-time database check error:', err);
            }
        }

        // 2. Fallback check from local cache
        return isTeamNumberLocked(normalizedNum);
    };

    // Helper: Show Error on screen
    const showError = (msg) => {
        errorMessage.textContent = msg;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 4000);
    };

    // ============================================
    // SPIDER-MAN SUPERHERO SOUND SYNTHESIZER
    // ============================================
    const playSpideyMissionSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            // 1. Web Whoosh / THWIP! sound (white noise + sweeping bandpass filter)
            const bufferSize = Math.floor(ctx.sampleRate * 0.35);
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3400, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.32);
            filter.Q.setValueAtTime(3.8, ctx.currentTime);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.65, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            whiteNoise.start(ctx.currentTime);

            // 2. Heavy superhero bass punch / impact
            const subOsc = ctx.createOscillator();
            const subGain = ctx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(160, ctx.currentTime + 0.08);
            subOsc.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.55);
            subGain.gain.setValueAtTime(0.75, ctx.currentTime + 0.08);
            subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            subOsc.connect(subGain);
            subGain.connect(ctx.destination);
            subOsc.start(ctx.currentTime + 0.08);
            subOsc.stop(ctx.currentTime + 0.6);

            // 3. Heroic superhero fanfare chord arpeggio
            const fanfareNotes = [
                { freq: 261.63, time: 0.12, dur: 0.3 },
                { freq: 329.63, time: 0.18, dur: 0.3 },
                { freq: 392.00, time: 0.24, dur: 0.35 },
                { freq: 523.25, time: 0.30, dur: 0.5 },
                { freq: 659.25, time: 0.38, dur: 0.7 },
                { freq: 783.99, time: 0.44, dur: 0.9 }
            ];

            fanfareNotes.forEach(note => {
                const osc = ctx.createOscillator();
                const oscGain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

                oscGain.gain.setValueAtTime(0.3, ctx.currentTime + note.time);
                oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

                const osc2 = ctx.createOscillator();
                osc2.type = 'sawtooth';
                osc2.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
                const noteFilter = ctx.createBiquadFilter();
                noteFilter.type = 'lowpass';
                noteFilter.frequency.setValueAtTime(1400, ctx.currentTime + note.time);

                const oscGain2 = ctx.createGain();
                oscGain2.gain.setValueAtTime(0.12, ctx.currentTime + note.time);
                oscGain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

                osc.connect(oscGain);
                oscGain.connect(ctx.destination);
                osc.start(ctx.currentTime + note.time);
                osc.stop(ctx.currentTime + note.time + note.dur);

                osc2.connect(noteFilter);
                noteFilter.connect(oscGain2);
                oscGain2.connect(ctx.destination);
                osc2.start(ctx.currentTime + note.time);
                osc2.stop(ctx.currentTime + note.time + note.dur);
            });

            // 4. Spider-Sense tingling chime
            const chimeTimes = [0.4, 0.48, 0.56, 0.64];
            const chimeFreqs = [1200, 1500, 1800, 2400];
            chimeTimes.forEach((t, idx) => {
                const chimeOsc = ctx.createOscillator();
                const chimeGain = ctx.createGain();
                chimeOsc.type = 'sine';
                chimeOsc.frequency.setValueAtTime(chimeFreqs[idx], ctx.currentTime + t);
                chimeGain.gain.setValueAtTime(0.15, ctx.currentTime + t);
                chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.25);
                chimeOsc.connect(chimeGain);
                chimeGain.connect(ctx.destination);
                chimeOsc.start(ctx.currentTime + t);
                chimeOsc.stop(ctx.currentTime + t + 0.25);
            });

        } catch (e) {
            console.warn('Audio playback not supported or blocked:', e);
        }
    };

    // Accept Mission / Indian Spider-Man Reveal Sound
    const playAcceptMissionSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const notes = [
                { freq: 293.66, time: 0.0, dur: 0.25 },
                { freq: 369.99, time: 0.1, dur: 0.25 },
                { freq: 440.00, time: 0.2, dur: 0.3 },
                { freq: 587.33, time: 0.3, dur: 0.6 }
            ];

            notes.forEach(n => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);

                gain.gain.setValueAtTime(0.3, ctx.currentTime + n.time);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + n.time);
                osc.stop(ctx.currentTime + n.time + n.dur);
            });
        } catch (e) {
            console.warn('Audio playback error:', e);
        }
    };

    // Mission Finalize Sound
    const playMissionLockedSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36);

            gain.gain.setValueAtTime(0.35, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.9);
        } catch (e) {
            console.warn('Audio playback error:', e);
        }
    };

    // =========================================================================
    // AUDIO SYSTEM: PRELOADED ZERO-LATENCY ENGINE WITH BUFFER LOCKING
    // =========================================================================
    let spiderSenseAudio = null;
    try {
        spiderSenseAudio = new Audio('spidersense_ultmt.mp3');
        spiderSenseAudio.preload = 'auto';
        spiderSenseAudio.volume = 0.95;
        spiderSenseAudio.load();
    } catch (e) {
        console.warn('Spider-Sense audio preload error:', e);
    }

    const playSpiderSenseSound = () => {
        try {
            if (spiderSenseAudio) {
                spiderSenseAudio.currentTime = 0;
                spiderSenseAudio.volume = 0.95;
                const playPromise = spiderSenseAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.log('Spider-sense audio fallback:', err);
                        playSpideyMissionSound();
                    });
                }
            } else {
                playSpideyMissionSound();
            }
        } catch (e) {
            console.warn('Spider-sense audio play error:', e);
            playSpideyMissionSound();
        }
    };

    // Background 8-Bit Spider-Man Theme Music Manager
    const bgAudio = document.getElementById('spidey-theme-music') || new Audio('spider_man_theme_8_bit.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgAudio.preload = 'auto';

    let isLoadingScreenActive = false;
    let isBgPlayPending = false;

    const playBgMusic = () => {
        if (isLoadingScreenActive) return;
        if (!bgAudio.paused && !bgAudio.muted) return;
        if (isBgPlayPending) return;

        isBgPlayPending = true;
        bgAudio.muted = false;
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isBgPlayPending = false;
            }).catch(() => {
                isBgPlayPending = false;
                if (!isLoadingScreenActive && bgAudio.paused) {
                    bgAudio.muted = true;
                    bgAudio.play().catch(() => {});
                }
            });
        } else {
            isBgPlayPending = false;
        }
    };

    const pauseBgMusic = () => {
        isBgPlayPending = false;
        bgAudio.pause();
    };

    const unlockUserAudio = () => {
        if (isLoadingScreenActive) return;
        bgAudio.muted = false;
        if (bgAudio.paused) {
            playBgMusic();
        }
        const unlockEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
        unlockEvents.forEach(evt => {
            window.removeEventListener(evt, unlockUserAudio, { capture: true });
            document.removeEventListener(evt, unlockUserAudio, { capture: true });
        });
    };

    const unlockEvents = ['pointerdown', 'touchstart', 'mousedown', 'keydown', 'click'];
    unlockEvents.forEach(evt => {
        window.addEventListener(evt, unlockUserAudio, { capture: true, passive: true });
        document.addEventListener(evt, unlockUserAudio, { capture: true, passive: true });
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !isLoadingScreenActive && bgAudio.paused) {
            playBgMusic();
        }
    });

    playBgMusic();

    // Real-time Live Debounced Validation for Team Number
    let teamNumberDebounceTimer = null;
    teamNumberInput.addEventListener('input', () => {
        const val = teamNumberInput.value.trim();
        if (!val) {
            errorMessage.classList.remove('show');
            return;
        }

        if (!isValidTeamNumber(val)) {
            showError('INVALID');
            return;
        }

        clearTimeout(teamNumberDebounceTimer);
        teamNumberDebounceTimer = setTimeout(async () => {
            const isTaken = await checkTeamNumberIsTaken(val);
            if (isTaken) {
                showError('INVALID');
            } else {
                errorMessage.classList.remove('show');
            }
        }, 250);
    });

    // Generate ONE random extra-credit add-on directive with Spider-Sense Loading Screen
    const generateCards = async () => {
        try {
            const teamName = teamNameInput.value.trim();
            const rawTeamNumber = teamNumberInput.value.trim();
            const category = categorySelect.value;

            if (!teamName) {
                showError('Please enter your team name.');
                teamNameInput.focus();
                return;
            }

            if (!rawTeamNumber || !isValidTeamNumber(rawTeamNumber)) {
                showError('INVALID');
                teamNumberInput.focus();
                return;
            }

            const teamNumber = String(Number(rawTeamNumber));

            // Real-time check if team number has already locked an add-on (1 selection limit)
            generateBtn.disabled = true;
            let isTaken = false;
            try {
                isTaken = await checkTeamNumberIsTaken(teamNumber);
            } catch (checkErr) {
                console.warn('Team check error:', checkErr);
            } finally {
                generateBtn.disabled = false;
            }

            if (isTaken) {
                showError('INVALID');
                teamNumberInput.focus();
                return;
            }

            if (!category) {
                showError('Please select a hackathon theme.');
                categorySelect.focus();
                return;
            }

            const categoryProblems = problemDatabase[category];
            if (!categoryProblems || categoryProblems.length === 0) {
                showError('System Error: Theme data inaccessible.');
                return;
            }

            // Reset respin counter for newly spun session
            state.respinCount = 0;

            const randomIndex = Math.floor(Math.random() * categoryProblems.length);
            const picked = categoryProblems[randomIndex];
            state.teamName = teamName;
            state.teamNumber = teamNumber;
            state.category = category;
            state.currentCards = [picked];
            state.selectedCardId = picked.id;

            const fullDomainName = categorySelect.options[categorySelect.selectedIndex].text;

            if (errorMessage) errorMessage.textContent = '';

            isLoadingScreenActive = true;
            pauseBgMusic();

            // Display Cinematic Spider-Sense Loading Screen (6 seconds duration)
            if (spideyLoadingScreen) {
                spideyLoadingScreen.classList.remove('hidden');
                spideyLoadingScreen.classList.remove('fade-out');

                if (loadingTargetText) {
                    loadingTargetText.textContent = `SPINNING ADD-ON FOR ${teamName.toUpperCase()} (#${teamNumber}) • THEME: ${fullDomainName.toUpperCase()}`;
                }

                if (loadingStatusQuote) {
                    loadingStatusQuote.textContent = '🕷️ DETECTING SPIDER-SENSE NEURAL HARMONICS...';
                    
                    setTimeout(() => {
                        if (loadingStatusQuote) loadingStatusQuote.textContent = '🌐 CONNECTING TO MULTIVERSE FEATURE MATRIX...';
                    }, 1400);

                    setTimeout(() => {
                        if (loadingStatusQuote) loadingStatusQuote.textContent = `⚡ SCANNING EXTRA-CREDIT ADD-ONS FOR ${fullDomainName.toUpperCase()}...`;
                    }, 2800);

                    setTimeout(() => {
                        if (loadingStatusQuote) loadingStatusQuote.textContent = '🧬 SYNTHESIZING FEATURE SPECIFICATION & CRITERIA...';
                    }, 4200);

                    setTimeout(() => {
                        if (loadingStatusQuote) loadingStatusQuote.textContent = '🎯 TARGET ADD-ON ACQUIRED! PREPARING DOSSIER...';
                    }, 5300);
                }

                if (loadingProgressBar) {
                    loadingProgressBar.style.transition = 'none';
                    loadingProgressBar.style.width = '0%';
                    setTimeout(() => {
                        if (loadingProgressBar) {
                            loadingProgressBar.style.transition = 'width 5.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                            loadingProgressBar.style.width = '100%';
                        }
                    }, 50);
                }
            }

            playSpiderSenseSound();

            // Reveal directives after 6 seconds cinematic sequence
            setTimeout(() => {
                displayTeamName.textContent = state.teamName + ' (Team #' + state.teamNumber + ')';

                const dossierTeamName = document.getElementById('dossier-team-name');
                const dossierTeamNumber = document.getElementById('dossier-team-number');
                const dossierDomain = document.getElementById('dossier-domain');
                const dossierStatus = document.getElementById('dossier-status');

                if (dossierTeamName) dossierTeamName.textContent = state.teamName;
                if (dossierTeamNumber) dossierTeamNumber.textContent = '#' + state.teamNumber;
                if (dossierDomain) dossierDomain.textContent = fullDomainName;
                if (dossierStatus) dossierStatus.textContent = 'READY FOR ACCEPTANCE';

                configPanel.classList.add('hidden');
                resultsArea.classList.remove('hidden');
                actionFooter.classList.remove('hidden');
                confirmBtn.disabled = false;

                renderCard();
                updateRespinButtonUI();

                if (spideyLoadingScreen) {
                    spideyLoadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        spideyLoadingScreen.classList.add('hidden');
                        spideyLoadingScreen.classList.remove('fade-out');
                        if (loadingProgressBar) {
                            loadingProgressBar.style.transition = 'none';
                            loadingProgressBar.style.width = '0%';
                        }
                    }, 400);
                }

                isLoadingScreenActive = false;
                playBgMusic();

                resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 6000);
        } catch (err) {
            console.error('Error during generateCards:', err);
            generateBtn.disabled = false;
            showError('Error generating add-on directive. Please try again.');
        }
    };

    // Helper: Update Respin Button State & Counter (3 max respins before acceptance)
    const updateRespinButtonUI = () => {
        if (!respinBtn || !respinBtnText) return;
        const remaining = state.maxRespins - state.respinCount;
        if (remaining > 0) {
            respinBtn.disabled = false;
            respinBtnText.textContent = `RESPIN ADD-ON (${remaining} LEFT)`;
        } else {
            respinBtn.disabled = true;
            respinBtnText.textContent = 'NO RESPINS LEFT (0/3)';
        }
    };

    // Re-spin directive up to 3 times before accepting mission
    const respinCard = () => {
        if (state.respinCount >= state.maxRespins) {
            return;
        }

        const categoryProblems = problemDatabase[state.category];
        if (!categoryProblems || categoryProblems.length === 0) return;

        state.respinCount++;
        updateRespinButtonUI();

        const available = categoryProblems.filter(p => p.id !== state.selectedCardId);
        const pool = available.length > 0 ? available : categoryProblems;
        const randomIndex = Math.floor(Math.random() * pool.length);
        const picked = pool[randomIndex];

        state.currentCards = [picked];
        state.selectedCardId = picked.id;

        const fullDomainName = categorySelect.options[categorySelect.selectedIndex].text;

        isLoadingScreenActive = true;
        pauseBgMusic();

        if (spideyLoadingScreen) {
            spideyLoadingScreen.classList.remove('hidden');
            spideyLoadingScreen.classList.remove('fade-out');

            if (loadingTargetText) {
                loadingTargetText.textContent = `RESPINNING ADD-ON (${state.respinCount}/3) FOR ${state.teamName.toUpperCase()} (#${state.teamNumber}) • THEME: ${fullDomainName.toUpperCase()}`;
            }

            if (loadingStatusQuote) {
                loadingStatusQuote.textContent = `🕷️ RE-SPINNING ADD-ON DIRECTIVE (${state.respinCount}/3)...`;

                setTimeout(() => {
                    if (loadingStatusQuote) loadingStatusQuote.textContent = '🌐 ACCESSING ALTERNATE TIMELINE IN MULTIVERSE...';
                }, 1100);

                setTimeout(() => {
                    if (loadingStatusQuote) loadingStatusQuote.textContent = '🎯 TARGET ADD-ON RE-ACQUIRED!';
                }, 2100);
            }

            if (loadingProgressBar) {
                loadingProgressBar.style.transition = 'none';
                loadingProgressBar.style.width = '0%';
                setTimeout(() => {
                    if (loadingProgressBar) {
                        loadingProgressBar.style.transition = 'width 2.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
                        loadingProgressBar.style.width = '100%';
                    }
                }, 50);
            }
        }

        playSpiderSenseSound();

        setTimeout(() => {
            renderCard();

            if (spideyLoadingScreen) {
                spideyLoadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    spideyLoadingScreen.classList.add('hidden');
                    spideyLoadingScreen.classList.remove('fade-out');
                    if (loadingProgressBar) {
                        loadingProgressBar.style.transition = 'none';
                        loadingProgressBar.style.width = '0%';
                    }
                }, 400);
            }

            isLoadingScreenActive = false;
            playBgMusic();

            resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 3000);
    };

    // Render the single assigned extra-credit add-on card
    const renderCard = () => {
        cardsContainer.innerHTML = '';

        const card = state.currentCards[0];
        if (!card) return;

        const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

        const cardEl = document.createElement('div');
        cardEl.className = 'problem-card';
        cardEl.dataset.id = card.id;
        cardEl.innerHTML = `
            <div class="card-top-bar">
                <div class="card-badge">${categoryName}</div>
                <div class="assigned-team-chip">🕷️ Team #${state.teamNumber} • ${state.teamName}</div>
            </div>

            <div class="addon-header-strip">
                <span class="addon-tag-pill">✨ EXTRA-CREDIT ADD-ON DIRECTIVE</span>
                <span class="directive-code">${card.id.toUpperCase()}</span>
            </div>

            <h3 class="card-title">${card.title}</h3>

            <div class="addon-detail-block concept-block">
                <div class="addon-block-title">
                    <span class="block-icon">💡</span> CONCEPT & OBJECTIVE
                </div>
                <p class="addon-block-text">${card.concept || card.desc || ''}</p>
            </div>

            <div class="addon-detail-block why-block">
                <div class="addon-block-title">
                    <span class="block-icon">🚀</span> WHY IT FITS ANY PROJECT
                </div>
                <p class="addon-block-text">${card.whyFits || 'Universal plug-and-play enhancement for web, mobile, or desktop applications.'}</p>
            </div>

            <div class="addon-grid-boxes">
                <div class="addon-box impl-box">
                    <div class="addon-box-label">
                        <span class="box-icon">⚡</span> RECOMMENDED IMPLEMENTATION
                    </div>
                    <div class="addon-box-content">
                        <code>${card.implementation || 'Follow standard framework best practices.'}</code>
                    </div>
                </div>
                <div class="addon-box verify-box">
                    <div class="addon-box-label">
                        <span class="box-icon">🎯</span> HOW TO VERIFY
                    </div>
                    <div class="addon-box-content">
                        ${card.verification || 'Demonstrate feature in live application.'}
                    </div>
                </div>
            </div>

            <div class="card-meta">
                <span>Extra-Credit Feature</span>
                <span>STATUS: ASSIGNED</span>
            </div>
        `;

        cardsContainer.appendChild(cardEl);
    };

    // Confirm Selection - Opens Modal
    const confirmSelection = () => {
        if (!state.selectedCardId) return;

        const selectedCard = state.currentCards.find(c => c.id === state.selectedCardId);
        const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

        lockedTeam.textContent = state.teamName;
        lockedTeamNumber.textContent = '#' + state.teamNumber;
        lockedDomain.textContent = categoryName;

        lockedProblem.innerHTML = `
            <div class="locked-badge-pill">EXTRA-CREDIT ADD-ON • ${selectedCard.id.toUpperCase()}</div>
            <div class="locked-title">${selectedCard.title}</div>
            <div class="locked-desc">${selectedCard.concept || selectedCard.desc || ''}</div>
            <div class="locked-verify-summary">
                <strong>🎯 Verification Target:</strong> ${selectedCard.verification || ''}
            </div>
        `;

        playAcceptMissionSound();
        successModal.classList.remove('hidden');
    };

    // Cancel modal
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }

    // Finalize and Lock Mission
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', async () => {
            if (!state.selectedCardId) return;

            finalizeBtn.disabled = true;
            finalizeBtn.textContent = 'CHECKING DATABASE...';

            const isTaken = await checkTeamNumberIsTaken(state.teamNumber);
            if (isTaken) {
                alert(`⛔ INVALID`);
                finalizeBtn.disabled = false;
                finalizeBtn.textContent = 'LOCK & FINALIZE';
                successModal.classList.add('hidden');
                location.reload();
                return;
            }

            const selectedCard = state.currentCards.find(c => c.id === state.selectedCardId);
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

            finalizeBtn.textContent = 'SAVING TO DATABASE...';
            playMissionLockedSound();

            const newRecord = {
                teamName: state.teamName,
                teamNumber: String(state.teamNumber).trim(),
                domain: state.category,
                domainName: categoryName,
                problemId: selectedCard.id,
                problemTitle: selectedCard.title,
                problemDesc: `${selectedCard.concept || ''} | Verification: ${selectedCard.verification || ''}`,
                lockedAt: new Date().toLocaleString()
            };

            // 1. Persist to Supabase Database
            const saveResult = await saveRecordToSupabase(newRecord);
            if (!saveResult.success && saveResult.error && (saveResult.error.code === '23505' || saveResult.error.message.includes('unique'))) {
                alert(`⛔ INVALID`);
                location.reload();
                return;
            }

            // 2. Update local cache
            const lockedList = getLockedTeams();
            lockedList.push(newRecord);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lockedList));

            finalizeBtn.textContent = 'LOCKED & SAVED!';
            finalizeBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            setTimeout(() => {
                alert(`🕷️ ADD-ON DIRECTIVE LOCKED & RECORDED!\n\nTeam #${state.teamNumber} (${state.teamName}) is officially assigned to Add-On: "${selectedCard.title}".\n\nSaved to database!`);
                location.reload();
            }, 600);
        });
    }

    // Initialize Supabase sync on startup
    syncLockedTeamsFromSupabase();

    // Event Listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', generateCards);
    }

    if (teamNameInput) {
        teamNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') teamNumberInput.focus();
        });
    }

    if (teamNumberInput) {
        teamNumberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') categorySelect.focus();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') generateCards();
        });
    }

    if (respinBtn) {
        respinBtn.addEventListener('click', respinCard);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmSelection);
    }

    // Console utilities for testing or administrative reset if needed
    window.cypherverse = {
        getLockedTeams: () => getLockedTeams(),
        clearLocalCache: () => {
            localStorage.removeItem(STORAGE_KEY);
            console.log('🧹 Local cache cleared.');
        },
        checkTeamNumber: async (num) => {
            const taken = await checkTeamNumberIsTaken(num);
            console.log(`Team #${num} taken:`, taken);
            return taken;
        }
    };
});