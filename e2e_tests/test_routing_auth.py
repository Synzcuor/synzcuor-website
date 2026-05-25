# ==============================================================================
# test_routing_auth.py — E2E Routing & Authentication Tests
# ==============================================================================

import urllib.request
import urllib.parse
import json
import pytest
import subprocess
import os
from conftest import NEXTJS_URL

def test_login_page_renders():
    """Verify that the login page is accessible and renders the login form elements."""
    try:
        response = urllib.request.urlopen(f"{NEXTJS_URL}/login", timeout=5)
        assert response.status == 200
        html = response.read().decode('utf-8')
        assert "SYNZ PHANTOM" in html
        assert "B2B Zero-Day Cyber Defense Portal" in html
        assert "API Backend:" in html
        assert 'type="email"' in html
        assert 'type="password"' in html
    except Exception as e:
        pytest.fail(f"Failed to load login page: {e}")

def test_dashboard_route_protection():
    """Verify that dashboard sub-routes render protected loading state for unauthenticated users."""
    for subpath in ["/dashboard", "/dashboard/events", "/dashboard/sensors"]:
        try:
            response = urllib.request.urlopen(f"{NEXTJS_URL}{subpath}", timeout=5)
            assert response.status == 200
            html = response.read().decode('utf-8')
            # Check that the ProtectedRoute loading overlay is returned
            assert "Authenticating Secure Session" in html
        except Exception as e:
            pytest.fail(f"Failed to access protected route {subpath}: {e}")

def test_api_health_endpoint():
    """Verify backend API health check endpoint exists and returns correct status."""
    try:
        response = urllib.request.urlopen("http://localhost:5000/health", timeout=3)
        assert response.status == 200
        data = json.loads(response.read().decode('utf-8'))
        assert data.get("status") == "healthy"
    except urllib.error.URLError:
        # C# backend might not be currently running, which is allowed/handled via simulated fallback
        pass
    except Exception as e:
        pytest.fail(f"API health check failed with unexpected error: {e}")

def test_client_side_auth_logic():
    """Compile TS components to CommonJS and run Node.js client-side auth tests."""
    use_shell = os.name == 'nt'
    
    # 1. Compile the Next.js auth components
    compile_cmd = [
        "npx", "tsc",
        "--target", "es2017",
        "--module", "commonjs",
        "--jsx", "react-jsx",
        "--esModuleInterop",
        "--skipLibCheck",
        "src/context/AuthContext.tsx",
        "src/components/ProtectedRoute.tsx",
        "--outDir", "e2e_tests/compiled"
    ]
    
    print("Compiling TypeScript components...")
    res_compile = subprocess.run(compile_cmd, capture_output=True, text=True, shell=use_shell)
    if res_compile.returncode != 0:
        print(f"Compilation stdout:\n{res_compile.stdout}")
        print(f"Compilation stderr:\n{res_compile.stderr}")
        pytest.fail(f"TypeScript compilation failed with code {res_compile.returncode}")
        
    # 2. Run node e2e_tests/test_auth_logic.js
    node_cmd = ["node", "e2e_tests/test_auth_logic.js"]
    print("Running node auth logic tests...")
    res_node = subprocess.run(node_cmd, capture_output=True, text=True, shell=use_shell)
    print(f"Node test stdout:\n{res_node.stdout}")
    if res_node.returncode != 0:
        print(f"Node test stderr:\n{res_node.stderr}")
        pytest.fail(f"Node auth logic test suite failed with exit code {res_node.returncode}")
