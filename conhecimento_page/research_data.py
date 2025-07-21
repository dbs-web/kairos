from src.models.user import db
from datetime import datetime

class ResearchData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    research_type = db.Column(db.String(255))
    research_date = db.Column(db.Date)
    institute = db.Column(db.String(255))
    scope = db.Column(db.String(255))
    sample_size = db.Column(db.Integer)
    margin_of_error = db.Column(db.Float)
    methodology = db.Column(db.Text)
    key_findings = db.Column(db.Text)
    trends = db.Column(db.Text)
    electoral_scenario = db.Column(db.Text)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidate.id"), nullable=False)
    cross_sections = db.relationship("ResearchCrossSection", backref="research_data", lazy=True)

    def __repr__(self):
        return f"<ResearchData {self.research_type} - {self.research_date}>"

    def to_dict(self):
        return {
            "id": self.id,
            "research_type": self.research_type,
            "research_date": self.research_date.isoformat() if self.research_date else None,
            "institute": self.institute,
            "scope": self.scope,
            "sample_size": self.sample_size,
            "margin_of_error": self.margin_of_error,
            "methodology": self.methodology,
            "key_findings": self.key_findings,
            "trends": self.trends,
            "electoral_scenario": self.electoral_scenario,
            "candidate_id": self.candidate_id,
            "cross_sections": [cs.to_dict() for cs in self.cross_sections]
        }

