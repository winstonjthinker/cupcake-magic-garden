from rest_framework.authentication import get_authorization_header
from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed

class SafeJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication that allows unauthenticated access for SAFE methods
    even if a bad token is provided.
    """
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except (InvalidToken, TokenError, AuthenticationFailed):
            # If authentication fails but it's a safe method, return None
            # which means "unauthenticated" rather than raising 401.
            if request.method in permissions.SAFE_METHODS:
                return None
            raise
