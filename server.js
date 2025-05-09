// server.js - Backend Express server
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store scan history
let scanHistory = [];

// Endpoint to run a Trivy scan
app.post('/api/scan', (req, res) => {
  const { target, scanType } = req.body;
  
  if (!target) {
    return res.status(400).json({ error: 'No target specified' });
  }

  // Build Trivy command based on scan type
  let trivyCommand = `trivy ${scanType || 'fs'} --format json ${target}`;
  
  console.log(`Running command: ${trivyCommand}`);
  
  exec(trivyCommand, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return res.status(500).json({ error: `Trivy error: ${error.message}`, stderr });
    }
    
    try {
      const results = JSON.parse(stdout);
      const scanId = Date.now().toString();
      const scanRecord = {
        id: scanId,
        timestamp: new Date().toISOString(),
        target,
        scanType,
        results
      };
      
      // Add to history
      scanHistory.unshift(scanRecord);
      
      // Only keep the last 20 scans
      if (scanHistory.length > 20) {
        scanHistory.pop();
      }
      
      res.json({
        scanId,
        results
      });
    } catch (parseError) {
      console.error(`JSON parse error: ${parseError}`);
      res.status(500).json({ error: 'Failed to parse Trivy output', stdout });
    }
  });
});

// Get scan history
app.get('/api/history', (req, res) => {
  // Return basic info, not full results
  const historyOverview = scanHistory.map(scan => ({
    id: scan.id,
    timestamp: scan.timestamp,
    target: scan.target,
    scanType: scan.scanType,
    vulnerabilityCount: countVulnerabilities(scan.results)
  }));
  
  res.json(historyOverview);
});

// Get specific scan result
app.get('/api/scan/:id', (req, res) => {
  const scanId = req.params.id;
  const scan = scanHistory.find(s => s.id === scanId);
  
  if (!scan) {
    return res.status(404).json({ error: 'Scan not found' });
  }
  
  res.json(scan);
});

// Helper function to count vulnerabilities
function countVulnerabilities(results) {
  let count = 0;
  if (results && results.Results) {
    results.Results.forEach(result => {
      if (result.Vulnerabilities) {
        count += result.Vulnerabilities.length;
      }
    });
  }
  return count;
}

// Start server
app.listen(PORT, () => {
  console.log(`Trivy Web Interface running on http://localhost:${PORT}`);
});
