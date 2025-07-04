// Advanced ChatGPT-like AI Assistant
class AdvancedAIAssistant {
  constructor() {
    this.conversationHistory = [];
    this.userProfile = {
      name: '',
      preferences: {},
      context: {},
      sessionStart: new Date()
    };
    this.conversationContext = {
      currentTopic: '',
      previousTopics: [],
      userIntent: '',
      conversationFlow: []
    };
    this.responseTemplates = this.initializeResponseTemplates();
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.isTyping = false;
    this.typingTimeout = null;
    this.initializeAssistant();
  }

  initializeResponseTemplates() {
    return {
      greetings: [
        "Hello! I'm Dr. Gupta's AI assistant. How can I help you today?",
        "Hi there! I'm here to assist you with any questions about Dr. Gupta or the institution.",
        "Greetings! I'm your AI assistant for the Dean's Office. What can I help you with?",
        "Welcome! I'm here to provide information and assistance. How may I help you?"
      ],
      acknowledgments: [
        "I understand you're asking about {topic}. Let me help you with that.",
        "That's a great question about {topic}. Here's what I can tell you.",
        "I see you're interested in {topic}. Let me provide some information.",
        "Regarding {topic}, here's what I know."
      ],
      clarifications: [
        "Could you please clarify what specific aspect of {topic} you'd like to know more about?",
        "I want to make sure I provide the most relevant information. Could you elaborate on {topic}?",
        "To better assist you, could you provide more details about {topic}?",
        "I'd like to give you the most accurate information. Can you specify what you need regarding {topic}?"
      ]
    };
  }

  initializeKnowledgeBase() {
    return {
      dean: {
        name: "Dr. Inderjeet Gupta",
        title: "Dean",
        experience: "20+ years",
        research: "500+ publications",
        awards: "50+ recognitions",
        students: "1000+ mentored"
      },
      office: {
        location: "Main Building, Floor 3, Room 301",
        email: "dean@university.edu",
        phone: "+91 98765 43210",
        hours: "Monday - Friday, 9:00 AM - 5:00 PM"
      },
      services: {
        appointments: "Email or call during office hours",
        studentInquiries: "Contact Student Affairs Office",
        facultyMatters: "Contact Human Resources Department",
        admissions: "Contact Admissions Department",
        events: "Check News section or Events Office"
      },
      research: {
        areas: ["Educational Technology", "Cognitive Learning", "Global Education", "Digital Transformation"],
        publications: "Over 500 research papers in leading journals",
        focus: "Advancing digital learning methodologies and student success"
      }
    };
  }

  initializeAssistant() {
    const toggle = document.getElementById('chatbot-toggle');
    const close = document.getElementById('chatbot-close');
    const send = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggle.addEventListener('click', () => this.toggleChat());
    close.addEventListener('click', () => this.toggleChat());
    send.addEventListener('click', () => this.processUserInput());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.processUserInput();
      }
    });

    // Add typing indicator
    input.addEventListener('input', () => {
      this.showTypingIndicator();
    });

    // Add smart suggestions
    this.addSmartSuggestions();
    
    // Initialize conversation
    this.addSystemMessage("Hello! I'm Dr. Gupta's AI assistant. How can I help you today?");
  }

  addSmartSuggestions() {
    const suggestions = [
      'Schedule appointment',
      'Office location',
      'Research information',
      'Contact details',
      'Student programs',
      'Faculty matters',
      'Events & conferences'
    ];

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'smart-suggestions p-4 border-t border-gray-200 bg-white';
    suggestionsContainer.innerHTML = `
      <div class="text-xs text-gray-500 mb-3">Quick suggestions:</div>
      <div class="flex flex-wrap gap-2">
        ${suggestions.map(suggestion => 
          `<button class="suggestion-chip">${suggestion}</button>`
        ).join('')}
      </div>
    `;

    const chatbotWindow = document.getElementById('chatbot-window');
    const inputContainer = chatbotWindow.querySelector('.p-4.border-t');
    inputContainer.parentNode.insertBefore(suggestionsContainer, inputContainer);

    // Add event listeners to suggestion buttons
    suggestionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-chip')) {
        const input = document.getElementById('chatbot-input');
        input.value = e.target.textContent;
        this.processUserInput();
      }
    });
  }

  toggleChat() {
    const window = document.getElementById('chatbot-window');
    const isOpen = !window.classList.contains('hidden');
    
    if (!isOpen) {
      window.classList.remove('hidden');
      document.getElementById('chatbot-input').focus();
      this.userProfile.sessionStart = new Date();
      
      if (this.userProfile.name) {
        this.addSystemMessage(`Welcome back, ${this.userProfile.name}! How can I assist you today?`);
      }
    } else {
      window.classList.add('hidden');
    }
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    const messagesContainer = document.getElementById('chatbot-messages');
    const existingIndicator = messagesContainer.querySelector('.typing-indicator');
    
    if (existingIndicator) {
      clearTimeout(this.typingTimeout);
      existingIndicator.remove();
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start space-x-3 chatbot-message assistant';
    typingDiv.innerHTML = `
      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
        <i class="fas fa-robot text-white text-xs"></i>
      </div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.isTyping = true;

    this.typingTimeout = setTimeout(() => {
      if (typingDiv.parentNode) {
        typingDiv.remove();
      }
      this.isTyping = false;
    }, 3000);
  }

  processUserInput() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addUserMessage(message);
    input.value = '';
    
    // Remove typing indicator
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    
    // Process the message
    this.analyzeAndRespond(message);
  }

  addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-3 chatbot-message user';
    
    const avatar = document.createElement('div');
    avatar.className = 'w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0';
    const icon = document.createElement('i');
    icon.className = 'fas fa-user text-white text-xs';
    avatar.appendChild(icon);
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble p-4 max-w-xs lg:max-w-md';
    messageBubble.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 18px 18px 4px 18px;
    `;
    messageBubble.innerHTML = `<p class="text-sm leading-relaxed">${this.escapeHtml(text)}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.conversationHistory.push({ role: 'user', content: text, timestamp: new Date() });
  }

  addSystemMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-start space-x-3 chatbot-message assistant';
    
    const avatar = document.createElement('div');
    avatar.className = 'w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0';
    const icon = document.createElement('i');
    icon.className = 'fas fa-robot text-white text-xs';
    avatar.appendChild(icon);
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble p-4 max-w-xs lg:max-w-md';
    messageBubble.style.cssText = `
      background: white;
      color: #1a202c;
      border-radius: 18px 18px 18px 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `;
    messageBubble.innerHTML = `<p class="text-sm leading-relaxed">${this.escapeHtml(text)}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    this.conversationHistory.push({ role: 'assistant', content: text, timestamp: new Date() });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract user name
    const nameMatch = lowerMessage.match(/my name is (\w+)/i) || 
                     lowerMessage.match(/i'm (\w+)/i) || 
                     lowerMessage.match(/i am (\w+)/i) ||
                     lowerMessage.match(/call me (\w+)/i);
    
    if (nameMatch && !this.userProfile.name) {
      this.userProfile.name = nameMatch[1];
      return 'introduction';
    }
    
    // Intent detection
    if (lowerMessage.includes('appointment') || lowerMessage.includes('meet') || lowerMessage.includes('schedule')) {
      return 'appointment';
    } else if (lowerMessage.includes('office') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return 'location';
    } else if (lowerMessage.includes('research') || lowerMessage.includes('publication') || lowerMessage.includes('paper')) {
      return 'research';
    } else if (lowerMessage.includes('student') || lowerMessage.includes('admission') || lowerMessage.includes('enrollment')) {
      return 'student';
    } else if (lowerMessage.includes('faculty') || lowerMessage.includes('staff') || lowerMessage.includes('professor')) {
      return 'faculty';
    } else if (lowerMessage.includes('event') || lowerMessage.includes('conference') || lowerMessage.includes('workshop')) {
      return 'events';
    } else if (lowerMessage.includes('email') || lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
      return 'contact';
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'gratitude';
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
      return 'farewell';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'help';
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('smart')) {
      return 'ai_info';
    }
    
    return 'general';
  }

  analyzeAndRespond(message) {
    const intent = this.detectIntent(message);
    const response = this.generateResponse(message, intent);
    
    // Add typing delay for realistic feel
    setTimeout(() => {
      this.addSystemMessage(response);
    }, 1000 + Math.random() * 1000);
  }

  generateResponse(message, intent) {
    const lowerMessage = message.toLowerCase();
    
    switch (intent) {
      case 'introduction':
        return `Nice to meet you, ${this.userProfile.name}! I'm Dr. Gupta's AI assistant. How can I help you today?`;
      
      case 'appointment':
        return this.generateAppointmentResponse();
      
      case 'location':
        return this.generateLocationResponse();
      
      case 'research':
        return this.generateResearchResponse();
      
      case 'student':
        return this.generateStudentResponse();
      
      case 'faculty':
        return this.generateFacultyResponse();
      
      case 'events':
        return this.generateEventsResponse();
      
      case 'contact':
        return this.generateContactResponse();
      
      case 'gratitude':
        return this.generateGratitudeResponse();
      
      case 'farewell':
        return this.generateFarewellResponse();
      
      case 'help':
        return this.generateHelpResponse();
      
      case 'ai_info':
        return this.generateAIInfoResponse();
      
      default:
        return this.generateContextualResponse(message);
    }
  }

  generateAppointmentResponse() {
    const responses = [
      `To schedule an appointment with Dr. Gupta, you can email ${this.knowledgeBase.office.email} or call ${this.knowledgeBase.office.phone} during office hours (${this.knowledgeBase.office.hours}). Would you like me to provide more details about the appointment process?`,
      `Dr. Gupta's office is located at ${this.knowledgeBase.office.location}. You can schedule an appointment by contacting ${this.knowledgeBase.office.email} or calling ${this.knowledgeBase.office.phone}. Office hours are ${this.knowledgeBase.office.hours}.`,
      `For appointments with Dr. Gupta, please reach out via email at ${this.knowledgeBase.office.email} or call ${this.knowledgeBase.office.phone}. The office is open ${this.knowledgeBase.office.hours}.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateLocationResponse() {
    return `The Dean's Office is located at ${this.knowledgeBase.office.location}. You can also reach us via email at ${this.knowledgeBase.office.email} or call ${this.knowledgeBase.office.phone}. Would you like directions or a map?`;
  }

  generateResearchResponse() {
    return `Dr. Gupta has ${this.knowledgeBase.dean.research} in leading journals. His current focus areas include ${this.knowledgeBase.research.areas.join(', ')}. ${this.knowledgeBase.research.publications}. Would you like to know more about any specific area or recent publications?`;
  }

  generateStudentResponse() {
    return `For student-related inquiries, please contact the Student Affairs Office. For admission queries, visit the Admissions Department. I can help you with general information about academic programs and requirements. What specific information do you need?`;
  }

  generateFacultyResponse() {
    return `Faculty and staff matters are handled by the Human Resources Department. For urgent academic matters, please contact the respective department heads. Is there a specific faculty-related question I can help with?`;
  }

  generateEventsResponse() {
    return `We regularly host academic events, conferences, and workshops. Check our News section for upcoming events, or contact the Events Office for more information. Would you like to know about any specific upcoming events?`;
  }

  generateContactResponse() {
    return `You can reach Dr. Gupta at ${this.knowledgeBase.office.email} or call ${this.knowledgeBase.office.phone}. Office hours are ${this.knowledgeBase.office.hours}. Is there anything specific you'd like to discuss?`;
  }

  generateGratitudeResponse() {
    const responses = [
      "You're welcome! Is there anything else I can help you with?",
      "My pleasure! Feel free to ask if you need any other information.",
      "Glad I could help! Don't hesitate to reach out for more assistance.",
      "Happy to assist! Let me know if you have any other questions."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateFarewellResponse() {
    return `Thank you for contacting the Dean's Office. Have a great day! Feel free to return anytime for assistance.`;
  }

  generateHelpResponse() {
    return `I can help you with:\n• Scheduling appointments with Dr. Gupta\n• Office location and contact information\n• Research and publication details\n• Student and faculty inquiries\n• Event information\n• General academic questions\n\nWhat would you like to know?`;
  }

  generateAIInfoResponse() {
    return `I'm an AI assistant designed to help with Dean's Office inquiries. I can understand context, remember our conversation, and provide personalized responses. I'm constantly learning to better serve you! I can help with appointments, research information, office details, and much more.`;
  }

  generateContextualResponse(message) {
    // Use conversation context to generate more relevant responses
    const recentTopics = this.conversationContext.previousTopics.slice(-3);
    
    if (recentTopics.length > 0) {
      const lastTopic = recentTopics[recentTopics.length - 1];
      return `I understand you're asking about "${message}". Based on our conversation about ${lastTopic}, I think you might be interested in related information. For specific inquiries, please contact the Dean's Office directly at ${this.knowledgeBase.office.email} or call ${this.knowledgeBase.office.phone}.`;
    }
    
    return `I understand you're asking about "${message}". For specific inquiries, please contact the Dean's Office directly at ${this.knowledgeBase.office.email} or call ${this.knowledgeBase.office.phone}. I'm here to help with general information about Dr. Gupta and the institution.`;
  }

  // Advanced features
  getConversationAnalytics() {
    const duration = Math.round((new Date() - this.userProfile.sessionStart) / 1000);
    const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
    const topics = userMessages.map(msg => msg.intent).filter(Boolean);
    
    return {
      duration: duration,
      messageCount: this.conversationHistory.length,
      topics: topics,
      userName: this.userProfile.name,
      sessionStart: this.userProfile.sessionStart
    };
  }

  // Memory and context management
  updateConversationContext(intent, message) {
    this.conversationContext.currentTopic = intent;
    this.conversationContext.previousTopics.push(intent);
    this.conversationContext.conversationFlow.push({
      intent: intent,
      message: message,
      timestamp: new Date()
    });
    
    // Keep only recent context
    if (this.conversationContext.previousTopics.length > 5) {
      this.conversationContext.previousTopics.shift();
    }
  }
}

// Initialize the advanced AI assistant
document.addEventListener('DOMContentLoaded', function() {
  window.aiAssistant = new AdvancedAIAssistant();
});
