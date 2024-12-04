const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/directory', (req, res) => {
  const { path: dirPath } = req.body;

  if (!fs.existsSync(dirPath)) {
    return res.status(400).json({ error: 'Directory does not exist' });
  }

  const getTreeData = (directory) => {
    const items = fs.readdirSync(directory, { withFileTypes: true });
    console.log('#### items', items, directory)
    return items.map((item) => {
      const fullPath = path.join(directory, item.name);
      return {
        title: item.name,
        key: fullPath,
        children: item.isDirectory() ? getTreeData(fullPath) : null,
      };
    });
  };

  try {
    const treeData = getTreeData(dirPath);
    res.json(treeData);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
