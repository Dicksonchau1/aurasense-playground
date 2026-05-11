from typing import Literal, Optional, Union, Annotated
from pydantic import BaseModel, Field, field_validator

AxisType = Literal["discrete","continuous","categorical"]

class _AxisCommon(BaseModel):
    id: str = Field(pattern=r"^[a-z][a-z0-9_]{1,40}$")
    label: str = Field(min_length=1, max_length=64)
    unit: Optional[str] = Field(default=None, max_length=16)
    enabled: bool
    seed_count: Optional[int] = Field(default=None, ge=1, le=32)
    importance: Optional[Literal["low","med","high"]] = None

class DiscreteAxis(_AxisCommon):
    type: Literal["discrete"]
    values: list[float] = Field(min_length=2, max_length=64)
    @field_validator("values")
    @classmethod
    def _unique(cls, v): 
        if len(set(v)) != len(v): raise ValueError("duplicate values")
        return v

class ContinuousAxis(_AxisCommon):
    type: Literal["continuous"]
    min: float
    max: float
    step: float = Field(gt=0)
    scale: Optional[Literal["linear","log"]] = "linear"

class CategoricalAxis(_AxisCommon):
    type: Literal["categorical"]
    values: list[str] = Field(min_length=2, max_length=32)

AxisDef = Annotated[Union[DiscreteAxis, ContinuousAxis, CategoricalAxis], Field(discriminator="type")]

class ImportanceResample(BaseModel):
    enabled: bool
    extra_runs: int = Field(ge=0, le=5000)
    target_axis: Optional[str] = None

class Sampling(BaseModel):
    strategy: Literal["grid","lhs","importance"]
    base_runs: int = Field(ge=50, le=50000)
    seeds_per_cell: int = Field(ge=1, le=16)
    importance_resample: Optional[ImportanceResample] = None

class Grid(BaseModel):
    axes: list[AxisDef] = Field(min_length=2, max_length=16)
    sampling: Sampling
