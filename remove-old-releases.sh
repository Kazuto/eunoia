#!/bin/bash

PACKAGE="@thkzt/eunoia"

echo "Unpublishing old beta versions for $PACKAGE..."
echo "Note: npm may block unpublishing if versions have dependents or recent downloads"
echo ""

failed=0
succeeded=0

# Get all versions, sort them, and remove the last one
versions=$(npm view "$PACKAGE" versions --json | jq -r '.[]' | sort -V)
latest_version=$(echo "$versions" | tail -n 1)
versions_to_remove=$(echo "$versions" | head -n -1)

for VERSION in $versions_to_remove; do
	echo -n "Unpublishing $VERSION... "
	if npm unpublish "$PACKAGE@$VERSION" 2>&1; then
		echo "✓"
		((succeeded++))
	else
		echo "✗ (blocked by npm)"
		((failed++))
	fi
done

echo ""
echo "Summary: $succeeded succeeded, $failed failed"
echo "Only $latest_version should remain."
