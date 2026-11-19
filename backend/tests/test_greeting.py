def test_get_greeting(client):
    response = client.get("/api/v1/greeting")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Hello" in data["message"]
