from .base import *

# Import the appropriate settings based on the environment
import os

ENVIRONMENT = os.environ.get('DJANGO_ENV', 'development')

if ENVIRONMENT == 'production':
    from .prod import *
elif ENVIRONMENT == 'testing':
    from .test import *
else:
    from .dev import *
