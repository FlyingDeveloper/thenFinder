# thenFinder

Finds all calls to functions named `then` that do not pass two arguments.
The goal of this module is to prevent code from failing silently. When
forgetting to specify a reject handler on a promise, if there's an
exception in the code that should resolve the promise, the exception will
not be handled gracefully.
