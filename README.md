# RootLab

React + Tailwind (Vite) front end and an Express back end that takes payments through Cashfree (₹5 per method).
After a verified payment, a PDF with the C++ code and output for the user's equation downloads automatically.

## Run it
```bash
npm install
cp .env.example .env     # add your Cashfree App ID and Secret Key (sandbox keys to test)
npm start                # front end http://localhost:5173, API http://localhost:4000
```

## Structure
- `src/lib/templates.js`  C++ programs (Bisection, Newton-Raphson, Regula Falsi, Iterative, Secant)
- `src/lib/toCpp.js`      converts the typed equation into a C++ expression
- `src/lib/simulate.js`   runs the same algorithms to produce the program output
- `src/lib/pdf.js`        builds the PDF
- `src/lib/payment.js`    Cashfree checkout (browser)
- `server/index.js`       creates and verifies Cashfree orders (keeps the secret key off the browser)

## Going live
1. Set `CASHFREE_ENV=production`, use production keys, and `VITE_CASHFREE_MODE=production` when building.
2. Set `FRONTEND_URL` to your real domain and deploy the server (Render, Railway, a VPS...), then serve `dist/` and proxy `/api` to it.
3. Note: the PDF is generated in the browser after the server confirms PAID. For stricter protection, move PDF generation to the server and return it from `/api/verify/:orderId`.

## Notes
- Equations accept `^`, sin, cos, tan, exp, log (natural), sqrt, pi, e.
- Iterative method: type your own g(x), or leave blank and it uses g(x) = x - f(x)/f'(a).
# RootLab_Frontened
