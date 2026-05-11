import yaml
from services.rehearse.app.grid_schema import Grid
from apps.web.lib.sweep.defaults import DEFAULT_AXES, DEFAULT_SAMPLING

def test_grid_roundtrip():
    # Compose the default grid
    grid_dict = {"axes": DEFAULT_AXES, "sampling": DEFAULT_SAMPLING}
    # Serialize to YAML
    yaml_str = yaml.dump(grid_dict, sort_keys=False)
    # Deserialize back
    loaded = yaml.safe_load(yaml_str)
    # Validate with Pydantic
    grid = Grid(**loaded)
    # Re-serialize and compare
    assert grid.model_dump() == grid_dict
