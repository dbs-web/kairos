import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.models.candidate import Candidate
from src.models.social_media_profile import SocialMediaProfile
from src.models.political_mandate import PoliticalMandate
from src.models.parliamentary_amendment import ParliamentaryAmendment
from src.models.thematic_position import ThematicPosition
from src.models.election_history import ElectionHistory
from src.models.research_data import ResearchData # Importar ResearchData primeiro
from src.models.research_cross_section import ResearchCrossSection
from src.models.municipal_support import MunicipalSupport
from src.models.external_competitor import ExternalCompetitor
from src.models.internal_competitor import InternalCompetitor
from src.models.media_monitoring import MediaMonitoring
from src.models.vulnerability_dossier import VulnerabilityDossier
from src.routes.user import user_bp
from src.routes.candidate import candidate_bp
from src.routes.social_media_profile import social_media_profile_bp
from src.routes.political_mandate import political_mandate_bp
from src.routes.parliamentary_amendment import parliamentary_amendment_bp
from src.routes.thematic_position import thematic_position_bp
from src.routes.election_history import election_history_bp
from src.routes.research_cross_section import research_cross_section_bp
from src.routes.municipal_support import municipal_support_bp
from src.routes.external_competitor import external_competitor_bp
from src.routes.internal_competitor import internal_competitor_bp
from src.routes.media_monitoring import media_monitoring_bp
from src.routes.vulnerability_dossier import vulnerability_dossier_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Habilitar CORS para todas as rotas
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(candidate_bp, url_prefix='/api')
app.register_blueprint(social_media_profile_bp, url_prefix='/api')
app.register_blueprint(political_mandate_bp, url_prefix='/api')
app.register_blueprint(parliamentary_amendment_bp, url_prefix='/api')
app.register_blueprint(thematic_position_bp, url_prefix='/api')
app.register_blueprint(election_history_bp, url_prefix='/api')
app.register_blueprint(research_cross_section_bp, url_prefix='/api')
app.register_blueprint(municipal_support_bp, url_prefix='/api')
app.register_blueprint(external_competitor_bp, url_prefix=
'/api')
app.register_blueprint(internal_competitor_bp, url_prefix='/api')
app.register_blueprint(media_monitoring_bp, url_prefix='/api')
app.register_blueprint(vulnerability_dossier_bp, url_prefix='/api')
app.register_blueprint(marketing_strategy_bp, url_prefix='/api')