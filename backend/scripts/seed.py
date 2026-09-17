"""
Seed script — populates the database with demo data.

Run with:
    python -m scripts.seed
"""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.security import hash_password
from app.core.database import SessionLocal

# Import via base to avoid circular imports — base.py controls the import order
from app.models.base import Base  # noqa: F401 — triggers all model imports
from app.models.user import User, UserRole
from app.models.client import Client, ClientStatus
from app.models.shipment import Shipment, ShipmentStatus, ShipmentType
from app.models.shipment_event import ShipmentEvent
from app.models.quote import Quote, QuoteStatus
from app.models.document import Document, DocumentType
from app.models.invoice import Invoice, InvoiceStatus
from app.models.support_ticket import SupportTicket, TicketPriority, TicketStatus
from app.models.notification import Notification
from app.models.audit_log import AuditLog


def seed():
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == "admin@larashippingline.com").first():
            print("✓ Database already seeded. Skipping.")
            return

        print("Seeding database...")
        now = datetime.now(timezone.utc)

        # ── Clients ─────────────────────────────────────────────
        clients_data = [
            {"company_name": "Global Trade Solutions LLC", "contact_name": "John Smith",
             "email": "demo@client.com", "phone": "+971-55-111-2222",
             "address": "Business Bay, Tower A, Floor 12", "country": "UAE"},
            {"company_name": "Ocean Cargo India Pvt Ltd", "contact_name": "Sarah Johnson",
             "email": "sarah@oceancargo.com", "phone": "+91-98765-43210",
             "address": "Anna Nagar, Industrial Zone, Sector 4", "country": "India"},
            {"company_name": "Swift Logistics Pte Ltd", "contact_name": "Michael Chen",
             "email": "michael@swiftlogistics.com", "phone": "+65-9123-4567",
             "address": "Jurong Port Road, Block 15", "country": "Singapore"},
        ]

        client_records = []
        for cd in clients_data:
            client = Client(
                company_name=cd["company_name"], contact_name=cd["contact_name"],
                email=cd["email"], phone=cd["phone"],
                address=cd["address"], country=cd["country"],
                status=ClientStatus.ACTIVE,
            )
            db.add(client)
            db.flush()
            client_records.append(client)
        print(f"  ✓ {len(client_records)} clients created")

        # ── Admin User ──────────────────────────────────────────
        admin = User(
            email="admin@larashippingline.com",
            password_hash=hash_password("Admin@123"),
            full_name="LARA Admin",
            phone="+971-50-123-4567",
            role=UserRole.ADMIN,
            is_active=True,
        )
        db.add(admin)
        db.flush()
        print(f"  ✓ Admin: {admin.email}")

        # ── Client Users ────────────────────────────────────────
        client_users = []
        for i, cd in enumerate(clients_data):
            user = User(
                email=cd["email"],
                password_hash=hash_password("Client@123"),
                full_name=cd["contact_name"],
                phone=cd["phone"],
                role=UserRole.CLIENT,
                is_active=True,
                client_id=client_records[i].id,
            )
            db.add(user)
            db.flush()
            client_users.append(user)
            print(f"  ✓ Client: {cd['email']}")

        # ── Shipments ───────────────────────────────────────────
        shipments_data = [
            {"tn": "LARA-2026-0001", "ci": 0, "t": ShipmentType.FCL, "o": "Chennai, India",
             "d": "Jebel Ali, Dubai", "v": "MSC Isabella", "vn": "VI-2026-045",
             "cn": "MSCU1234567", "cargo": "Automotive parts — brake pads and rotors",
             "w": 18500.0, "vol": 32.5, "s": ShipmentStatus.IN_TRANSIT, "da": 12,
             "carrier": "MSC", "ct": "40HC"},
            {"tn": "LARA-2026-0002", "ci": 0, "t": ShipmentType.LCL, "o": "Mumbai, India",
             "d": "Jebel Ali, Dubai", "v": "Maersk Seletar", "vn": "MS-2026-112",
             "cn": "MAEU7654321", "cargo": "Textile goods — cotton fabric rolls",
             "w": 4200.0, "vol": 8.5, "s": ShipmentStatus.DELIVERED, "da": 30,
             "carrier": "Maersk", "ct": "20GP"},
            {"tn": "LARA-2026-0003", "ci": 0, "t": ShipmentType.AIR, "o": "Delhi, India",
             "d": "Dubai International Airport", "v": None, "vn": "EK-505",
             "cn": None, "cargo": "Electronic components — PCB boards",
             "w": 350.0, "vol": 1.2, "s": ShipmentStatus.CUSTOMS_CLEARANCE, "da": 3,
             "carrier": "Emirates SkyCargo", "ct": None},
            {"tn": "LARA-2026-0004", "ci": 1, "t": ShipmentType.FCL, "o": "Nhava Sheva, India",
             "d": "Singapore", "v": "Evergreen Ever Given", "vn": "EG-2026-088",
             "cn": "EGHU9988776", "cargo": "Steel coils — hot rolled",
             "w": 24000.0, "vol": 45.0, "s": ShipmentStatus.DEPARTED, "da": 5,
             "carrier": "Evergreen", "ct": "40GP"},
            {"tn": "LARA-2026-0005", "ci": 1, "t": ShipmentType.FCL, "o": "Colombo, Sri Lanka",
             "d": "Chennai, India", "v": "ONE Commitment", "vn": "ON-2026-201",
             "cn": "ONEU1122334", "cargo": "Tea — premium Ceylon tea crates",
             "w": 8000.0, "vol": 18.0, "s": ShipmentStatus.BOOKING_CONFIRMED, "da": 1,
             "carrier": "ONE", "ct": "20GP"},
            {"tn": "LARA-2026-0006", "ci": 1, "t": ShipmentType.ROAD, "o": "Bangalore, India",
             "d": "Chennai, India", "v": None, "vn": None,
             "cn": None, "cargo": "Pharmaceutical supplies — packaged medicines",
             "w": 2500.0, "vol": 6.0, "s": ShipmentStatus.DELIVERED, "da": 20,
             "carrier": "BlueDart Logistics", "ct": None},
            {"tn": "LARA-2026-0007", "ci": 1, "t": ShipmentType.LCL, "o": "Singapore",
             "d": "Jebel Ali, Dubai", "v": "CMA CGM Marco Polo", "vn": "CG-2026-155",
             "cn": "CMAU5544332", "cargo": "Consumer electronics — smartphones",
             "w": 3000.0, "vol": 5.0, "s": ShipmentStatus.ARRIVED, "da": 7,
             "carrier": "CMA CGM", "ct": "20GP"},
            {"tn": "LARA-2026-0008", "ci": 2, "t": ShipmentType.FCL, "o": "Shanghai, China",
             "d": "Singapore", "v": "COSCO Shipping Universe", "vn": "CS-2026-300",
             "cn": "COSU8877665", "cargo": "Industrial machinery — CNC components",
             "w": 32000.0, "vol": 55.0, "s": ShipmentStatus.CONTAINER_LOADED, "da": 3,
             "carrier": "COSCO", "ct": "40HC"},
            {"tn": "LARA-2026-0009", "ci": 2, "t": ShipmentType.AIR, "o": "Tokyo, Japan",
             "d": "Singapore Changi Airport", "v": None, "vn": "SQ-636",
             "cn": None, "cargo": "Semiconductor wafers — fragile",
             "w": 120.0, "vol": 0.5, "s": ShipmentStatus.DELIVERED, "da": 14,
             "carrier": "Singapore Airlines Cargo", "ct": None},
            {"tn": "LARA-2026-0010", "ci": 2, "t": ShipmentType.FCL, "o": "Busan, South Korea",
             "d": "Singapore", "v": "HMM Algeciras", "vn": "HM-2026-078",
             "cn": "HMMU3344556", "cargo": "Automotive — electric vehicle batteries",
             "w": 28000.0, "vol": 50.0, "s": ShipmentStatus.OUT_FOR_DELIVERY, "da": 9,
             "carrier": "HMM", "ct": "40HC"},
        ]

        shipment_records = []
        for sd in shipments_data:
            bk = now - timedelta(days=sd["da"])
            ed = bk + timedelta(days=2)
            ea = ed + timedelta(days=14)
            shipment = Shipment(
                tracking_number=sd["tn"], client_id=client_records[sd["ci"]].id,
                shipment_type=sd["t"], origin=sd["o"], destination=sd["d"],
                vessel_name=sd["v"], voyage_number=sd["vn"], container_number=sd["cn"],
                container_type=sd["ct"], carrier=sd["carrier"],
                cargo_description=sd["cargo"], weight=sd["w"], volume=sd["vol"],
                booking_date=bk, estimated_departure=ed,
                actual_departure=ed if sd["s"] != ShipmentStatus.BOOKING_CONFIRMED else None,
                estimated_arrival=ea,
                actual_arrival=ea if sd["s"] == ShipmentStatus.DELIVERED else None,
                status=sd["s"],
            )
            db.add(shipment)
            db.flush()
            shipment_records.append(shipment)
        print(f"  ✓ {len(shipment_records)} shipments created")

        # ── Shipment Events ─────────────────────────────────────
        status_chain = [
            ShipmentStatus.BOOKING_CONFIRMED, ShipmentStatus.CARGO_RECEIVED,
            ShipmentStatus.CONTAINER_LOADED, ShipmentStatus.DEPARTED,
            ShipmentStatus.IN_TRANSIT, ShipmentStatus.ARRIVED,
            ShipmentStatus.CUSTOMS_CLEARANCE, ShipmentStatus.OUT_FOR_DELIVERY,
            ShipmentStatus.DELIVERED,
        ]
        titles = {
            ShipmentStatus.BOOKING_CONFIRMED: "Booking Confirmed",
            ShipmentStatus.CARGO_RECEIVED: "Cargo Received",
            ShipmentStatus.CONTAINER_LOADED: "Container Loaded",
            ShipmentStatus.DEPARTED: "Departed",
            ShipmentStatus.IN_TRANSIT: "In Transit",
            ShipmentStatus.ARRIVED: "Arrived",
            ShipmentStatus.CUSTOMS_CLEARANCE: "Customs Clearance",
            ShipmentStatus.OUT_FOR_DELIVERY: "Out for Delivery",
            ShipmentStatus.DELIVERED: "Delivered",
        }
        descriptions = {
            ShipmentStatus.BOOKING_CONFIRMED: "Booking confirmed and processed.",
            ShipmentStatus.CARGO_RECEIVED: "Cargo received at origin warehouse.",
            ShipmentStatus.CONTAINER_LOADED: "Cargo loaded into container.",
            ShipmentStatus.DEPARTED: "Departed from origin port.",
            ShipmentStatus.IN_TRANSIT: "Shipment in transit.",
            ShipmentStatus.ARRIVED: "Arrived at destination.",
            ShipmentStatus.CUSTOMS_CLEARANCE: "Customs clearance in progress.",
            ShipmentStatus.OUT_FOR_DELIVERY: "Out for final delivery.",
            ShipmentStatus.DELIVERED: "Shipment delivered successfully.",
        }
        event_count = 0
        for shipment in shipment_records:
            current_idx = next(
                (i for i, s in enumerate(status_chain) if s == shipment.status),
                0,
            )
            for i in range(current_idx + 1):
                st = status_chain[i]
                evt_time = shipment.booking_date + timedelta(days=i, hours=i * 3)
                loc = shipment.origin if i < 4 else shipment.destination
                db.add(ShipmentEvent(
                    shipment_id=shipment.id, status=st.value,
                    title=titles.get(st, st.value),
                    description=descriptions.get(st, "Status updated."),
                    location=loc, event_time=evt_time, created_by=admin.id,
                ))
                event_count += 1
        print(f"  ✓ {event_count} shipment events created")

        # ── Quotes ──────────────────────────────────────────────
        quotes = [
            {"n": "QT-2026-001", "ci": 0, "o": "Chennai", "d": "Rotterdam",
             "st": QuoteStatus.SENT, "amt": 4500.0},
            {"n": "QT-2026-002", "ci": 0, "o": "Mumbai", "d": "Hamburg",
             "st": QuoteStatus.ACCEPTED, "amt": 1800.0},
            {"n": "QT-2026-003", "ci": 1, "o": "Singapore", "d": "Los Angeles",
             "st": QuoteStatus.DRAFT, "amt": None},
            {"n": "QT-2026-004", "ci": 1, "o": "Chennai", "d": "Colombo",
             "st": QuoteStatus.DRAFT, "amt": None},
            {"n": "QT-2026-005", "ci": 2, "o": "Busan", "d": "Singapore",
             "st": QuoteStatus.REJECTED, "amt": 6200.0},
        ]
        for qd in quotes:
            q = Quote(
                quote_number=qd["n"], client_id=client_records[qd["ci"]].id,
                origin=qd["o"], destination=qd["d"], cargo_details="General cargo",
                shipping_method="FCL", currency="USD", status=qd["st"],
                valid_until=now + timedelta(days=30),
            )
            if qd["amt"]:
                q.base_amount = qd["amt"] * 0.85
                q.tax_amount = qd["amt"] * 0.15
                q.total_amount = qd["amt"]
            db.add(q)
        db.flush()
        print(f"  ✓ {len(quotes)} quotes created")

        # ── Invoices ────────────────────────────────────────────
        inv_data = [
            {"n": "INV-2026-001", "ci": 0, "si": 1, "amt": 3200.0,
             "st": InvoiceStatus.PAID, "dd": -15},
            {"n": "INV-2026-002", "ci": 0, "si": 0, "amt": 5800.0,
             "st": InvoiceStatus.ISSUED, "dd": 15},
            {"n": "INV-2026-003", "ci": 1, "si": 5, "amt": 2100.0,
             "st": InvoiceStatus.PAID, "dd": -10},
            {"n": "INV-2026-004", "ci": 1, "si": 3, "amt": 7500.0,
             "st": InvoiceStatus.ISSUED, "dd": 20},
            {"n": "INV-2026-005", "ci": 2, "si": 8, "amt": 4200.0,
             "st": InvoiceStatus.OVERDUE, "dd": -5},
        ]
        for iv in inv_data:
            invoice = Invoice(
                invoice_number=iv["n"], client_id=client_records[iv["ci"]].id,
                shipment_id=shipment_records[iv["si"]].id,
                amount=iv["amt"] * 0.85, tax=iv["amt"] * 0.15, total=iv["amt"],
                currency="USD", issue_date=now - timedelta(days=30),
                due_date=now + timedelta(days=iv["dd"]), status=iv["st"],
            )
            db.add(invoice)
        db.flush()
        print(f"  ✓ {len(inv_data)} invoices created")

        # ── Documents ───────────────────────────────────────────
        docs = [
            {"si": 1, "ci": 0, "t": DocumentType.BILL_OF_LADING, "f": "BOL_LARA-2026-0002.pdf"},
            {"si": 1, "ci": 0, "t": DocumentType.COMMERCIAL_INVOICE, "f": "CI_LARA-2026-0002.pdf"},
            {"si": 1, "ci": 0, "t": DocumentType.PACKING_LIST, "f": "PL_LARA-2026-0002.pdf"},
            {"si": 5, "ci": 1, "t": DocumentType.BILL_OF_LADING, "f": "BOL_LARA-2026-0006.pdf"},
            {"si": 8, "ci": 2, "t": DocumentType.CUSTOMS_DOCUMENT, "f": "CD_LARA-2026-0009.pdf"},
        ]
        for dd in docs:
            db.add(Document(
                shipment_id=shipment_records[dd["si"]].id,
                client_id=client_records[dd["ci"]].id,
                document_type=dd["t"], file_name=dd["f"],
                storage_path=f"shipment-documents/{dd['f']}",
                mime_type="application/pdf", file_size=1024000,
                uploaded_by=admin.id,
            ))
        db.flush()
        print(f"  ✓ {len(docs)} documents created")

        # ── Support Tickets ─────────────────────────────────────
        tickets = [
            {"ci": 0, "n": "TKT-2026-001", "subj": "Shipment LARA-2026-0001 delay inquiry",
             "desc": "Our shipment appears delayed. Can you provide an updated ETA?",
             "p": TicketPriority.HIGH, "s": TicketStatus.OPEN},
            {"ci": 1, "n": "TKT-2026-002", "subj": "Bill of Lading correction needed",
             "desc": "The consignee name on BOL for LARA-2026-0006 has a typo.",
             "p": TicketPriority.MEDIUM, "s": TicketStatus.IN_PROGRESS},
            {"ci": 2, "n": "TKT-2026-003", "subj": "Invoice dispute — INV-2026-005",
             "desc": "Invoice amount does not match agreed quote.",
             "p": TicketPriority.URGENT, "s": TicketStatus.OPEN},
        ]
        for td in tickets:
            db.add(SupportTicket(
                ticket_number=td["n"], client_id=client_records[td["ci"]].id,
                subject=td["subj"], description=td["desc"],
                priority=td["p"], status=td["s"],
                assigned_to=admin.id if td["s"] == TicketStatus.IN_PROGRESS else None,
            ))
        db.flush()
        print(f"  ✓ {len(tickets)} support tickets created")

        # ── Notifications ───────────────────────────────────────
        notifs = [
            ("SHIPMENT_STATUS", "Shipment Update",
             "Your shipment LARA-2026-0001 is now IN TRANSIT.", client_users[0]),
            ("QUOTE_UPDATE", "Quote Received",
             "Your quote QT-2026-001 has been priced.", client_users[0]),
            ("INVOICE", "Invoice Issued",
             "Invoice INV-2026-002 issued. Amount: $5,800.", client_users[0]),
            ("SHIPMENT_STATUS", "Shipment Delivered",
             "Your shipment LARA-2026-0006 has been delivered.", client_users[1]),
            ("DOCUMENT", "Document Uploaded",
             "New Bill of Lading uploaded for LARA-2026-0006.", client_users[1]),
            ("SHIPMENT_STATUS", "Shipment Delivered",
             "Your shipment LARA-2026-0009 has been delivered.", client_users[2]),
        ]
        for ntype, title, msg, usr in notifs:
            db.add(Notification(
                user_id=usr.id, type=ntype, title=title, message=msg,
            ))
        db.flush()
        print(f"  ✓ {len(notifs)} notifications created")

        # ── Audit Logs ──────────────────────────────────────────
        audits = [
            ("CREATE_USER", "USER", admin.id, {"description": "Admin user created"}),
            ("CREATE_SHIPMENT", "SHIPMENT", shipment_records[0].id,
             {"description": "Shipment LARA-2026-0001 created"}),
            ("CHANGE_SHIPMENT_STATUS", "SHIPMENT", shipment_records[0].id,
             {"old_status": "BOOKING_CONFIRMED", "new_status": "IN_TRANSIT"}),
            ("CREATE_QUOTE", "QUOTE", None, {"description": "Quote QT-2026-001 created"}),
            ("CREATE_INVOICE", "INVOICE", None, {"description": "Invoice INV-2026-001 created"}),
        ]
        for action, etype, eid, data in audits:
            db.add(AuditLog(
                actor_user_id=admin.id, action=action,
                entity_type=etype, entity_id=eid, new_data=data,
            ))
        db.flush()
        print(f"  ✓ {len(audits)} audit log entries created")

        db.commit()
        print("\n✅ Database seeded successfully!")
        print("\n  Login credentials:")
        print("  ─────────────────")
        print("  Admin:   admin@larashippingline.com / Admin@123")
        print("  Client1: demo@client.com / Client@123")
        print("  Client2: sarah@oceancargo.com / Client@123")
        print("  Client3: michael@swiftlogistics.com / Client@123")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seeding failed: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
