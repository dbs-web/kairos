from flask import Blueprint, request, jsonify
from src.models.research_cross_section import ResearchCrossSection
from src.models.user import db
import traceback

research_cross_section_bp = Blueprint("research_cross_section_bp", __name__)

@research_cross_section_bp.route("/research_data/<int:research_id>/cross_sections", methods=["POST"])
def create_research_cross_section(research_id):
    try:
        data = request.get_json()
        data["research_id"] = research_id
        new_cross_section = ResearchCrossSection.from_dict(data)
        db.session.add(new_cross_section)
        db.session.commit()
        return jsonify(new_cross_section.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@research_cross_section_bp.route("/research_data/<int:research_id>/cross_sections", methods=["GET"])
def get_research_cross_sections(research_id):
    try:
        cross_sections = ResearchCrossSection.query.filter_by(research_id=research_id).all()
        return jsonify([cs.to_dict() for cs in cross_sections]), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@research_cross_section_bp.route("/research_cross_sections/<int:cross_section_id>", methods=["PUT"])
def update_research_cross_section(cross_section_id):
    try:
        cross_section = ResearchCrossSection.query.get_or_404(cross_section_id)
        data = request.get_json()
        cross_section.update_from_dict(data)
        db.session.commit()
        return jsonify(cross_section.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@research_cross_section_bp.route("/research_cross_sections/<int:cross_section_id>", methods=["DELETE"])
def delete_research_cross_section(cross_section_id):
    try:
        cross_section = ResearchCrossSection.query.get_or_404(cross_section_id)
        db.session.delete(cross_section)
        db.session.commit()
        return jsonify({"message": "Cross section deleted"}), 204
    except Exception as e:
        db.session.rollback()
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


