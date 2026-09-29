# ==============================================================================
# proposed_test_routing_auth.py — Automated Validation for Routing & JWT
# ==============================================================================

import urllib.request
import urllib.parse
import json
import pytest
from html.parser import HTMLParser

# Base URL configuration (aligned with conftest.py)
NEXTJS_URL = "http://localhost:3000"
API_URL = "http://localhost:5000"

class ConsolePageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inputs = []
        self.buttons = []
        self.spans = []
        self.divs = []
        self.current_tag = None
        self.current_attrs = {}

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        self.current_attrs = dict(attrs)
        if tag == "input":
            self.inputs.append(self.current_attrs)

    def handle_data(self, data):
        cleaned = data.strip()
        if not cleaned:
            return
        if self.current_tag == "button":
            self.buttons.append((cleaned, self.current_attrs))
        elif self.current_tag == "span":
            self.spans.append((cleaned, self.current_attrs))
        elif self.current_tag == "div":
            self.divs.append((cleaned, self.current_attrs))

    def handle_endtag(self, tag):
        self.current_tag = None
        self.current_attrs = {}

def get_parsed_route(route_path):
    url = f"{NEXTJS_URL}{route_path}"
    try:
        response = urllib.request.urlopen(url, timeout=3)
        html = response.read().decode('utf-8')
        parser = ConsolePageParser()
        parser.feed(html)
        return parser, html, response.getcode()
    except Exception as e:
        pytest.fail(f"Failed to fetch or parse route {route_path}: {e}")

# ==============================================================================
# Routing & Page Rendering Validation
# ==============================================================================

def test_tc_route_01_login_page_rendering():
    """Verify that the console login route loads successfully and displays required fields."""
    parser, html, code = get_parsed_route("/console/login")
    
    assert code == 200, "Login route did not return a 200 OK status."
    
    # Assert presence of login input fields
    input_ids = [inp.get("id", "").lower() for inp in parser.inputs]
    assert "email-input" in input_ids, "Email input element missing from login page."
    assert "password-input" in input_ids, "Password input element missing from login page."
    
    # Assert presence of submit button
    btn_ids = [attrs.get("id", "") for label, attrs in parser.buttons]
    assert "login-submit-btn" in btn_ids, "Login submit button is missing."

def test_tc_route_02_dashboard_page_rendering():
    """Verify that the dashboard page renders structure and layout correctly."""
    parser, html, code = get_parsed_route("/console/dashboard")
    
    assert code == 200, "Dashboard route did not return a 200 OK status."
    
    # Assert presence of dashboard identity elements
    html_lower = html.lower()
    assert "synz console" in html_lower, "Dashboard branding title not found."
    
    # Assert presence of API connection status element
    span_ids = [attrs.get("id", "") for label, attrs in parser.spans]
    assert "api-connection-status" in span_ids, "API connection status badge is missing."

# ==============================================================================
# JWT Storage & Client-Side Guard Validation
# ==============================================================================

def test_tc_jwt_01_client_side_redirect_checks():
    """Ensure client-side script guards exist to redirect unauthenticated users on the dashboard."""
    parser, html, _ = get_parsed_route("/console/dashboard")
    
    # Check that the dashboard contains JWT verification script hooks
    assert "synz_token" in html, "Dashboard missing verification checks for 'synz_token'."
    assert "localStorage.getItem" in html, "Dashboard missing localStorage session lookup."
    assert "router.push" in html or "login" in html, "Dashboard missing redirection fallback script."

def test_tc_jwt_02_login_payload_handling():
    """Ensure login submission script handles and stores JWT response fields correctly."""
    parser, html, _ = get_parsed_route("/console/login")
    
    # Assert that the page scripts contain handlers for saving authentication parameters
    html_lower = html.lower()
    assert "synz_token" in html_lower, "Login page scripts do not save JWT token."
    assert "synz_refresh_token" in html_lower, "Login page scripts do not save refresh token."
    assert "synz_user" in html_lower, "Login page scripts do not save user metadata."

# ==============================================================================
# API Connection State Detection Validation
# ==============================================================================

def test_tc_api_state_01_connection_badge_placeholders():
    """Verify the UI connection state indicators are present on the dashboard."""
    parser, html, _ = get_parsed_route("/console/dashboard")
    
    # Verify indicator labels are in HTML structure or javascript states
    html_lower = html.lower()
    assert "connected" in html_lower, "Connection state connected indicator is missing."
    assert "offline" in html_lower, "Connection state offline indicator is missing."
    assert "error" in html_lower, "Connection state authentication error indicator is missing."

def test_tc_api_state_02_connection_loss_banners():
    """Verify presence of fallbacks/warning banners on connection drops."""
    parser, html, _ = get_parsed_route("/console/dashboard")
    
    # Verify the dashboard contains element hooks for offline warning dialogs
    div_ids = [attrs.get("id", "") for label, attrs in parser.divs]
    assert "connection-warning" in div_ids or "connection-warning" in html, \
        "Missing connection-warning banner element for network offline drops."
