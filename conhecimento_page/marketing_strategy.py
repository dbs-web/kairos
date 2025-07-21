from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.marketing_strategy import MarketingStrategy
import traceback

marketing_strategy_bp = Blueprint("marketing_strategy_bp", __name__)

@marketing_strategy_bp.route("/marketing_strategy", methods=["POST"])
def create_marketing_strategy():
    try:
        data = request.json
        new_strategy = MarketingStrategy.from_dict(data)
        db.session.add(new_strategy)
        db.session.commit()
        return jsonify(new_strategy.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@marketing_strategy_bp.route("/marketing_strategy/<int:id>", methods=["GET"])
def get_marketing_strategy(id):
    try:
        strategy = MarketingStrategy.query.get(id)
        if strategy:
            return jsonify(strategy.to_dict()), 200
        return jsonify({"message": "Marketing Strategy not found"}), 404
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@marketing_strategy_bp.route("/marketing_strategy/<int:id>", methods=["PUT"])
def update_marketing_strategy(id):
    try:
        strategy = MarketingStrategy.query.get(id)
        if strategy:
            data = request.json
            strategy.update_from_dict(data)
            db.session.commit()
            return jsonify(strategy.to_dict()), 200
        return jsonify({"message": "Marketing Strategy not found"}), 404
    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@marketing_strategy_bp.route("/marketing_strategy/<int:id>", methods=["DELETE"])
def delete_marketing_strategy(id):
    try:
        strategy = MarketingStrategy.query.get(id)
        if strategy:
            db.session.delete(strategy)
            db.session.commit()
            return jsonify({"message": "Marketing Strategy deleted"}), 200
        return jsonify({"message": "Marketing Strategy not found"}), 404
    except Exception as e:
        db.session.rollback()
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


