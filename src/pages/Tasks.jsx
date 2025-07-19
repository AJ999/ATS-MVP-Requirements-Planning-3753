```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

// ... rest of the code remains the same ...

// Wrap Tasks component with DndProvider
const TasksPage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Tasks />
    </DndProvider>
  );
};

// Export the wrapped component as default
export default TasksPage;

// The original Tasks component becomes a regular const
const Tasks = () => {
  // ... rest of the Tasks component code remains the same ...
};
```