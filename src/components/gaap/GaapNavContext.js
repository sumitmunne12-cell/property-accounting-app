import { createContext, useContext } from 'react';

// Lets any screen (Explorer, SOP modal, Daily Hub) jump to a Topic in the GAAP Codex tab.
// App provides { openInCodex(topic, paragraph?) }; outside the provider it is null.
export const GaapNavContext = createContext(null);

export const useGaapNav = () => useContext(GaapNavContext);
