// ==============================================================================
// test_auth_logic.js — Client-side Authentication Logic Verification
// ==============================================================================

const assert = require('assert');
const path = require('path');
const Module = require('module');

// 1. Mocks setup
const mockRouter = {
  push: (url) => {
    mockRouter.calls.push(url);
  },
  calls: []
};

const mockNavigation = {
  useRouter: () => mockRouter
};
mockNavigation.default = mockNavigation;

// Active React mock runner instance
let currentInstance = null;
let capturedContext = null;

const mockReact = {
  createContext: (defaultValue) => {
    const context = {
      _currentValue: defaultValue,
      Provider: ({ value, children }) => {
        context._currentValue = value;
        return children;
      }
    };
    capturedContext = context;
    return context;
  },
  useContext: (context) => {
    return context._currentValue;
  },
  useState: (initialValue) => {
    if (!currentInstance) {
      throw new Error("useState called outside of active rendering context");
    }
    return currentInstance.useState(initialValue);
  },
  useEffect: (effect, deps) => {
    if (!currentInstance) {
      throw new Error("useEffect called outside of active rendering context");
    }
    currentInstance.useEffect(effect, deps);
  }
};
mockReact.default = mockReact;

const mockJsxRuntime = {
  jsx: (type, props) => {
    if (typeof type === 'function') {
      return type(props);
    }
    return { type, props };
  },
  jsxs: (type, props) => {
    if (typeof type === 'function') {
      return type(props);
    }
    return { type, props };
  },
  Fragment: Symbol.for('react.fragment')
};
mockJsxRuntime.default = mockJsxRuntime;

// Require interceptor Setup
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === 'react') return mockReact;
  if (id === 'react/jsx-runtime') return mockJsxRuntime;
  if (id === 'next/navigation') return mockNavigation;
  if (id === '@/context/AuthContext' || id === '../context/AuthContext') {
    return require(path.join(__dirname, 'compiled/context/AuthContext'));
  }
  return originalRequire.apply(this, arguments);
};

// 2. React Hooks Runner Implementation
class ReactMockRunner {
  constructor(Component, initialProps = {}) {
    this.Component = Component;
    this.props = initialProps;
    this.hooks = [];
    this.hookIndex = 0;
    this.effects = [];
    this.cleanupFunctions = [];
    this.latestResult = null;
  }

  useState(initialValue) {
    const index = this.hookIndex++;
    if (index >= this.hooks.length) {
      const val = typeof initialValue === 'function' ? initialValue() : initialValue;
      this.hooks.push({
        value: val,
        setValue: (newValue) => {
          const oldVal = this.hooks[index].value;
          if (typeof newValue === 'function') {
            this.hooks[index].value = newValue(oldVal);
          } else {
            this.hooks[index].value = newValue;
          }
          if (this.hooks[index].value !== oldVal) {
            this.triggerUpdate();
          }
        }
      });
    }
    return [this.hooks[index].value, this.hooks[index].setValue];
  }

  useEffect(effect, deps) {
    const index = this.hookIndex++;
    if (index >= this.hooks.length) {
      this.hooks.push({ deps, effect });
      this.effects.push({ index, effect });
    } else {
      const prevDeps = this.hooks[index].deps;
      let hasChanged = !deps || !prevDeps || deps.length !== prevDeps.length;
      if (!hasChanged && deps && prevDeps) {
        for (let i = 0; i < deps.length; i++) {
          if (deps[i] !== prevDeps[i]) {
            hasChanged = true;
            break;
          }
        }
      }
      if (hasChanged) {
        this.hooks[index].deps = deps;
        this.effects.push({ index, effect });
      }
    }
  }

  triggerUpdate() {
    this.render();
  }

  render(newProps) {
    if (newProps !== undefined) {
      this.props = newProps;
    }
    currentInstance = this;
    this.hookIndex = 0;
    this.latestResult = this.Component(this.props);
    currentInstance = null;
    return this.latestResult;
  }

  runEffects() {
    const pending = this.effects;
    this.effects = [];
    for (const { index, effect } of pending) {
      if (this.cleanupFunctions[index]) {
        try {
          this.cleanupFunctions[index]();
        } catch (e) {
          console.error("Cleanup error", e);
        }
      }
      this.cleanupFunctions[index] = effect();
    }
  }
}

// 3. Global Mocks Configuration
const localStorageStore = {};
global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, value) => { localStorageStore[key] = String(value); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { for (const key in localStorageStore) delete localStorageStore[key]; }
};

let fetchMockHandler = null;
global.fetch = function(url, options) {
  if (fetchMockHandler) {
    return fetchMockHandler(url, options);
  }
  return Promise.reject(new Error("No fetch mock handler configured"));
};

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 10));

// Load compiled modules
const { AuthProvider, useAuth } = require(path.join(__dirname, 'compiled/context/AuthContext'));
const ProtectedRoute = require(path.join(__dirname, 'compiled/components/ProtectedRoute')).default;

// 4. Test Suite Execution
async function runTestSuite() {
  console.log("Starting client-side auth tests...");

  // Test 1: Unauthenticated route block
  await (async () => {
    console.log("Running: 1. Unauthenticated route block");
    localStorage.clear();
    mockRouter.calls = [];

    // Mock API as offline to speed up initialization / fallback checks
    fetchMockHandler = () => Promise.reject(new Error("Offline"));

    const authProviderInstance = new ReactMockRunner(AuthProvider, { children: null });
    authProviderInstance.render();
    authProviderInstance.runEffects();
    await flushPromises();

    const contextVal = capturedContext._currentValue;
    assert.strictEqual(contextVal.isLoading, false);
    assert.strictEqual(contextVal.isAuthenticated, false);

    const protectedRouteInstance = new ReactMockRunner(ProtectedRoute, { children: "Secret Content" });
    const element = protectedRouteInstance.render();

    assert.ok(element && element.type === 'div');
    assert.ok(JSON.stringify(element).includes("Authenticating Secure Session"));

    protectedRouteInstance.runEffects();
    assert.deepStrictEqual(mockRouter.calls, ["/login"]);
    console.log("Pass: 1. Unauthenticated route block");
  })();

  // Test 2: Authenticated route bypass
  await (async () => {
    console.log("Running: 2. Authenticated route bypass");
    localStorage.clear();
    localStorage.setItem("phantom_token", "valid-jwt-token-xyz");
    localStorage.setItem("phantom_user", JSON.stringify({
      id: "user-123",
      email: "user@synzlabs.io",
      displayName: "Normal User",
      role: "User"
    }));
    mockRouter.calls = [];

    // Mock API offline
    fetchMockHandler = () => Promise.reject(new Error("Offline"));

    const authProviderInstance = new ReactMockRunner(AuthProvider, { children: null });
    authProviderInstance.render();
    authProviderInstance.runEffects();
    await flushPromises();

    const contextVal = capturedContext._currentValue;
    assert.strictEqual(contextVal.isLoading, false);
    assert.strictEqual(contextVal.isAuthenticated, true);

    const protectedRouteInstance = new ReactMockRunner(ProtectedRoute, { children: "Secret Content" });
    const element = protectedRouteInstance.render();

    assert.strictEqual(element.props.children, "Secret Content");
    protectedRouteInstance.runEffects();
    assert.deepStrictEqual(mockRouter.calls, []);
    console.log("Pass: 2. Authenticated route bypass");
  })();

  // Test 3: Offline simulated fallback
  await (async () => {
    console.log("Running: 3. Offline simulated fallback");
    localStorage.clear();
    mockRouter.calls = [];

    // Mock both health check and login POST request to fail
    fetchMockHandler = (url) => {
      return Promise.reject(new Error("Connection refused (Offline API)"));
    };

    const authProviderInstance = new ReactMockRunner(AuthProvider, { children: null });
    authProviderInstance.render();
    authProviderInstance.runEffects();
    await flushPromises();

    const contextVal = capturedContext._currentValue;
    assert.strictEqual(contextVal.isApiOnline, false);

    const loginResult = await contextVal.login("admin@synzlabs.io", "phantom2026!");
    assert.strictEqual(loginResult.success, true);

    // Verify localStorage persistence
    assert.strictEqual(localStorage.getItem("phantom_token"), "mock-simulated-jwt-token-2026");
    const storedUser = JSON.parse(localStorage.getItem("phantom_user"));
    assert.strictEqual(storedUser.email, "admin@synzlabs.io");
    assert.strictEqual(storedUser.isSimulated, true);

    // Verify state updates
    const updatedVal = capturedContext._currentValue;
    assert.strictEqual(updatedVal.token, "mock-simulated-jwt-token-2026");
    assert.strictEqual(updatedVal.user.email, "admin@synzlabs.io");
    assert.strictEqual(updatedVal.user.isSimulated, true);
    assert.strictEqual(updatedVal.isAuthenticated, true);
    console.log("Pass: 3. Offline simulated fallback");
  })();

  // Test 4: Online token storage
  await (async () => {
    console.log("Running: 4. Online token storage");
    localStorage.clear();
    mockRouter.calls = [];

    // Mock API online and returning 200 with JWT
    fetchMockHandler = (url) => {
      if (url === "http://localhost:5000/health") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "healthy" })
        });
      }
      if (url === "http://localhost:5000/api/v1/auth/login") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            token: "valid-online-jwt-2026",
            refreshToken: "refresh-2026",
            user: {
              id: "real-user-123",
              email: "user@synzlabs.io",
              displayName: "Real User",
              role: "User"
            }
          })
        });
      }
      return Promise.reject(new Error("Unknown Mock URL: " + url));
    };

    const authProviderInstance = new ReactMockRunner(AuthProvider, { children: null });
    authProviderInstance.render();
    authProviderInstance.runEffects();
    await flushPromises();

    const contextVal = capturedContext._currentValue;
    assert.strictEqual(contextVal.isApiOnline, true);

    const loginResult = await contextVal.login("user@synzlabs.io", "password");
    assert.strictEqual(loginResult.success, true);

    // Verify localStorage
    assert.strictEqual(localStorage.getItem("phantom_token"), "valid-online-jwt-2026");
    const storedUser = JSON.parse(localStorage.getItem("phantom_user"));
    assert.strictEqual(storedUser.id, "real-user-123");
    assert.strictEqual(storedUser.email, "user@synzlabs.io");
    assert.strictEqual(storedUser.isSimulated, undefined);

    // Verify state updates
    const updatedVal = capturedContext._currentValue;
    assert.strictEqual(updatedVal.token, "valid-online-jwt-2026");
    assert.strictEqual(updatedVal.user.email, "user@synzlabs.io");
    assert.strictEqual(updatedVal.isAuthenticated, true);
    console.log("Pass: 4. Online token storage");
  })();

  // Test 5: Logout clearance
  await (async () => {
    console.log("Running: 5. Logout clearance");
    localStorage.clear();
    localStorage.setItem("phantom_token", "valid-jwt-token-xyz");
    localStorage.setItem("phantom_user", JSON.stringify({
      id: "user-123",
      email: "user@synzlabs.io",
      displayName: "Normal User",
      role: "User"
    }));
    mockRouter.calls = [];

    fetchMockHandler = () => Promise.reject(new Error("Offline"));

    const authProviderInstance = new ReactMockRunner(AuthProvider, { children: null });
    authProviderInstance.render();
    authProviderInstance.runEffects();
    await flushPromises();

    const contextVal = capturedContext._currentValue;
    assert.strictEqual(contextVal.isAuthenticated, true);

    contextVal.logout();

    // Verify clearance in localStorage
    assert.strictEqual(localStorage.getItem("phantom_token"), null);
    assert.strictEqual(localStorage.getItem("phantom_user"), null);

    // Verify state clearance
    const updatedVal = capturedContext._currentValue;
    assert.strictEqual(updatedVal.token, null);
    assert.strictEqual(updatedVal.user, null);
    assert.strictEqual(updatedVal.isAuthenticated, false);

    // Verify redirect
    assert.deepStrictEqual(mockRouter.calls, ["/login"]);
    console.log("Pass: 5. Logout clearance");
  })();

  console.log("All client-side auth tests passed successfully!");
}

runTestSuite().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
