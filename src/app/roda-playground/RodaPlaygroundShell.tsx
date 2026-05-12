// RODA Playground Shell - main layout and state
import React from 'react';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import AssistantPanel from './components/AssistantPanel';
import styles from './RodaPlaygroundShell.module.css';

export default function RodaPlaygroundShell() {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <MainPanel />
      <AssistantPanel />
    </div>
  );
}
