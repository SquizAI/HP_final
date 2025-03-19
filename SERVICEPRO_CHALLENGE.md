# ServicePro Challenge

## Overview

The ServicePro challenge is a critical component of the HP AI Challenge application focused on optimizing IT service management using AI. This challenge tests users' ability to prioritize and resolve IT support tickets using AI-assisted decision making.

## Technical Implementation

### Component Structure

The ServicePro challenge is implemented as a multi-step workflow with these key sections:

1. **Introduction Screen**: Sets the context and objectives for the challenge
2. **Ticket Queue Interface**: Displays support tickets that need prioritization
3. **AI Resolution Tool**: Interactive interface for applying AI solutions
4. **Performance Summary**: Analysis of the user's decision-making
5. **Reward Screen**: XP and ability rewards upon completion

### File Structure

```
src/
└── components/
    └── challenges/
        └── ServicePro/
            ├── ServicePro.tsx           # Main component
            ├── TicketData.ts            # IT ticket dataset
            ├── TicketCard.tsx           # Individual ticket component
            ├── AIToolInterface.tsx      # AI solution tool component
            ├── PerformanceMetrics.tsx   # Decision analytics
            └── RewardScreen.tsx         # Challenge completion UI
```

### State Management

The ServicePro component maintains internal state using React's useState hooks:

```typescript
// Main component state
const [currentStep, setCurrentStep] = useState<number>(0);
const [ticketQueue, setTicketQueue] = useState<TicketType[]>(initialTickets);
const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
const [resolvedTickets, setResolvedTickets] = useState<TicketType[]>([]);
const [aiToolsApplied, setAiToolsApplied] = useState<string[]>([]);
const [performanceScore, setPerformanceScore] = useState<number>(0);
const [showReward, setShowReward] = useState<boolean>(false);
```

### Key Functions

#### Ticket Prioritization Logic

```typescript
const handleTicketSelect = (ticket: TicketType) => {
  setSelectedTicket(ticket);
};

const calculateTicketPriority = (ticket: TicketType): number => {
  const { impact, urgency, affectedUsers } = ticket;
  
  // Priority algorithm based on impact, urgency and number of affected users
  const baseScore = impact * 3 + urgency * 2;
  const userMultiplier = affectedUsers > 100 ? 1.5 : 
                         affectedUsers > 50 ? 1.3 : 
                         affectedUsers > 10 ? 1.1 : 1;
  
  return Math.round(baseScore * userMultiplier);
};
```

#### AI Tool Application

```typescript
const applyAITool = (toolId: string, ticket: TicketType) => {
  // Different AI tools have different effects on resolution time and effectiveness
  const toolEffects = {
    'automated-diagnosis': { timeReduction: 0.3, accuracyBoost: 0.2 },
    'sentiment-analysis': { timeReduction: 0.1, accuracyBoost: 0.3 },
    'knowledge-base': { timeReduction: 0.4, accuracyBoost: 0.1 },
    'pattern-recognition': { timeReduction: 0.2, accuracyBoost: 0.4 }
  };
  
  const effect = toolEffects[toolId] || { timeReduction: 0, accuracyBoost: 0 };
  
  // Apply effect to the ticket
  const updatedTicket = {
    ...ticket,
    estimatedResolutionTime: ticket.estimatedResolutionTime * (1 - effect.timeReduction),
    resolutionAccuracy: Math.min(100, ticket.resolutionAccuracy + (effect.accuracyBoost * 100))
  };
  
  // Update state
  setTicketQueue(ticketQueue.filter(t => t.id !== ticket.id));
  setResolvedTickets([...resolvedTickets, updatedTicket]);
  setAiToolsApplied([...aiToolsApplied, toolId]);
  setSelectedTicket(null);
};
```

#### Performance Evaluation

```typescript
const calculatePerformanceScore = () => {
  if (resolvedTickets.length === 0) return 0;
  
  const weights = {
    resolutionTime: 0.4,
    accuracy: 0.4,
    prioritization: 0.2
  };
  
  let totalScore = 0;
  
  resolvedTickets.forEach(ticket => {
    // Time score (lower is better)
    const timeScore = Math.max(0, 100 - (ticket.estimatedResolutionTime / ticket.baseResolutionTime) * 100);
    
    // Accuracy score (higher is better)
    const accuracyScore = ticket.resolutionAccuracy;
    
    // Priority score (based on whether high priority tickets were resolved first)
    const priorityScore = calculatePriorityScore(ticket);
    
    const ticketScore = 
      timeScore * weights.resolutionTime + 
      accuracyScore * weights.accuracy + 
      priorityScore * weights.prioritization;
    
    totalScore += ticketScore;
  });
  
  return Math.round(totalScore / resolvedTickets.length);
};
```

### Ticket Data Structure

```typescript
interface TicketType {
  id: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'security' | 'other';
  impact: number; // 1-5 scale (5 being highest)
  urgency: number; // 1-5 scale (5 being highest)
  affectedUsers: number;
  estimatedResolutionTime: number; // in minutes
  baseResolutionTime: number; // original time before AI tools
  resolutionAccuracy: number; // percentage
  status: 'open' | 'in-progress' | 'resolved';
  timestamp: string;
  aiRecommendation?: string;
}
```

## UI Components

### Ticket Card

```jsx
const TicketCard = ({ ticket, isSelected, onSelect }) => {
  const { 
    title, 
    category, 
    description, 
    impact, 
    urgency, 
    affectedUsers, 
    timestamp 
  } = ticket;
  
  const priority = calculateTicketPriority(ticket);
  const priorityClass = 
    priority > 12 ? 'bg-red-100 border-red-400' :
    priority > 8 ? 'bg-orange-100 border-orange-400' :
    priority > 5 ? 'bg-yellow-100 border-yellow-400' :
    'bg-green-100 border-green-400';
  
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : `border-gray-200 ${priorityClass}`
      }`}
      onClick={() => onSelect(ticket)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
          {category}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-lg font-semibold">{impact}</div>
          <div className="text-xs text-gray-500">Impact</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{urgency}</div>
          <div className="text-xs text-gray-500">Urgency</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{affectedUsers}</div>
          <div className="text-xs text-gray-500">Users</div>
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Opened: {new Date(timestamp).toLocaleString()}
        </span>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200">
          Priority: {priority}
        </span>
      </div>
    </div>
  );
};
```

### AI Tool Interface

```jsx
const AIToolInterface = ({ selectedTicket, onApplyTool, onCancel }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  
  const aiTools = [
    {
      id: 'automated-diagnosis',
      name: 'AI Automated Diagnosis',
      description: 'Uses pattern recognition to identify common issues',
      effect: 'Reduces resolution time by 30%'
    },
    {
      id: 'sentiment-analysis',
      name: 'User Sentiment Analysis',
      description: 'Analyzes ticket language to detect urgency and frustration',
      effect: 'Improves resolution accuracy by 30%'
    },
    {
      id: 'knowledge-base',
      name: 'AI Knowledge Base',
      description: 'Searches across previous solutions for similar issues',
      effect: 'Reduces resolution time by 40%'
    },
    {
      id: 'pattern-recognition',
      name: 'System Pattern Recognition',
      description: 'Identifies related system issues and root causes',
      effect: 'Improves resolution accuracy by 40%'
    }
  ];
  
  if (!selectedTicket) return null;
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800">
          AI Service Resolution Tools
        </h2>
        <p className="text-gray-600 mt-2">
          Select an AI tool to assist with resolving ticket: 
          <span className="font-medium">{selectedTicket.title}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiTools.map(tool => (
          <div 
            key={tool.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedTool === tool.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedTool(tool.id)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
            <p className="mt-2 text-sm font-medium text-blue-600">{tool.effect}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          disabled={!selectedTool}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          onClick={() => selectedTool && onApplyTool(selectedTool, selectedTicket)}
        >
          Apply Tool
        </button>
      </div>
    </div>
  );
};
```

## Reward System

Upon completion, users receive:

1. **XP Points**: 175 XP added to their profile
2. **New Ability**: "Service Optimization" unlocked in their skill tree
3. **Building Block**: "IT Process Automation" added to their collection

The reward calculation is based on the final performance score:

```typescript
const calculateRewards = (score: number) => {
  let xp = 100; // Base XP
  
  // Additional XP based on performance
  if (score >= 90) xp += 75;
  else if (score >= 75) xp += 50;
  else if (score >= 60) xp += 25;
  
  return {
    xp,
    ability: 'service-optimization',
    buildingBlock: {
      id: 'it-process-automation',
      name: 'IT Process Automation',
      description: 'Automate routine IT tasks using AI'
    }
  };
};
```

## Integration with HeroStore

```jsx
const { gainXP, completeChallenge, unlockAbility, addBlock } = useHeroStore();

const handleChallengeComplete = () => {
  const finalScore = calculatePerformanceScore();
  const rewards = calculateRewards(finalScore);
  
  // Award XP
  gainXP(rewards.xp);
  
  // Mark challenge as completed
  completeChallenge('servicepro');
  
  // Unlock new ability
  unlockAbility(rewards.ability);
  
  // Add building block
  addBlock(rewards.buildingBlock);
  
  // Show reward screen
  setPerformanceScore(finalScore);
  setShowReward(true);
};
```

## Mobile Responsiveness

The ServicePro challenge adapts to different screen sizes:

1. Single-column layout for tickets and tools on small screens
2. Two-column layout for AI tools on medium and larger screens
3. Responsive metrics display with stacked layout on small screens

Media queries in the CSS handle the responsive behavior:

```css
/* Base styles */
.ticket-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.tool-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

/* Medium and larger screens */
@media (min-width: 768px) {
  .tool-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .ticket-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## Accessibility Features

1. Keyboard navigation for ticket selection and tool application
2. ARIA roles and labels for interactive elements
3. Sufficient color contrast for text readability (particularly for priority indicators)
4. Focus management during multi-step flow

## Performance Considerations

1. Memoized ticket and tool components to reduce re-renders
2. Efficient state updates using functional updates
3. Optimized rendering of ticket queues with virtualization for large datasets
4. Separate components for different challenge sections to improve maintainability 