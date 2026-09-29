# Handoff Report — explorer_1

## 1. Observation
We observed the following files and directories in the workspace:
* **C# Backend CORS configuration**:
  In `SynzPhantom.API/Program.cs` lines 112-116:
  ```csharp
  builder.Services.AddCors(options =>
  {
      options.AddDefaultPolicy(policy =>
          policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
  });
  ```
* **C# Endpoint Structure**:
  In `SynzPhantom.API/Controllers/AuthController.cs` lines 28-42:
  ```csharp
  [HttpPost("login")]
  public async Task<IActionResult> Login([FromBody] LoginRequest request)
  {
      var user = await _identity.AuthenticateAsync(request.Email, request.Password);
      if (user == null)
          return Unauthorized(new { error = "Invalid email or password" });
      ...
      return Ok(new LoginResponse(token, refreshToken, expiresAt, UserDto.From(user)));
  }
  ```
* **C# Authentication Processing**:
  In `SynzPhantom.API/Middleware/AuthMiddleware.cs` lines 58-61:
  ```csharp
  var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
  if (authHeader?.StartsWith("Bearer ") == true)
  {
      var token = authHeader["Bearer ".Length..];
  ```
* **Next.js Project Layout**:
  - Root directory contains `package.json`, `tsconfig.json`, `next.config.ts`, and `src/`.
  - `src/` directory contains only `app/layout.tsx` and `app/page.tsx`.
* **Next.js Breaking Changes & Custom Conventions**:
  In `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md` lines 672-680:
  ```markdown
  ## Proxy
  Only one `proxy` file is allowed per project. Use `config.matcher` to target specific paths. Learn more about `proxy`.
  Use `proxy` to generate a response before the request reaches a route path.
  ```

---

## 2. Logic Chain
1. **CORS credentials constraint**: Because we need to support credentials originating from `http://localhost:3000`, the C# backend cannot use `AllowAnyOrigin()`. Browsers block cross-origin requests carrying credentials when the backend returns `Access-Control-Allow-Origin: *`. Therefore, we must explicitly permit `http://localhost:3000` via `.WithOrigins(...)` and enable credentials transmission with `.AllowCredentials()`.
2. **JWT Storage**: In modern Next.js client-side applications, storing JWT tokens in `localStorage` allows session state persistence across browser refreshes but is vulnerable to XSS. Using secure, `HttpOnly` cookies via Next.js Route Handlers (BFF pattern) protects against XSS. We proposed a hybrid design that details direct client-side storage for quick integration alongside BFF proxy handlers for production hardening.
3. **API Offline Fallback**: The client-side dashboard (`app/page.tsx`) already contains mock simulated states. If the C# backend API is offline (e.g. backend server is not running and health check `/health` fails), the authentication logic can catch the connection failure during login and check if the credentials match the hardcoded values: `admin@synzlabs.io` / `phantom2026!`. If valid, it initializes a mock session and sets a flag `isSimulated: true`.
4. **Next.js Interception Hook**: The Next.js workspace environment does not support standard `middleware.ts`. In accordance with the local docs in `node_modules/next/dist/docs/`, route interception must be written in a root-level `proxy.ts` file.

---

## 3. Caveats
* **No dynamic validation of offline credentials**: Since the API is offline during fallback, the client cannot check user databases and must rely strictly on the simulated credentials `admin@synzlabs.io` / `phantom2026!`.
* **No network execution performed**: The analysis was completed via read-only inspection. We did not run the servers to execute the actual C# backend or Next.js build.

---

## 4. Conclusion
We recommend:
1. Updating C# CORS policy in `Program.cs` to explicitly authorize origins matching `http://localhost:3000` with `.AllowCredentials()`.
2. Implementing an `AuthContext` in Next.js that tests connection status on boot, routes authentication queries, and intercepts offline failures to authenticate local simulation credentials.
3. Aligning Next.js routing protection with the custom environment convention of using `proxy.ts` rather than `middleware.ts`.

Refer to the complete design recommendations in:
`C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/explorer_1/analysis.md`

---

## 5. Verification Method
Verify by inspecting:
* **Analysis File**: Read `C:/Users/Adminb/.gemini/antigravity/worktrees/SYNLabWebsite/improve-synz-phantom-reads/.agents/explorer_1/analysis.md` to confirm the proposed modifications and TSX scripts.
* **C# Program CORS Policy**: Check `SynzPhantom.API/Program.cs` at line 112 to ensure the current CORS config does not support credentials, confirming the need for the change.
* **Custom Next.js Docs**: Read `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md` around line 672 to verify the `proxy.ts` config convention.
