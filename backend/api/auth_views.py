from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from rest_framework.decorators import api_view
from django.middleware.csrf import get_token

# ─────────────────────────────
# CSRF Token endpoint
# ─────────────────────────────
@api_view(["GET"])
def csrf_view(request):
    return JsonResponse({"csrfToken": get_token(request)})


# ─────────────────────────────
# SIGNUP
# ─────────────────────────────
@api_view(["POST"])
def signup_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username exists"}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return JsonResponse({"success": True})
    

# ─────────────────────────────
# LOGIN
# ─────────────────────────────
@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse({"success": True, "username": user.username})


# ─────────────────────────────
# LOGOUT
# ─────────────────────────────
@api_view(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True})


# ─────────────────────────────
# USER STATUS
# ─────────────────────────────
@api_view(["GET"])
def user_view(request):
    if request.user.is_authenticated:
        return JsonResponse({"loggedIn": True, "username": request.user.username})
    return JsonResponse({"loggedIn": False})
