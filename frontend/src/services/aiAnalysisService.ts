interface LogEntry {
  id: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  message: string;
  source: string;
}

const ANALYSIS_PROMPT = `As a SonicWall security expert, analyze the following firewall log entry:

Context:
- This is from a SonicWall Next-Generation Firewall
- We need to determine if this is a genuine security concern or a benign/expected event
- Consider common false positives and known legitimate patterns
- Evaluate based on industry best practices and SonicWall-specific knowledge

Log Entry:
[CATEGORY]: {category}
[SEVERITY]: {severity}
[SOURCE]: {source}
[MESSAGE]: {message}

Please provide:
1. A brief assessment of whether this is likely a genuine security concern or a benign event
2. The reasoning behind your assessment
3. Recommended actions if any are needed
4. Whether this type of event can be safely marked as innocuous for future occurrences

Keep the response concise and focused on actionable insights.`;

export const aiAnalysisService = {
  async analyzeLogs(logs: LogEntry[]): Promise<{ [key: string]: string }> {
    // In a real implementation, this would make a call to your backend
    // which would then interact with OpenAI's API
    
    // For now, we'll simulate the analysis with a mock response
    const results: { [key: string]: string } = {};
    
    for (const log of logs) {
      const prompt = ANALYSIS_PROMPT
        .replace('{category}', log.category)
        .replace('{severity}', log.severity)
        .replace('{source}', log.source)
        .replace('{message}', log.message);
        
      // This is where you would make the actual API call
      // const response = await openai.analyze(prompt);
      
      // For now, return a mock analysis
      results[log.id] = `Analysis: This appears to be a ${
        Math.random() > 0.5 ? 'benign' : 'potentially concerning'
      } event. Common pattern in SonicWall logs. Recommendation: ${
        Math.random() > 0.5 
          ? 'Safe to mark as innocuous.' 
          : 'Monitor for pattern changes.'
      }`;
    }
    
    return results;
  }
}; 