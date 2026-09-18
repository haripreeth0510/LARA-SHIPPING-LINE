import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# Test admin credentials from seed script
ADMIN_EMAIL = "admin@larashippingline.com"
PASSWORD = "Admin@123"

# Test client credentials to ensure they can't access admin routes
CLIENT_EMAIL = "demo@client.com"
CLIENT_PASSWORD = "Client@123"


@pytest.fixture(scope="module")
def admin_token():
    """Fixture to get a valid token for the test admin."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": ADMIN_EMAIL, "password": PASSWORD}
    )
    assert response.status_code == 200, "Seed data must be loaded for tests"
    return response.json()["data"]["access_token"]


@pytest.fixture(scope="module")
def client_token():
    """Fixture to get a valid token for a standard client user."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": CLIENT_EMAIL, "password": CLIENT_PASSWORD}
    )
    assert response.status_code == 200
    return response.json()["data"]["access_token"]


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="module")
def client_headers(client_token):
    return {"Authorization": f"Bearer {client_token}"}


def test_admin_dashboard(admin_headers):
    response = client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "total_clients" in data["data"]


def test_admin_clients(admin_headers):
    # List clients
    response = client.get("/api/v1/admin/clients", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["items"]) > 0


def test_admin_shipments(admin_headers):
    # List shipments
    response = client.get("/api/v1/admin/shipments", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    
    shipment_id = data["items"][0]["id"]
    
    # Add tracking event
    res_event = client.post(
        f"/api/v1/admin/shipments/{shipment_id}/events",
        headers=admin_headers,
        json={
            "status": "IN_TRANSIT",
            "title": "Vessel Departed",
            "description": "Vessel departed from origin port.",
            "location": "Origin Port"
        }
    )
    assert res_event.status_code == 200
    assert res_event.json()["data"]["status"] == "IN_TRANSIT"


def test_admin_quotes(admin_headers):
    response = client.get("/api/v1/admin/quotes", headers=admin_headers)
    assert response.status_code == 200


def test_admin_documents(admin_headers):
    response = client.get("/api/v1/admin/documents", headers=admin_headers)
    assert response.status_code == 200


def test_admin_invoices(admin_headers):
    response = client.get("/api/v1/admin/invoices", headers=admin_headers)
    assert response.status_code == 200


def test_admin_support(admin_headers):
    response = client.get("/api/v1/admin/support", headers=admin_headers)
    assert response.status_code == 200


def test_admin_users(admin_headers):
    response = client.get("/api/v1/admin/users", headers=admin_headers)
    assert response.status_code == 200


def test_rbac_client_forbidden(client_headers):
    """Test that a CLIENT role cannot access ADMIN routes."""
    response = client.get("/api/v1/admin/dashboard", headers=client_headers)
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "INSUFFICIENT_ROLE"
