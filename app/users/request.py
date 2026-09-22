from django.http import HttpRequest
from rest_framework.request import Request

from users.models import User


class AuthenticatedHttpRequest(HttpRequest):
    """HttpRequest behind a login-required view, where the user is always authenticated."""

    user: User


class AuthenticatedRequest(Request):
    """DRF Request behind IsAuthenticated, where the user is always authenticated."""

    user: User
