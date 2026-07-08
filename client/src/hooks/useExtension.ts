import { useState, useEffect } from 'react';

export function useExtension() {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [extensionVersion, setExtensionVersion] = useState<string | null>(null);

  useEffect(() => {
    // Initial check
    const checkStatus = () => {
      const isInstalled = document.documentElement.getAttribute('data-leetmentor-installed') === 'true';
      const version = document.documentElement.getAttribute('data-leetmentor-version');
      setIsExtensionInstalled(isInstalled);
      if (version) setExtensionVersion(version);
    };

    checkStatus();

    // Set up observer for changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-leetmentor-installed' || mutation.attributeName === 'data-leetmentor-version') {
          checkStatus();
        }
      });
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-leetmentor-installed', 'data-leetmentor-version'] 
    });

    return () => observer.disconnect();
  }, []);

  // Function to broadcast settings to extension
  const syncSettingsToExtension = (settings: any) => {
    if (isExtensionInstalled) {
      window.postMessage(
        { 
          type: 'LEETMENTOR_SETTINGS_UPDATE', 
          payload: settings 
        }, 
        '*'
      );
    }
  };

  return { isExtensionInstalled, extensionVersion, syncSettingsToExtension };
}
