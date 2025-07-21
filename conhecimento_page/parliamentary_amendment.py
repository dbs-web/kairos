from flask import Blueprint, request, jsonify
from src.models.parliamentary_amendment import ParliamentaryAmendment
from src.models.user import db
import traceback

parliamentary_amendment_bp = Blueprint("parliamentary_amendment_bp", __name__)

@parliamentary_amendment_bp.route("/candidates/<int:candidate_id>/parliamentary_amendments", methods=["POST"])
def create_parliamentary_amendment(candidate_id):
    try:
        data = request.get_json()
        data["candidate_id"] = candidate_id
        new_amendment = ParliamentaryAmendment.from_dict(data)
        db.session.add(new_amendment)
        db.session.commit()
        return jsonify(new_amendment.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@parliamentary_amendment_bp.route("/candidates/<int:candidate_id>/parliamentary_amendments", methods=["GET"])
def get_parliamentary_amendments(candidate_id):
    try:
        amendments = ParliamentaryAmendment.query.filter_by(candidate_id=candidate_id).all()
        return jsonify([amendment.to_dict() for amendment in amendments]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@parliamentary_amendment_bp.route("/parliamentary_amendments/<int:amendment_id>", methods=["PUT"])
def update_parliamentary_amendment(amendment_id):
    try:
        amendment = ParliamentaryAmendment.query.get_or_404(amendment_id)
        data = request.get_json()
        amendment.update_from_dict(data)
        db.session.commit()
        return jsonify(amendment.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@parliamentary_amendment_bp.route("/parliamentary_amendments/<int:amendment_id>", methods=["DELETE"])
def delete_parliamentary_amendment(amendment_id):
    try:
        amendment = ParliamentaryAmendment.query.get_or_404(amendment_id)
        db.session.delete(amendment)
        db.session.commit()
        return jsonify({"message": "Amendment deleted"}), 204
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


