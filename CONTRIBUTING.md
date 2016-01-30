# contributing to stacking-order

If you find a bug, please create a pull request containing a minimal reproduction in the [test/samples](https://gitlab.com/Rich-Harris/stacking-order/tree/master/test/samples) directory. Your test is an HTML snippet containing one element with a `data-front` attribute and one with a `data-back` attribute – obviously `data-front` should render in front of `data-back`.

If you *fix* a bug, even better! Thanks in advance.

## Running the tests

After cloning the repo, install all the development dependencies with `npm install` and run the tests with `npm test`.
