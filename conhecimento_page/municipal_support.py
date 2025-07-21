from src.models.user import db
from datetime import datetime

class MunicipalSupport(db.Model):
    __tablename__ = 'municipal_support'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    municipality_name = db.Column(db.String(200), nullable=False)
    mayor_name = db.Column(db.String(200))
    mayor_party = db.Column(db.String(100))
    alliance_status = db.Column(db.String(100)) # Ex: 'Aliado Estratégico', 'Oposição Declarada'
    local_leaders = db.Column(db.Text) # Vice-prefeitos, vereadores, ex-prefeitos
    strategic_observations = db.Column(db.Text) # Observações estratégicas
    
    candidate = db.relationship('Candidate', backref=db.backref('municipal_support', lazy=True))

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
        return f'<MunicipalSupport {self.municipality_name}>'


