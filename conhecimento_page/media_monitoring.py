from src.models.user import db
from datetime import datetime

class MediaMonitoring(db.Model):
    __tablename__ = 'media_monitoring'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    report_link = db.Column(db.String(500)) # link da reportagem
    content_tone = db.Column(db.String(50)) # positive/negative/neutral
    influencer_journalist = db.Column(db.Text) # influenciadores e jornalistas
    observation = db.Column(db.Text) # observações
    
    candidate = db.relationship('Candidate', backref=db.backref('media_monitoring', lazy=True))

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
        return f'<MediaMonitoring {self.report_link}>'


