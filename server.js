const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.get('/api/config/layout', async (req, res) => {
  try {
    const layoutConfig = await fs.readFile(
      path.join(__dirname, 'src/config/layout.json'),
      'utf8'
    );
    res.json(JSON.parse(layoutConfig));
  } catch (error) {
    console.error('Error reading layout config:', error);
    res.status(500).json({ error: 'Failed to load layout configuration' });
  }
});

app.get('/api/config/contactFields', async (req, res) => {
  try {
    const contactFieldsConfig = await fs.readFile(
      path.join(__dirname, 'src/config/contactFields.json'),
      'utf8'
    );
    res.json(JSON.parse(contactFieldsConfig));
  } catch (error) {
    console.error('Error reading contact fields config:', error);
    res.status(500).json({ error: 'Failed to load contact fields configuration' });
  }
});

app.get('/api/data/contacts', async (req, res) => {
  try {
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    res.json(JSON.parse(contactData));
  } catch (error) {
    console.error('Error reading contact data:', error);
    res.status(500).json({ error: 'Failed to load contact data' });
  }
});

app.get('/api/contacts', async (req, res) => {
  try {
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    res.json(JSON.parse(contactData));
  } catch (error) {
    console.error('Error reading contact data:', error);
    res.status(500).json({ error: 'Failed to load contact data' });
  }
});

app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    const contacts = JSON.parse(contactData);
    const contact = contacts.find(c => c.id === parseInt(req.params.id));
    
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error reading contact data:', error);
    res.status(500).json({ error: 'Failed to load contact data' });
  }
});

// Contact save operations
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    const updatedContact = req.body;
    
    // Read current data
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    const contacts = JSON.parse(contactData);
    
    // Find and update contact
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex !== -1) {
      contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };
      
      // Write back to file
      await fs.writeFile(
        path.join(__dirname, 'src/data/contactData.json'),
        JSON.stringify(contacts, null, 2)
      );
      
      res.json(contacts[contactIndex]);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = req.body;
    
    // Read current data
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    const contacts = JSON.parse(contactData);
    
    // Generate new ID
    const maxId = Math.max(...contacts.map(c => c.id), 0);
    newContact.id = maxId + 1;
    
    // Add new contact
    contacts.push(newContact);
    
    // Write back to file
    await fs.writeFile(
      path.join(__dirname, 'src/data/contactData.json'),
      JSON.stringify(contacts, null, 2)
    );
    
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contactId = parseInt(req.params.id);
    
    // Read current data
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    const contacts = JSON.parse(contactData);
    
    // Filter out the contact to delete
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    
    if (filteredContacts.length === contacts.length) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    // Write back to file
    await fs.writeFile(
      path.join(__dirname, 'src/data/contactData.json'),
      JSON.stringify(filteredContacts, null, 2)
    );
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Search contacts
app.get('/api/contacts/search', async (req, res) => {
  try {
    const { q, filters } = req.query;
    
    const contactData = await fs.readFile(
      path.join(__dirname, 'src/data/contactData.json'),
      'utf8'
    );
    const contacts = JSON.parse(contactData);
    
    let filteredContacts = contacts;
    
    // Apply search query
    if (q) {
      const query = q.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.firstName?.toLowerCase().includes(query) ||
        contact.lastName?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters) {
      const filterObj = JSON.parse(filters);
      // Add filter logic here based on your filter structure
    }
    
    res.json(filteredContacts);
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).json({ error: 'Failed to search contacts' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Contact API Server'
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 