from pydantic import BaseModel

class WishlistResponse(BaseModel):
    wishlist_id: int
    items: list[dict]

    class Config:
        from_attributes = True