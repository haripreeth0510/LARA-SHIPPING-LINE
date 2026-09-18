import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_public_shipment_tracking():
    # Attempt to track a valid shipment from seed data
    # We'll use the hardcoded tracking number LARA-2026-0001
    valid_tracking_number = "LARA-2026-0001"
    
    response = client.get(f"/api/v1/tracking/{valid_tracking_number}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["tracking_number"] == valid_tracking_number
    # Verify no internal financial data is leaked (e.g. no invoices)
    assert "invoices" not in data["data"]


def test_public_shipment_tracking_invalid():
    # Attempt to track a non-existent shipment
    response = client.get("/api/v1/tracking/INVALID-TRACKING")
    
    assert response.status_code == 404
    data = response.json()
    assert data["error"]["code"] == "SHIPMENT_NOT_FOUND"


def test_public_quote_request():
    # Submit a quote request as an unauthenticated user
    payload = {
        "company_name": "New Prospect LLC",
        "contact_name": "Jane Doe",
        "email": "jane.prospect@example.com",
        "phone": "+1234567890",
        "origin": "Shanghai",
        "destination": "Los Angeles",
        "cargo_details": "10 Pallets of Electronics",
        "weight": 2500.5,
        "volume": 12.0,
        "shipping_method": "FCL"
    }
    
    response = client.post("/api/v1/public/quotes/request", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "quote_id" in data["data"]
    assert data["data"]["status"] == "DRAFT"
