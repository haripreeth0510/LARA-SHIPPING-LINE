import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

# Test user credentials from seed script
CLIENT_EMAIL = "demo@client.com"
PASSWORD = "Client@123"

@pytest.fixture(scope="module")
def client_token():
    """Fixture to get a valid token for the test client."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": CLIENT_EMAIL, "password": PASSWORD}
    )
    assert response.status_code == 200, "Seed data must be loaded for tests"
    return response.json()["data"]["access_token"]


@pytest.fixture(scope="module")
def auth_headers(client_token):
    """Fixture to provide authorization headers."""
    return {"Authorization": f"Bearer {client_token}"}


def test_client_dashboard(auth_headers):
    response = client.get("/api/v1/client/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "active_shipments" in data["data"]


def test_client_shipments_list(auth_headers):
    response = client.get("/api/v1/client/shipments", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "items" in data
    
    if len(data["items"]) > 0:
        shipment_id = data["items"][0]["id"]
        
        # Test specific shipment
        res_single = client.get(f"/api/v1/client/shipments/{shipment_id}", headers=auth_headers)
        assert res_single.status_code == 200
        assert res_single.json()["data"]["id"] == shipment_id
        
        # Test shipment tracking
        res_track = client.get(f"/api/v1/client/shipments/{shipment_id}/tracking", headers=auth_headers)
        assert res_track.status_code == 200


def test_client_quotes(auth_headers):
    response = client.get("/api/v1/client/quotes", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    
    # Request a new quote
    res_create = client.post(
        "/api/v1/client/quotes",
        headers=auth_headers,
        json={
            "origin": "Chennai",
            "destination": "London",
            "cargo_details": "Test Cargo",
            "shipping_method": "FCL"
        }
    )
    assert res_create.status_code == 200
    assert res_create.json()["data"]["status"] == "DRAFT"


def test_client_documents(auth_headers):
    response = client.get("/api/v1/client/documents", headers=auth_headers)
    assert response.status_code == 200


def test_client_invoices(auth_headers):
    response = client.get("/api/v1/client/invoices", headers=auth_headers)
    assert response.status_code == 200


def test_client_support(auth_headers):
    # Create ticket
    res_create = client.post(
        "/api/v1/client/support",
        headers=auth_headers,
        json={
            "subject": "Test Ticket",
            "description": "This is a test ticket."
        }
    )
    assert res_create.status_code == 200
    
    # List tickets
    response = client.get("/api/v1/client/support", headers=auth_headers)
    assert response.status_code == 200


def test_client_notifications(auth_headers):
    response = client.get("/api/v1/client/notifications", headers=auth_headers)
    assert response.status_code == 200
