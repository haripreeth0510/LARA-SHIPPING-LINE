import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.user import User, UserRole

client = TestClient(app)


def test_public_tracking_success():
    # Based on seed data
    tracking_number = "LARA-2026-0001"
    response = client.get(f"/api/v1/public/tracking/{tracking_number}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["tracking_number"] == tracking_number
    assert "events" in data["data"]


def test_public_tracking_not_found():
    response = client.get("/api/v1/public/tracking/INVALID-TRACKING")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "SHIPMENT_NOT_FOUND"


def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@larashippingline.com", "password": "Admin@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["role"] == "ADMIN"


def test_login_invalid_credentials():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@larashippingline.com", "password": "WrongPassword"}
    )
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_CREDENTIALS"
