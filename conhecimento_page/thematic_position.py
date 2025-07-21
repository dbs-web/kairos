from src.models.user import db
from datetime import datetime

class ThematicPosition(db.Model):
    __tablename__ = 'thematic_positions'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    area = db.Column(db.String(100), nullable=False) # Ex: Economia, Segurança Pública
    current_position = db.Column(db.Text) # Posição Atual
    historical_positions = db.Column(db.Text) # Histórico de Posições
    literal_quotes = db.Column(db.Text) # Citações literais
    
    candidate = db.relationship('Candidate', backref=db.backref('thematic_positions', lazy=True))

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
        return f'<ThematicPosition {self.area} for Candidate {self.candidate_id}>'


