"""
Sample test module in the tests directory.

This demonstrates that pytest can discover tests from multiple testpaths.
"""

import pytest


class TestSample:
    """Sample test suite."""

    def test_sample_test(self):
        """Sample test to verify pytest discovery in tests directory."""
        assert True, "Sample test in tests directory"

    def test_basic_assertion(self):
        """Basic assertion test."""
        result = 1 + 1
        assert result == 2, "Basic math test"


def test_independent_function():
    """Independent test function."""
    assert True, "Independent test function in tests directory"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
