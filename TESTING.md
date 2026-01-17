# Python Testing Setup

This repository includes Python test infrastructure using pytest.

## Configuration

The pytest configuration is defined in `pytest.ini` and includes:

- **Test Paths**: Tests are discovered in both `tests/` and `bridges/` directories
- **Test File Patterns**: Files matching `test_*.py` or `*_test.py`
- **Test Class Patterns**: Classes matching `Test*`
- **Test Function Patterns**: Functions matching `test_*`

## Running Tests

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run All Tests

```bash
pytest
```

### Run Tests with Verbose Output

```bash
pytest -v
```

### Run Tests from a Specific Directory

```bash
pytest tests/
pytest bridges/
```

### Run a Specific Test File

```bash
pytest bridges/kenl/test_orchestrator.py
pytest tests/test_sample.py
```

### Check Test Discovery

```bash
pytest --collect-only
```

Example output:
```
collected 6 items

<Package tests>
  <Module test_sample.py>
    ...
<Package bridges>
  <Package kenl>
    <Module test_orchestrator.py>
      ...
```

## Test Locations

- **tests/**: Standard test directory for general tests
- **bridges/kenl/**: Test directory for KENL orchestrator functionality

Both directories are configured in `pytest.ini` as test paths, ensuring all tests are discovered and run.

## Adding New Tests

1. Create test files with the naming pattern `test_*.py` or `*_test.py`
2. Place test files in either the `tests/` or `bridges/` directory tree
3. Use standard pytest conventions for test functions and classes
4. Run `pytest --collect-only` to verify your tests are discovered

## Example Test Structure

```python
import pytest

class TestExample:
    """Test suite for example functionality."""
    
    def test_something(self):
        """Test something specific."""
        assert True
        
def test_standalone():
    """Standalone test function."""
    assert True
```
