from app.controllers.notes_controller import router as notes_router
from app.controllers.categories_controller import router as categories_router
from app.controllers.auth_controller import router as auth_router

__all__ = ["notes_router", "categories_router", "auth_router"]