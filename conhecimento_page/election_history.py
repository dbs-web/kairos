from src.models.user import db
from datetime import datetime

class ElectionHistory(db.Model):
    __tablename__ = 'election_history'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    election_year = db.Column(db.Integer, nullable=False)
    position_disputed = db.Column(db.String(200), nullable=False)
    total_votes = db.Column(db.Integer)
    result = db.Column(db.String(100)) # Ex: 'Eleito', 'Não Eleito', 'Segundo Turno'
    geographic_vote_analysis = db.Column(db.Text) # JSONB seria melhor para mapa de calor
    
    candidate = db.relationship('Candidate', backref=db.backref('election_history', lazy=True))

    def to_dict(self):
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                result[column.name] = value.isoformat()
            else:
                result[column.name] = value
        return result
    
    @classmethod
    def from_dict(cls, data):
        data.pop('id', None)
        data.pop('created_at', None)
        data.pop('updated_at', None)
        return cls(**data)
    
    def update_from_dict(self, data):
        data.pop('id', None)
        data.pop('created_at', None)
        data.pop('updated_at', None)
        
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        self.updated_at = datetime.utcnow()
    
    def __repr__(self):
        return f'<ElectionHistory {self.election_year} {self.position_disputed}>'


