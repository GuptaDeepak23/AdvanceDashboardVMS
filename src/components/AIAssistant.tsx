import React, { useState } from 'react';
import { X, Send, Bot, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
  dashboardData: any;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  isDark = false,
  dashboardData
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm your AI Dashboard Assistant. I can help you understand your visitor management analytics and provide insights about your dashboard data.

Current Overview:
• Total Employees: ${dashboardData?.statCardData?.total_employees || 0}
• Pre-registered Visitors: ${dashboardData?.statCardData?.total_pre_registers || 0}
• Currently Checked-in: ${dashboardData?.statCardData?.total_checkin_visitors || 0}
• Today's Check-outs: ${dashboardData?.statCardData?.total_checkout_visitors || 0}

What would you like to know about your dashboard?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What are the current visitor trends?",
    "How is the check-in to checkout ratio performing?",
    "What insights can you provide about pending checkouts?"
  ];

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('trend') || message.includes('analytics')) {
      return `Based on your current data:

📈 **Visitor Trends:**
• You have ${dashboardData?.statCardData?.total_checkin_visitors || 0} visitors currently checked in
• ${dashboardData?.statCardData?.total_pre_registers || 0} visitors are pre-registered
• Check-in to checkout ratio appears balanced

**Recommendations:**
- Monitor peak hours for better resource allocation
- Consider optimizing the check-in process for pre-registered visitors`;
    }
    
    if (message.includes('ratio') || message.includes('performance')) {
      return `📊 **Performance Analysis:**

Current Ratios:
• Pre-registered to Check-in Ratio: Shows how many pre-registered visitors actually arrive
• Check-in to Checkout Ratio: Currently at 50%

**Insights:**
- Your checkout process seems efficient
- Consider implementing automated checkout reminders
- Track visitor duration patterns for better planning`;
    }
    
    if (message.includes('pending') || message.includes('checkout')) {
      const pendingCount = dashboardData?.pendingCheckoutData?.length || 0;
      return `🔍 **Pending Checkouts Analysis:**

Currently: ${pendingCount} visitors pending checkout

**Recommendations:**
- Send automated checkout reminders
- Implement QR code-based quick checkout
- Monitor visitors who exceed expected duration
- Consider grace period notifications`;
    }
    
    if (message.includes('department') || message.includes('visit')) {
      return `🏢 **Department Visit Analysis:**

**Top Performing Departments:**
- IT Department: Most visited
- HR Department: High traffic
- Finance: Moderate visits

**Optimization Tips:**
- Balance visitor load across departments
- Implement department-specific check-in flows
- Track meeting efficiency metrics`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". 

Here are some key insights about your dashboard:

🎯 **Quick Stats:**
• ${dashboardData?.statCardData?.total_employees || 0} total employees
• ${dashboardData?.statCardData?.total_checkin_visitors || 0} current visitors
• ${dashboardData?.pendingCheckoutData?.length || 0} pending checkouts

**What I can help with:**
- Visitor trend analysis
- Performance metrics explanation
- Optimization recommendations
- Department visit patterns

Feel free to ask specific questions about any aspect of your visitor management system!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Window */}
      <div className={`relative w-96 h-[500px] rounded-lg shadow-2xl border flex flex-col ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <h3 className={`font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              AI Dashboard Assistant
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                  message.isUser
                    ? 'bg-blue-500 text-white'
                    : isDark
                    ? 'bg-gray-700 text-gray-100'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-1 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className={`text-xs font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Suggested Questions:
            </span>
          </div>
          <div className="space-y-1">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className={`w-full text-left text-xs p-2 rounded transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your dashboard..."
              className={`flex-1 p-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};