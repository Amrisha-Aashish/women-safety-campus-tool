import os
from collections import defaultdict
from datetime import datetime, timezone

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

load_dotenv()

app = FastAPI(
    title="Campus Safety Risk Analytics",
    version="0.1.0",
)


def get_connection():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL is not configured."
        )
    return psycopg.connect(database_url)


def risk_level(score: float) -> str:
    if score >= 70:
        return "HIGH"
    if score >= 35:
        return "MEDIUM"
    return "LOW"


@app.get("/health")
def health():
    return {
        "success": True,
        "data": {"status": "ok"}
    }


@app.get("/risk-zones")
def get_risk_zones():
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT
                        latitude,
                        longitude,
                        category,
                        "occurredAt"
                    FROM "Report"
                """)
                reports = cursor.fetchall()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

    zones = defaultdict(lambda: {
        "latitudeTotal": 0.0,
        "longitudeTotal": 0.0,
        "reportCount": 0,
        "weightedScore": 0.0,
        "categories": set()
    })

    category_weights = {
        "EMERGENCY": 5,
        "HARASSMENT": 4,
        "STALKING": 4,
        "UNSAFE_AREA": 2,
        "OTHER": 1
    }

    now = datetime.now(timezone.utc)

    for latitude, longitude, category, occurred_at in reports:
        grid_key = f"{round(latitude, 3)}:{round(longitude, 3)}"
        zone = zones[grid_key]

        age_days = max((now - occurred_at.replace(
            tzinfo=timezone.utc
        )).days, 0)
        recency_multiplier = 2 if age_days <= 30 else 1

        zone["latitudeTotal"] += latitude
        zone["longitudeTotal"] += longitude
        zone["reportCount"] += 1
        zone["weightedScore"] += (
            category_weights.get(category, 1) * recency_multiplier
        )
        zone["categories"].add(category)

    results = []
    for index, zone in enumerate(zones.values(), start=1):
        score = min(round(zone["weightedScore"] * 10, 1), 100)
        count = zone["reportCount"]

        results.append({
            "id": f"risk-zone-{index}",
            "zoneName": f"Risk Zone {index}",
            "latitude": round(zone["latitudeTotal"] / count, 6),
            "longitude": round(zone["longitudeTotal"] / count, 6),
            "reportCount": count,
            "riskScore": score,
            "riskLevel": risk_level(score),
            "reason": (
                f"{count} report(s), categories: "
                f"{', '.join(sorted(zone['categories']))}"
            )
        })

    return {
        "success": True,
        "data": sorted(
            results,
            key=lambda zone: zone["riskScore"],
            reverse=True
        )
    }


@app.get("/red-time-zones")
def get_red_time_zones():
    try:
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT EXTRACT(HOUR FROM "occurredAt")::int AS hour,
                           COUNT(*)::int AS report_count
                    FROM "Report"
                    GROUP BY hour
                    ORDER BY report_count DESC, hour ASC
                """)
                rows = cursor.fetchall()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

    results = []
    for hour, report_count in rows:
        score = min(report_count * 25, 100)
        results.append({
            "hour": hour,
            "timeRange": (
                f"{hour:02d}:00–{(hour + 1) % 24:02d}:00"
            ),
            "reportCount": report_count,
            "riskScore": score,
            "riskLevel": risk_level(score)
        })

    return {"success": True, "data": results}