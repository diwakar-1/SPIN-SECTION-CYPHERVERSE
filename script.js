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
    // Replace with your project details from the Supabase Dashboard:
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
        currentCards: []
    };

    // Database of problem statements by category (11 Domains)
    const problemDatabase = {
        aiml: [
            { id: 'ai-1', title: 'Predictive Resource Allocation', desc: 'Develop an ML model that optimizes cloud computing resource allocation in real-time based on traffic patterns to reduce energy consumption.' },
            { id: 'ai-2', title: 'Deepfake Detection System', desc: 'Create a lightweight inference engine capable of detecting AI-generated media (video/audio) using localized edge computing.' },
            { id: 'ai-3', title: 'Generative UI Synthesizer', desc: 'Train a model to generate fully functional, accessible user interfaces based on natural language descriptions and wireframe sketches.' },
            { id: 'ai-4', title: 'Automated Code Review Assistant', desc: 'Build an LLM-powered tool that analyzes pull requests not just for syntax, but for architectural flaws and security vulnerabilities.' },
            { id: 'ai-5', title: 'Personalized Health Sentinel', desc: 'Develop an algorithm that analyzes wearable data patterns to predict potential health anomalies before they become critical.' },
            { id: 'ai-6', title: 'Smart Urban Traffic Orchestrator', desc: 'Implement reinforcement learning to optimize traffic light patterns in a simulated city environment, prioritizing emergency vehicles.' },
            { id: 'ai-7', title: 'Sentiment-Aware Customer Agent', desc: 'Create a conversational AI that adjusts its tone, empathy, and response strategies based on the real-time emotional state of the user.' },
            { id: 'ai-8', title: 'Supply Chain Anomaly Detector', desc: 'Build a forecast model that identifies potential logistical bottlenecks by analyzing global news events, weather patterns, and shipping data.' }
        ],
        agentic: [
            { id: 'ag-1', title: 'Autonomous Dev Environment', desc: 'Create an agentic system that can read a GitHub issue, write the code, run tests, and open a PR without human intervention.' },
            { id: 'ag-2', title: 'Multi-Agent Negotiation Protocol', desc: 'Develop a framework where specialized AI agents negotiate resource sharing (like API rate limits) through a consensus mechanism.' },
            { id: 'ag-3', title: 'Self-Healing Infrastructure', desc: 'Build agents capable of monitoring server health, diagnosing root causes of failures, and autonomously applying mitigation scripts.' },
            { id: 'ag-4', title: 'Automated Market Researcher', desc: 'Design an agent that scrapes competitor data, analyzes market trends, and outputs a synthesized strategy report weekly.' },
            { id: 'ag-5', title: 'Personal Knowledge Librarian', desc: 'Create an autonomous agent that organizes disorganized notes, categorizes links, and proactively suggests connections between concepts.' },
            { id: 'ag-6', title: 'Cyber-Defense Swarm', desc: 'Implement a swarm of lightweight agents that patrol a network simulation, hunting for anomalies and autonomously isolating compromised nodes.' },
            { id: 'ag-7', title: 'Agentic Workflow Orchestrator', desc: 'Build a visual platform for chaining specialized LLM agents together to accomplish complex, multi-step enterprise workflows.' },
            { id: 'ag-8', title: 'Continuous Compliance Checker', desc: 'Develop an agent that continuously scans codebases and infrastructure configurations against changing regulatory compliance standards (GDPR, HIPAA).' }
        ],
        cybersecurity: [
            { id: 'cy-1', title: 'Zero-Trust Network Simulator', desc: 'Develop a proof-of-concept environment demonstrating strict zero-trust principles applied down to the microservice level.' },
            { id: 'cy-2', title: 'Ransomware Containment Sandbox', desc: 'Build a honeypot system that rapidly detects encryption-like behavior and instantly sandboxes the offending process.' },
            { id: 'cy-3', title: 'Post-Quantum Cryptography Bridge', desc: 'Create a migration tool designed to upgrade legacy cryptographic protocols to NIST-approved post-quantum standards.' },
            { id: 'cy-4', title: 'Phishing Threat Correlator', desc: 'Develop an engine that analyzes email headers, body content, and links to build graph relationships of coordinated phishing campaigns.' },
            { id: 'cy-5', title: 'IoT Device Identity Ledger', desc: 'Implement a decentralized or cryptographic identity management system specifically designed to authenticate millions of low-power IoT devices.' },
            { id: 'cy-6', title: 'Automated Pen-Testing Engine', desc: 'Build a tool that maps attack surfaces and safely executes benign exploits to generate actionable remediation reports.' },
            { id: 'cy-7', title: 'Biometric Spoofing Defender', desc: 'Create a computer vision pipeline capable of distinguishing between live human traits and deepfake/physical mask spoofing attempts.' },
            { id: 'cy-8', title: 'Privacy-Preserving Threat Intel', desc: 'Develop a mechanism for competing organizations to share actionable threat intelligence without revealing sensitive internal network structures.' }
        ],
        web3: [
            { id: 'w3-1', title: 'Cross-Chain Asset Bridge', desc: 'Develop a secure protocol for transferring digital assets across incompatible blockchain networks using atomic swaps.' },
            { id: 'w3-2', title: 'Decentralized Data Marketplace', desc: 'Build a smart contract platform where users can monetize their personal data while maintaining cryptographic ownership.' },
            { id: 'w3-3', title: 'DAO Governance Aggregator', desc: 'Create a unified dashboard allowing users to track proposals, manage voting power, and execute logic across multiple DAOs simultaneously.' },
            { id: 'w3-4', title: 'Zero-Knowledge Proof Identity Verification', desc: 'Implement a KYC system that allows users to prove attributes (like age or citizenship) without revealing their actual identity.' },
            { id: 'w3-5', title: 'Smart Contract Vulnerability Scanner', desc: 'Develop a static analysis tool that detects common logic flaws and reentrancy vulnerabilities in Solidity/Rust contracts.' },
            { id: 'w3-6', title: 'Tokenized Green Energy Grid', desc: 'Build a system for tokenizing solar/wind energy production, allowing peers to trade energy credits on a micro-grid.' },
            { id: 'w3-7', title: 'Decentralized Storage Node Optimizer', desc: 'Create an algorithm to optimize file sharding and retrieval latency across IPFS or similar decentralized file networks.' },
            { id: 'w3-8', title: 'NFT Proof of Authorship', desc: 'Develop a standard for binding digital signatures of code commits or academic papers to non-fungible tokens to prove original authorship.' }
        ],
        sustainability: [
            { id: 'su-1', title: 'Carbon Footprint API', desc: 'Develop an easily integrable API that calculates the real-time carbon cost of computational workloads running in datacenters.' },
            { id: 'su-2', title: 'Supply Chain Waste Optimizer', desc: 'Build a predictive model identifying inefficient routing in cold-chain logistics to minimize perishable food waste.' },
            { id: 'su-3', title: 'Smart Grid Demand Balancer', desc: 'Create simulation software that incentivizes consumers to shift power usage to times of peak renewable generation.' },
            { id: 'su-4', title: 'Circular Economy Material Tracker', desc: 'Implement a ledger system tracking electronic components from manufacturing to end-of-life to facilitate efficient recycling.' },
            { id: 'su-5', title: 'Precision Agriculture AI', desc: 'Develop computer vision models analyzing drone imagery to apply water and fertilizer only to specific plants that require it.' },
            { id: 'su-6', title: 'Urban Heat Island Analyzer', desc: 'Build a tool using satellite data to identify urban heat islands and propose optimal locations for green infrastructure (trees, green roofs).' },
            { id: 'su-7', title: 'Water Quality Sensor Dashboard', desc: 'Create an IoT platform aggregating low-cost sensor data to map micro-pollutants in local river systems in real-time.' },
            { id: 'su-8', title: 'Sustainable Routing Algorithm', desc: 'Develop a navigation API that calculates routes optimized for lowest fuel consumption / battery usage rather than strictly shortest time.' }
        ],
        fintech: [
            { id: 'ft-1', title: 'Real-Time Fraud Detection System', desc: 'Build a machine learning system that analyzes transaction patterns to detect and prevent financial fraud in real-time.' },
            { id: 'ft-2', title: 'Micro-Lending Platform', desc: 'Create a decentralized platform connecting lenders with borrowers in underserved communities using alternative credit scoring.' },
            { id: 'ft-3', title: 'Automated Budget Optimizer', desc: 'Develop an AI-powered personal finance app that automatically categorizes expenses and suggests optimization strategies.' },
            { id: 'ft-4', title: 'Blockchain Settlement System', desc: 'Build a fast, low-cost cross-border payment system using blockchain technology for instant settlement.' },
            { id: 'ft-5', title: 'Robo-Advisory Platform', desc: 'Create an automated investment platform that provides personalized financial advice based on risk tolerance and goals.' },
            { id: 'ft-6', title: 'Invoice Factoring Marketplace', desc: 'Develop a P2P marketplace where businesses can sell outstanding invoices to investors for immediate cash flow.' },
            { id: 'ft-7', title: 'Credit Risk Assessment Tool', desc: 'Build an alternative credit scoring model using non-traditional data sources for underserved populations.' },
            { id: 'ft-8', title: 'Digital Wallet Integration', desc: 'Create a unified API that connects multiple payment providers and digital wallets for seamless transactions.' }
        ],
        healthtech: [
            { id: 'ht-1', title: 'AI Diagnostic Assistant', desc: 'Develop an AI system that analyzes medical images and patient data to assist doctors in diagnosing diseases earlier.' },
            { id: 'ht-2', title: 'Telemedicine Platform', desc: 'Build a comprehensive telehealth platform connecting patients with healthcare providers for remote consultations.' },
            { id: 'ht-3', title: 'Mental Health Chatbot', desc: 'Create an empathetic AI chatbot that provides mental health support and resources while maintaining privacy.' },
            { id: 'ht-4', title: 'Medication Adherence Tracker', desc: 'Develop a smart system that monitors patient medication adherence and provides timely reminders and alerts.' },
            { id: 'ht-5', title: 'Electronic Health Records Manager', desc: 'Build a secure, interoperable system for managing and sharing patient medical records across providers.' },
            { id: 'ht-6', title: 'Wearable Health Monitor', desc: 'Create an IoT platform that aggregates data from wearable devices to provide real-time health insights.' },
            { id: 'ht-7', title: 'Medical Supply Chain Tracker', desc: 'Develop a blockchain-based system to track pharmaceuticals from manufacturer to patient to prevent counterfeiting.' },
            { id: 'ht-8', title: 'Rehabilitation Progress Tracker', desc: 'Build an app that helps patients track and visualize their recovery progress after injuries or surgeries.' }
        ],
        smartcities: [
            { id: 'sc-1', title: 'Intelligent Traffic Management', desc: 'Develop an AI-powered system that optimizes traffic flow in real-time using sensor data and predictive analytics.' },
            { id: 'sc-2', title: 'Smart Parking Solution', desc: 'Create a platform that uses IoT sensors to guide drivers to available parking spots and enables automated payments.' },
            { id: 'sc-3', title: 'Public Safety Monitor', desc: 'Build a system that analyzes camera feeds and sensor data to detect emergencies and coordinate first responders.' },
            { id: 'sc-4', title: 'Energy Grid Optimizer', desc: 'Develop a smart grid system that balances energy consumption and integrates renewable sources efficiently.' },
            { id: 'sc-5', title: 'Waste Management System', desc: 'Create an IoT-enabled waste collection system that optimizes routes and monitors fill levels in real-time.' },
            { id: 'sc-6', title: 'Air Quality Monitor', desc: 'Build a network of sensors to monitor and predict air quality across the city with public dashboards.' },
            { id: 'sc-7', title: 'Digital Twin City Planner', desc: 'Develop a 3D simulation platform for urban planning and testing infrastructure changes virtually.' },
            { id: 'sc-8', title: 'Smart Public Transit', desc: 'Create an integrated platform that optimizes public transportation schedules based on demand and traffic conditions.' }
        ],
        education: [
            { id: 'ed-1', title: 'Personalized Learning Platform', desc: 'Build an AI-driven platform that adapts curriculum and teaching methods to individual student learning styles.' },
            { id: 'ed-2', title: 'Virtual Classroom System', desc: 'Create an immersive online education platform with virtual reality classrooms and interactive learning tools.' },
            { id: 'ed-3', title: 'Automated Grading Assistant', desc: 'Develop an AI system that can grade assignments and provide constructive feedback to students instantly.' },
            { id: 'ed-4', title: 'Skill Assessment Platform', desc: 'Build a platform that assesses and validates professional skills through practical tests and projects.' },
            { id: 'ed-5', title: 'Language Learning App', desc: 'Create an intelligent language learning application with speech recognition and personalized lesson plans.' },
            { id: 'ed-6', title: 'Educational Resource Marketplace', desc: 'Develop a platform where educators can share and monetize teaching materials and courses.' },
            { id: 'ed-7', title: 'Student Performance Analytics', desc: 'Build a dashboard that tracks student progress and identifies learning gaps with intervention recommendations.' },
            { id: 'ed-8', title: 'Collaborative Study Platform', desc: 'Create a virtual study environment where students can collaborate on projects and share knowledge.' }
        ],
        devtools: [
            { id: 'dt-1', title: 'AI Code Assistant', desc: 'Build an AI-powered development assistant that suggests code completions, refactoring, and bug fixes in real-time.' },
            { id: 'dt-2', title: 'Automated Testing Platform', desc: 'Create a system that automatically generates and executes tests based on code changes and requirements.' },
            { id: 'dt-3', title: 'DevOps Pipeline Optimizer', desc: 'Develop an intelligent CI/CD pipeline that optimizes build processes and deployment strategies.' },
            { id: 'dt-4', title: 'Code Review Automation', desc: 'Build a tool that automates code review processes, checking for quality, security, and best practices.' },
            { id: 'dt-5', title: 'Documentation Generator', desc: 'Create an AI system that automatically generates and maintains technical documentation from code.' },
            { id: 'dt-6', title: 'Performance Profiler', desc: 'Develop a tool that identifies performance bottlenecks in applications and suggests optimization strategies.' },
            { id: 'dt-7', title: 'Collaboration Platform', desc: 'Build a unified platform for team collaboration, code sharing, and project management.' },
            { id: 'dt-8', title: 'API Testing Suite', desc: 'Create a comprehensive tool for automated API testing, monitoring, and documentation.' }
        ],
        socialimpact: [
            { id: 'si-1', title: 'Accessibility Assistant', desc: 'Develop an AI-powered tool that makes digital content accessible to people with disabilities automatically.' },
            { id: 'si-2', title: 'Rural Development Platform', desc: 'Build a platform connecting rural communities with resources, markets, and government services.' },
            { id: 'si-3', title: 'Mental Health Support Network', desc: 'Create a peer-to-peer mental health support platform with professional oversight and resources.' },
            { id: 'si-4', title: 'Food Distribution Optimizer', desc: 'Develop a system that optimizes food bank distribution to reduce waste and serve more people efficiently.' },
            { id: 'si-5', title: 'Education Access Portal', desc: 'Build a platform that provides free educational resources and mentorship to underserved communities.' },
            { id: 'si-6', title: 'Disaster Response Coordinator', desc: 'Create a system that coordinates volunteer efforts and resource distribution during natural disasters.' },
            { id: 'si-7', title: 'Inclusive Employment Platform', desc: 'Develop a job platform specifically designed to help people with disabilities find inclusive employers.' },
            { id: 'si-8', title: 'Community Engagement Tool', desc: 'Build a platform that facilitates community organizing, civic participation, and local governance.' }
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

    // Helper: Synchronous check from local cache (allowed up to 4 times per team number)
    const isTeamNumberLocked = (teamNum) => {
        if (!teamNum) return false;
        const normalizedNum = String(teamNum).trim();
        const lockedList = getLockedTeams();
        const count = lockedList.filter(item => String(item.teamNumber).trim() === normalizedNum).length;
        return count >= 4;
    };

    // Helper: Real-time Live Supabase Database Check (allows up to 4 selections)
    const checkTeamNumberIsTaken = async (teamNum) => {
        if (!teamNum) return false;
        const normalizedNum = String(teamNum).trim();

        // 1. Query Supabase database in real-time
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('locked_teams')
                    .select('team_number')
                    .eq('team_number', normalizedNum);

                if (!error && data && Array.isArray(data)) {
                    if (data.length >= 4) {
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

            // 3. Heroic superhero fanfare chord arpeggio (C4 -> E4 -> G4 -> C5 -> E5 -> G5)
            const fanfareNotes = [
                { freq: 261.63, time: 0.12, dur: 0.3 }, // C4
                { freq: 329.63, time: 0.18, dur: 0.3 }, // E4
                { freq: 392.00, time: 0.24, dur: 0.35 }, // G4
                { freq: 523.25, time: 0.30, dur: 0.5 }, // C5
                { freq: 659.25, time: 0.38, dur: 0.7 }, // E5
                { freq: 783.99, time: 0.44, dur: 0.9 } // G5 High Heroic
            ];

            fanfareNotes.forEach(note => {
                const osc = ctx.createOscillator();
                const oscGain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

                oscGain.gain.setValueAtTime(0.3, ctx.currentTime + note.time);
                oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.dur);

                // Shimmer harmonic
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

            // Indian Spider-Man superhero fanfare flourish
            const notes = [
                { freq: 293.66, time: 0.0, dur: 0.25 },  // D4
                { freq: 369.99, time: 0.1, dur: 0.25 },  // F#4
                { freq: 440.00, time: 0.2, dur: 0.3 },   // A4
                { freq: 587.33, time: 0.3, dur: 0.6 }    // D5 (heroic high resonance)
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

            // Lock click + triumphant chime
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36); // C6

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
    
    // Dedicated Preloaded Spider-Sense Audio Instance (buffered into memory immediately)
    let spiderSenseAudio = null;
    try {
        spiderSenseAudio = new Audio('spidersense_ultmt.mp3');
        spiderSenseAudio.preload = 'auto';
        spiderSenseAudio.volume = 0.95;
        spiderSenseAudio.load();
    } catch (e) {
        console.warn('Spider-Sense audio preload error:', e);
    }

    // Spider-Sense Audio Effect (Plays preloaded spidersense_ultmt.mp3 with zero buffer hitching)
    const playSpiderSenseSound = () => {
        try {
            if (spiderSenseAudio) {
                spiderSenseAudio.currentTime = 0;
                spiderSenseAudio.volume = 0.95;
                const playPromise = spiderSenseAudio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.log('Spider-sense audio fallback:', err);
                        playSpideyMissionSound(); // Web audio synth fallback
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
                // If browser autoplay policy blocks unmuted audio on start, start muted stream
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

    // User Gesture Audio Unlocker (Clean, runs once on user interaction to unmute and start playback smoothly)
    const unlockUserAudio = () => {
        if (isLoadingScreenActive) return;
        bgAudio.muted = false;
        if (bgAudio.paused) {
            playBgMusic();
        }
        // Once unmuted, remove one-time interaction listeners to prevent continuous event overhead & buffering
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

    // Attempt initial zero-delay playback
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
            showError('INVALID: Team number must be between 1 and 175.');
            return;
        }

        clearTimeout(teamNumberDebounceTimer);
        teamNumberDebounceTimer = setTimeout(async () => {
            const isTaken = await checkTeamNumberIsTaken(val);
            if (isTaken) {
                showError(`INVALID: Team Number ${val} is unavailable.`);
            } else {
                errorMessage.classList.remove('show');
            }
        }, 250);
    });

    // Generate ONE random mission directive with Spider-Sense Loading Screen
    const generateCards = async () => {
        const teamName = teamNameInput.value.trim();
        const rawTeamNumber = teamNumberInput.value.trim();
        const category = categorySelect.value;

        if (!teamName) {
            showError('Please enter your team name.');
            teamNameInput.focus();
            return;
        }

        if (!rawTeamNumber || !isValidTeamNumber(rawTeamNumber)) {
            showError('INVALID: Team number must be between 1 and 175.');
            teamNumberInput.focus();
            return;
        }

        const teamNumber = String(Number(rawTeamNumber));

        // Real-time check if team number reached maximum 4 choices
        generateBtn.disabled = true;
        const isTaken = await checkTeamNumberIsTaken(teamNumber);
        generateBtn.disabled = false;

        if (isTaken) {
            showError(`INVALID: Team Number ${teamNumber} is unavailable.`);
            teamNumberInput.focus();
            return;
        }

        if (!category) {
            showError('Please select an operation domain.');
            categorySelect.focus();
            return;
        }

        // Pick exactly ONE problem at random from selected domain
        const categoryProblems = problemDatabase[category];
        if (!categoryProblems || categoryProblems.length === 0) {
            showError('System Error: Domain data inaccessible.');
            return;
        }

        const randomIndex = Math.floor(Math.random() * categoryProblems.length);
        const picked = categoryProblems[randomIndex];
        state.teamName = teamName;
        state.teamNumber = teamNumber;
        state.category = category;
        state.currentCards = [picked];
        state.selectedCardId = picked.id;

        const fullDomainName = categorySelect.options[categorySelect.selectedIndex].text;

        // Clear error message if any
        if (errorMessage) errorMessage.textContent = '';

        // Flag loading active and stop background theme music so Spider-Sense audio plays cleanly
        isLoadingScreenActive = true;
        pauseBgMusic();

        // Display Cinematic Spider-Sense Loading Screen (6 seconds duration)
        if (spideyLoadingScreen) {
            spideyLoadingScreen.classList.remove('hidden');
            spideyLoadingScreen.classList.remove('fade-out');

            if (loadingTargetText) {
                loadingTargetText.textContent = `SPINNING MULTIVERSE FOR ${teamName.toUpperCase()} (#${teamNumber}) • DOMAIN: ${fullDomainName.toUpperCase()}`;
            }

            // Dynamic sequence of status readouts across 6 seconds
            if (loadingStatusQuote) {
                loadingStatusQuote.textContent = '🕷️ DETECTING SPIDER-SENSE NEURAL HARMONICS...';
                
                setTimeout(() => {
                    if (loadingStatusQuote) loadingStatusQuote.textContent = '🌐 CONNECTING TO EARTH-616 MULTIVERSE DATABASE...';
                }, 1400);

                setTimeout(() => {
                    if (loadingStatusQuote) loadingStatusQuote.textContent = `⚡ SCANNING HIGH-PRIORITY DIRECTIVES FOR ${fullDomainName.toUpperCase()}...`;
                }, 2800);

                setTimeout(() => {
                    if (loadingStatusQuote) loadingStatusQuote.textContent = '🧬 SYNTHESIZING NEURAL WEB PROBLEM SIGNATURE...';
                }, 4200);

                setTimeout(() => {
                    if (loadingStatusQuote) loadingStatusQuote.textContent = '🎯 TARGET DIRECTIVE ACQUIRED! PREPARING DOSSIER...';
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

        // Play Spider-Sense Audio
        playSpiderSenseSound();

        // Reveal directives after 6 seconds cinematic sequence
        setTimeout(() => {
            // Update UI Text
            displayTeamName.textContent = state.teamName + ' (Team #' + state.teamNumber + ')';

            // Update Dossier Banner Details
            const dossierTeamName = document.getElementById('dossier-team-name');
            const dossierTeamNumber = document.getElementById('dossier-team-number');
            const dossierDomain = document.getElementById('dossier-domain');
            const dossierStatus = document.getElementById('dossier-status');

            if (dossierTeamName) dossierTeamName.textContent = state.teamName;
            if (dossierTeamNumber) dossierTeamNumber.textContent = '#' + state.teamNumber;
            if (dossierDomain) dossierDomain.textContent = fullDomainName;
            if (dossierStatus) dossierStatus.textContent = 'READY FOR ACCEPTANCE';

            // Transition panels
            configPanel.classList.add('hidden');
            resultsArea.classList.remove('hidden');
            actionFooter.classList.remove('hidden');
            confirmBtn.disabled = false;

            // Render the single card
            renderCard();

            // Fade out and close loading screen
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

            // Release loading lock and resume background theme music on loop
            isLoadingScreenActive = false;
            playBgMusic();

            // Smooth scroll to directive card
            resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 6000);
    };

    // Render the single assigned card
    const renderCard = () => {
        cardsContainer.innerHTML = '';

        const card = state.currentCards[0];
        if (!card) return;

        const categoryName = categorySelect.options[categorySelect.selectedIndex].text.split('&')[0].trim();
        const difficulty = Math.floor(Math.random() * 3) + 3;

        const cardEl = document.createElement('div');
        cardEl.className = 'problem-card';
        cardEl.dataset.id = card.id;
        cardEl.innerHTML = `
            <div class="card-top-bar">
                <div class="card-badge">${categoryName}</div>
                <div class="assigned-team-chip">🕷️ Team #${state.teamNumber} • ${state.teamName}</div>
            </div>
            <h3 class="card-title">${card.title}</h3>
            <p class="card-desc">${card.desc}</p>
            <div class="card-meta">
                <span>Difficulty: ${difficulty}/5</span>
                <span>DIRECTIVE ID: ${card.id.toUpperCase()}</span>
            </div>
        `;

        cardsContainer.appendChild(cardEl);
    };

    // Confirm Selection - Opens Modal
    const confirmSelection = () => {
        if (!state.selectedCardId) return;

        const selectedCard = state.currentCards.find(c => c.id === state.selectedCardId);
        const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

        // Update Modal Details
        lockedTeam.textContent = state.teamName;
        lockedTeamNumber.textContent = '#' + state.teamNumber;
        lockedDomain.textContent = categoryName;

        lockedProblem.innerHTML = `
            <div class="locked-title">${selectedCard.title}</div>
            <div class="locked-desc">${selectedCard.desc}</div>
        `;

        // Play Indian Spider-Man Reveal Sound
        playAcceptMissionSound();

        // Show Modal
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

            // Real-time double verification before locking
            const isTaken = await checkTeamNumberIsTaken(state.teamNumber);
            if (isTaken) {
                alert(`⛔ INVALID: Team Number ${state.teamNumber} is no longer available.`);
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

            // Prepare record
            const newRecord = {
                teamName: state.teamName,
                teamNumber: String(state.teamNumber).trim(),
                domain: state.category,
                domainName: categoryName,
                problemId: selectedCard.id,
                problemTitle: selectedCard.title,
                problemDesc: selectedCard.desc,
                lockedAt: new Date().toLocaleString()
            };

            // 1. Persist to Supabase Database
            const saveResult = await saveRecordToSupabase(newRecord);
            if (!saveResult.success && saveResult.error && (saveResult.error.code === '23505' || saveResult.error.message.includes('unique'))) {
                alert(`⛔ INVALID: Team Number ${state.teamNumber} reached maximum limit.`);
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
                alert(`🕷️ MISSION LOCKED & RECORDED!\n\nTeam #${state.teamNumber} (${state.teamName}) is officially assigned to: "${selectedCard.title}".\n\nSaved to database!`);
                location.reload();
            }, 600);
        });
    }

    // Initialize Supabase sync on startup
    syncLockedTeamsFromSupabase();

    // Event Listeners
    generateBtn.addEventListener('click', generateCards);

    // Allow Enter key navigation between inputs
    teamNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') teamNumberInput.focus();
    });

    teamNumberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') categorySelect.focus();
    });

    categorySelect.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateCards();
    });

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