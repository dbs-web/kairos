from src.models.user import db
from datetime import datetime

class PoliticalMandate(db.Model):
    __tablename__ = 'political_mandates'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    position = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    commission_roles = db.Column(db.Text) # Cargos em Comissões Parlamentares
    key_projects_laws = db.Column(db.Text) # Projetos de Lei (JSONB seria melhor)
    important_votes = db.Column(db.Text) # Votações importantes (JSONB seria melhor)
    achievements_details = db.Column(db.Text) # Obras e Realizações
    social_programs = db.Column(db.Text) # Programas Sociais
    
    candidate = db.relationship('Candidate', backref=db.backref('political_mandates', lazy=True))

    def to_dict(self):
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime) or isinstance(value, datetime.date):
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
        return f'<PoliticalMandate {self.position} {self.start_date}>'


