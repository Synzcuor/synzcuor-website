## 2026-05-25T07:49:43Z

You are teamwork_preview_worker. Your working directory is C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/worker_3.

Your task is to implement a robust verification test suite for client-side authentication, routing, token persistence, and offline fallback session triggers in Next.js.

### Backstory & Context:
The previous implementation used pytest with Python's urllib to verify the page elements. However, since urllib cannot execute JavaScript, it only did basic static HTML string checks. It failed to assert:
1. Client-side routing transitions (redirects).
2. JWT token storage persistence in localStorage.
3. Offline fallback session triggers (simulated credentials).
To fix this, we will implement a Node.js test runner in `e2e_tests/test_auth_logic.js` that compiles the React/Next.js components to CommonJS and executes them in a mocked environment, and integrate it with `e2e_tests/test_routing_auth.py` via subprocess execution.

### Steps to execute:

1. Compile the Next.js auth components using npx tsc to CommonJS so they can be loaded in Node.js:
   Run: `npx tsc --target es2017 --module commonjs --jsx react-jsx --esModuleInterop --skipLibCheck src/context/AuthContext.tsx src/components/ProtectedRoute.tsx --outDir e2e_tests/compiled`
   (Note: Check if `e2e_tests/compiled` exists or is created automatically. If compile errors occur due to path aliases like `@/`, we can either configure compiler path mappings or mock them dynamically in Node.js require-interceptor).

2. Create `e2e_tests/test_auth_logic.js` which:
   - Sets up a dynamic `require` interceptor using Node's `module` library:
     ```javascript
     const Module = require('module');
     const originalRequire = Module.prototype.require;
     Module.prototype.require = function(id) {
       if (id === 'react') return mockReact;
       if (id === 'next/navigation') return mockNavigation;
       if (id === '@/context/AuthContext' || id === '../context/AuthContext') {
         return require('./compiled/context/AuthContext');
       }
       return originalRequire.apply(this, arguments);
     };
     ```
   - Implements a mini-React hooks runner instance `MockReactInstance` to execute function components (`AuthProvider` and `ProtectedRoute`) dynamically, capturing state and running effects.
   - Mocks global `localStorage` (getItem, setItem, removeItem).
   - Mocks global `fetch` (with controllable resolves/rejects to simulate online/offline APIs).
   - Runs test assertions for:
     1. **Unauthenticated route block**: If token is not in localStorage, verify `ProtectedRoute` triggers `router.push('/login')` and displays loading status.
     2. **Authenticated route bypass**: If token is in localStorage, verify `ProtectedRoute` renders children.
     3. **Offline simulated fallback**: Mock `fetch("http://localhost:5000/health")` and `fetch("http://localhost:5000/api/v1/auth/login")` to fail. Call `login("admin@synzlabs.io", "phantom2026!")`, verify it returns success, sets `"phantom_token"` to `"mock-simulated-jwt-token-2026"`, and sets `"phantom_user"` with `isSimulated: true` in localStorage.
     4. **Online token storage**: Mock health checks and login API calls to return 200 with a valid JWT token. Verify that `login("user@synzlabs.io", "password")` stores the returned token and user info correctly in localStorage.
     5. **Logout clearance**: Call `logout()`, verify that the stored tokens/user are removed from localStorage, and router is pushed to `"/login"`.

3. Update `e2e_tests/test_routing_auth.py`:
   - Keep the static urllib page tests (`test_login_page_renders`, `test_dashboard_route_protection`, `test_api_health_endpoint`).
   - Add a new test case `test_client_side_auth_logic()` that runs the compiled typescript compilation command, then runs `node e2e_tests/test_auth_logic.js` via subprocess, asserting that the exit code is 0.

4. Verify compilation & run tests:
   - Run `npm run build` in Next.js workspace to verify no typescript or next compilation issues.
   - Run `dotnet build` in `phantom_console/` C# workspace to verify compilation is clean.
   - Run `python -m pytest e2e_tests/` and confirm all tests compile and pass.

5. Deliver a handoff report in `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/worker_3/handoff.md` summarizing files created, commands run, test outputs, and layouts.
