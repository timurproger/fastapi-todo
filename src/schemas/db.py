from pydantic import BaseModel


class SCreateOrDownDB(BaseModel):
    ok: bool
    ditail: str


