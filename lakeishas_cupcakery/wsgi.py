import os
import sys
from pathlib import Path

# Add the project directory to the sys.path to ensure 'config' is importable
# This is necessary because Render might run gunicorn from the repo root,
# and the Django project is inside 'lakeishas_cupcakery'.
path = Path(__file__).resolve().parent
if str(path) not in sys.path:
    sys.path.append(str(path))

from config.wsgi import application
