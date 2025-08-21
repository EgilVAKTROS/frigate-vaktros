// React.use() polyfill for React 18 compatibility with StackFrame

// We'll patch the global React object before StackFrame loads
if (typeof window !== "undefined") {
  // Store original React if it exists
  const originalReact = (window as any).React;

  // Create a proxy for React that adds the use() method
  const ReactProxy = new Proxy(originalReact || {}, {
    get(target, prop) {
      if (prop === "use" && !target.use) {
        // Return our polyfill function
        return <T>(resource: Promise<T> | any): T => {
          // If it's a promise, throw it (works with Suspense)
          if (resource && typeof resource.then === "function") {
            throw resource;
          }
          // For other types, just return them
          return resource as T;
        };
      }
      return target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  });

  // Set the proxy as the global React
  (window as any).React = ReactProxy;
}

export {};
