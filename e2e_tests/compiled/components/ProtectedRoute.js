"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const AuthContext_1 = require("../context/AuthContext");
function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = (0, AuthContext_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);
    if (isLoading || !isAuthenticated) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-[#04060a] text-zinc-100 flex items-center justify-center font-mono", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full border border-cyan-glow border-t-transparent animate-spin" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs uppercase tracking-widest text-zinc-500 animate-pulse", children: "Authenticating Secure Session..." })] }) }));
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
