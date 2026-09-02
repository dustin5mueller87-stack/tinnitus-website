from __future__ import annotations

from pathlib import Path
import ast

WRAPPER = Path(__file__).resolve()
ORIGINAL = WRAPPER.with_name("apply_english_audit_stage3b_original.py")
source = ORIGINAL.read_text(encoding="utf-8")


class AddMissingPageArgument(ast.NodeTransformer):
    """Repair only replace_once(old, new, label) calls in the staged script.

    Every affected call appears after the script has assigned P to the page
    currently being edited. Calls that already include an explicit path are
    left untouched.
    """

    def __init__(self) -> None:
        self.fixed = 0

    def visit_Call(self, node: ast.Call) -> ast.AST:
        self.generic_visit(node)
        if (
            isinstance(node.func, ast.Name)
            and node.func.id == "replace_once"
            and len(node.args) == 3
            and not node.keywords
        ):
            node.args.insert(0, ast.Name(id="P", ctx=ast.Load()))
            self.fixed += 1
        return node


tree = ast.parse(source, filename=str(ORIGINAL))
fixer = AddMissingPageArgument()
tree = fixer.visit(tree)
ast.fix_missing_locations(tree)

if fixer.fixed < 1:
    raise RuntimeError("No missing replace_once page arguments were found")

namespace = {
    "__file__": str(WRAPPER),
    "__name__": "__main__",
}
exec(compile(tree, str(ORIGINAL), "exec"), namespace)
print(f"Repaired {fixer.fixed} staged replace_once calls before execution.")