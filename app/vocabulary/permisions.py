from rest_framework.permissions import BasePermission


class IsOwnerPermission(BasePermission):

    def has_object_permission(self, request, view, obj) -> bool: # noqa: ARG002
        return request.user == obj.owner