from pydantic import BaseModel

class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int
    

class CartResponse(BaseModel):
    cart_id: int
    items: list[dict]
    total_price: float

    class Config:
        from_attributes = True
